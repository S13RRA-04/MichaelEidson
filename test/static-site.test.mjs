import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homePath = new URL("../author-site/dist/index.html", import.meta.url);
const lorePath = new URL("../author-site/dist/lore/index.html", import.meta.url);
const eladriaPath = new URL("../author-site/dist/eladria/index.html", import.meta.url);
const eladriaScriptPath = new URL("../author-site/dist/eladria/eladria.js", import.meta.url);

test("homepage exposes the real contact address and lore journey", async () => {
  const html = await readFile(homePath, "utf8");

  assert.match(html, /mailto:contact@michaeleidson\.com/);
  assert.match(html, /href="\/lore\/"/);
  assert.match(html, /href="\/eladria\/"/);
  assert.match(html, /The Ruin of Nations/);
  assert.match(html, /tentatively titled/i);
  assert.doesNotMatch(html, /newsletter|mailing list|subscribe/i);
});

test("Eladria explorer exposes an interactive map, artifacts, and spoiler-light characters", async () => {
  const [html, script] = await Promise.all([
    readFile(eladriaPath, "utf8"),
    readFile(eladriaScriptPath, "utf8")
  ]);

  assert.match(html, /eladria-map\.jpg/);
  assert.doesNotMatch(html, /eladria-map\.png/);
  assert.match(html, /zions-vale\.png/);
  assert.match(html, /data-location="zions-vale"/);
  assert.match(html, /--x:56\.8%;--y:66\.2%/);
  assert.match(html, /Select a location symbol/);
  assert.match(html, /--x:43\.11%;--y:41\.16%/);
  assert.match(html, /--x:23\.35%;--y:38\.59%/);
  assert.match(html, /--x:58\.56%;--y:52\.13%/);
  assert.match(html, /--x:16\.94%;--y:9\.17%/);
  assert.doesNotMatch(html, /legend-dot/);
  assert.match(html, /data-artifact="wellstone"/);
  for (const character of ["Jovan Ga'al", "Eazra Horama", "Rhyse Zetema", "Lorcan"]) {
    assert.match(html, new RegExp(character));
  }
  assert.match(html, /Spoiler-light/);
  assert.match(script, /mapScale/);
  assert.match(script, /artifact-description/);
  assert.match(script, /imageWrap\.hidden/);
});

test("lore page contains published canon and no newsletter placeholder", async () => {
  const html = await readFile(lorePath, "utf8");

  for (const term of ["Valorra", "Cognitia", "Sanctaria", "Trivera", "Wellstone", "The Raiment"]) {
    assert.match(html, new RegExp(term));
  }
  assert.match(html, /Safe for new readers/);
  assert.doesNotMatch(html, /newsletter|mailing list|subscribe/i);
});
