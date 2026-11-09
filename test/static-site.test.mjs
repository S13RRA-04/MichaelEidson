import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homePath = new URL("../author-site/dist/index.html", import.meta.url);
const lorePath = new URL("../author-site/dist/lore/index.html", import.meta.url);

test("homepage exposes the real contact address and lore journey", async () => {
  const html = await readFile(homePath, "utf8");

  assert.match(html, /mailto:contact@michaeleidson\.com/);
  assert.match(html, /href="\/lore\/"/);
  assert.doesNotMatch(html, /newsletter|mailing list|subscribe/i);
});

test("lore page contains published canon and no newsletter placeholder", async () => {
  const html = await readFile(lorePath, "utf8");

  for (const term of ["Valorra", "Cognitia", "Sanctaria", "Trivera", "Wellstone", "The Raiment"]) {
    assert.match(html, new RegExp(term));
  }
  assert.match(html, /Safe for new readers/);
  assert.doesNotMatch(html, /newsletter|mailing list|subscribe/i);
});
