import { spawn } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [atlasArg, outputArg] = process.argv.slice(2);

if (!atlasArg || !outputArg) {
  console.error("Usage: node scripts/export-mapwright-atlas.mjs <atlas.json> <output.png>");
  process.exit(1);
}

const atlasPath = resolve(atlasArg);
const outputPath = resolve(outputArg);
const mapwrightPath = resolve("Mapwright/Mapwright.html");
const chromeCandidates = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe"
];
const browserPath = chromeCandidates.find(existsSync);

if (!browserPath) throw new Error("Chrome or Edge is required to export a Mapwright atlas.");

const atlas = JSON.parse(await readFile(atlasPath, "utf8"));
if (atlas.app !== "mapwright-atlas" || !Array.isArray(atlas.maps)) {
  throw new Error(`${basename(atlasPath)} is not a Mapwright atlas.`);
}

const active = atlas.maps.find((entry) => entry.id === atlas.activeId);
if (!active) throw new Error("The atlas active map does not exist.");

const workDir = await mkdtemp(join(tmpdir(), "mapwright-export-"));
const downloadDir = join(workDir, "downloads");
const profileDir = join(workDir, "profile");
await mkdir(downloadDir);

let html = await readFile(mapwrightPath, "utf8");
const serializedAtlas = JSON.stringify(atlas).replaceAll("</script", "<\\/script");
const atlasPattern = /Kg=Ug\?\?co\(t_\(\),`world`\)/;
const exportPattern = /e_=\{editor:Q,raster:Xg,toast:Hg,extras:\$g\};/;

if (!atlasPattern.test(html) || !exportPattern.test(html)) {
  throw new Error("This Mapwright build does not expose the expected standalone export hooks.");
}

html = html
  .replace(atlasPattern, `Kg=xl(${serializedAtlas})`)
  .replace(exportPattern, (match) => `${match}window.__mapwrightExport=()=>$a(e_);`);

const temporaryHtml = join(workDir, "Mapwright-export.html");
await writeFile(temporaryHtml, html, "utf8");

const browser = spawn(browserPath, [
  "--headless=new",
  "--disable-gpu",
  "--disable-extensions",
  "--no-first-run",
  "--no-default-browser-check",
  "--allow-file-access-from-files",
  "--remote-debugging-port=0",
  `--user-data-dir=${profileDir}`,
  "about:blank"
], { stdio: "ignore", windowsHide: true });

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
const activePortFile = join(profileDir, "DevToolsActivePort");
let deadline = Date.now() + 30_000;

while (!existsSync(activePortFile)) {
  if (Date.now() > deadline) throw new Error("Timed out waiting for the browser debugging port.");
  await delay(100);
}

const [port, browserSocketPath] = (await readFile(activePortFile, "utf8")).trim().split(/\r?\n/);
const socket = new WebSocket(`ws://127.0.0.1:${port}${browserSocketPath}`);
await new Promise((resolveOpen, rejectOpen) => {
  socket.addEventListener("open", resolveOpen, { once: true });
  socket.addEventListener("error", rejectOpen, { once: true });
});

let nextId = 1;
const pending = new Map();
const runtimeErrors = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
  }
  if (!message.id || !pending.has(message.id)) return;
  const { resolve: resolveCall, reject: rejectCall } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) rejectCall(new Error(message.error.message));
  else resolveCall(message.result);
});

const call = (method, params = {}, sessionId) => new Promise((resolveCall, rejectCall) => {
  const id = nextId++;
  pending.set(id, { resolve: resolveCall, reject: rejectCall });
  socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
});

try {
  await call("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: downloadDir, eventsEnabled: true });
  const { targetInfos } = await call("Target.getTargets");
  const page = targetInfos.find((target) => target.type === "page");
  if (!page) throw new Error("The export browser did not create a page.");
  const { sessionId } = await call("Target.attachToTarget", { targetId: page.targetId, flatten: true });
  await call("Runtime.enable", {}, sessionId);
  await call("Page.enable", {}, sessionId);
  await call("Page.navigate", { url: pathToFileURL(temporaryHtml).href }, sessionId);

  deadline = Date.now() + 120_000;
  let exportReady = false;
  while (Date.now() <= deadline) {
    const ready = await call("Runtime.evaluate", {
      expression: "document.readyState === 'complete' && typeof window.__mapwrightExport === 'function'",
      returnByValue: true
    }, sessionId);
    if (ready.result.value) {
      exportReady = true;
      break;
    }
    await delay(150);
  }
  if (!exportReady) {
    const diagnostic = await call("Runtime.evaluate", {
      expression: "({ readyState: document.readyState, title: document.title, exportType: typeof window.__mapwrightExport, body: document.body?.innerText?.slice(0, 300) })",
      returnByValue: true
    }, sessionId);
    throw new Error(`Mapwright export hook did not become ready: ${JSON.stringify(diagnostic.result.value)}; runtime errors: ${runtimeErrors.join(" | ") || "none"}`);
  }

  const result = await call("Runtime.evaluate", {
    expression: "window.__mapwrightExport()",
    awaitPromise: true,
    returnByValue: true
  }, sessionId);
  if (result.exceptionDetails) {
    const detail = result.exceptionDetails.exception?.description ?? result.exceptionDetails.text;
    throw new Error(detail);
  }

  let exportedFile;
  deadline = Date.now() + 60_000;
  while (Date.now() <= deadline) {
    const files = await readdir(downloadDir);
    exportedFile = files.find((file) => file.toLowerCase().endsWith(".png") && !file.endsWith(".crdownload"));
    if (exportedFile) break;
    await delay(200);
  }
  if (!exportedFile) throw new Error("Mapwright did not produce a PNG before the timeout.");

  await mkdir(resolve(outputPath, ".."), { recursive: true });
  await copyFile(join(downloadDir, exportedFile), outputPath);
  console.log(`Exported ${active.map.name} from ${atlas.name} to ${outputPath}`);
} finally {
  socket.close();
  browser.kill();
  await Promise.race([
    new Promise((resolveExit) => browser.once("exit", resolveExit)),
    delay(3_000)
  ]);
  try {
    await rm(workDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
  } catch {
    // Chrome crash-metrics files can remain locked briefly; the OS temp directory can reclaim them later.
  }
}
