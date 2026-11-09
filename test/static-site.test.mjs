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
  assert.match(script, /havenbrook\.jpg/);
  assert.match(script, /Havenbrook beside its river, rail depot, civic square, and mountain roads/);
  assert.match(script, /brima-bastia\.jpg/);
  assert.match(script, /Brima Bastia's mountain fortress, walled capital, military gate, and red-and-gold banners/);
  assert.match(script, /dreamers-oasis\.jpg/);
  assert.match(script, /The Dreamer's Oasis, a green sanctuary and turquoise lake enclosed by snowy mountain peaks/);
  assert.match(script, /trivera\.jpg/);
  assert.match(script, /Trivera's domed Tribunal overlooking the Unity Garden and the crowded neutral city/);
  assert.match(script, /verimere\.jpg/);
  assert.match(script, /Verimere's treetop libraries, glass halls, bridges, and waterfalls beneath an immense forest canopy/);
  assert.match(script, /divinae\.jpg/);
  assert.match(script, /Divinae's gilded domed sanctuary overlooking a ceremonial square in Sanctaria/);
  assert.match(html, /data-location="zions-vale"/);
  assert.match(html, /--x:57\.51%;--y:64\.90%/);
  assert.match(html, /Select a location symbol/);
  assert.match(html, /--x:43\.11%;--y:41\.16%/);
  assert.match(html, /--x:23\.35%;--y:38\.59%/);
  assert.match(html, /--x:24\.87%;--y:19\.41%/);
  assert.match(html, /--x:54\.48%;--y:21\.65%/);
  assert.match(html, /--x:24\.71%;--y:25\.36%/);
  assert.match(html, /--x:18\.83%;--y:40\.19%/);
  assert.match(html, /--x:59\.06%;--y:58\.99%/);
  assert.match(html, /--x:25\.86%;--y:70\.95%/);
  assert.match(html, /--x:69\.58%;--y:79\.56%/);
  assert.match(html, /--x:74\.79%;--y:86\.02%/);
  assert.equal((html.match(/class="map-pin(?: active)?"/g) || []).length, 13);
  for (const location of ["respus", "divinae", "aperito", "marinport", "havenbrook", "wardengate", "uigeschan", "ceolpurt"]) {
    assert.match(html, new RegExp(`data-location="${location}"`));
    assert.match(script, new RegExp(`\\b${location}:`));
  }
  assert.match(html, /--x:58\.56%;--y:52\.13%/);
  assert.match(html, /--x:16\.94%;--y:9\.17%/);
  assert.doesNotMatch(html, /legend-dot/);
  assert.match(html, /data-artifact="wellstone"/);
  for (const character of ["Jovan Ga'al", "Eazra Horama", "Rhyse Zetema", "Lorcan", "Sela"]) {
    assert.match(html, new RegExp(character));
  }
  assert.match(html, /\.\/jovan-gaal\.jpg/);
  assert.match(html, /alt="Jovan Ga'al in his frontier Ranger coat, broad-brimmed hat, and weathered armor"/);
  assert.match(html, /\.\/eazra-horama\.jpg/);
  assert.match(html, /alt="Eazra Horama in layered Dreamer robes and a warm umber cloak"/);
  assert.match(html, /\.\/rhyse-zetema\.jpg/);
  assert.match(html, /alt="Rhyse Zetema seated in his weathered Ranger coat with his hat and decorated bracer"/);
  assert.match(html, /\.\/lorcan\.jpg/);
  assert.match(html, /alt="Lorcan carrying a travel staff and book, dressed in layered robes and an orange scarf"/);
  assert.match(html, /Five lives enter the story/);
  assert.match(html, /Lorcans?[^<]*Uhuran half-sister|Lorcan's Uhuran half-sister/);
  assert.match(html, /Spoiler-light/);
  assert.match(script, /mapScale/);
  assert.match(script, /artifact-description/);
  assert.match(script, /imageWrap\.hidden/);
  assert.match(html, /id="attunement"/);
  assert.match(html, /id="quiz-wellstone"/);
  assert.match(html, /Touch the wellstone/);
  assert.equal((script.match(/colorName:/g) || []).length, 8);
  for (const branch of ["joy", "trust", "fear", "surprise", "sadness", "disgust", "anger", "anticipation"]) {
    assert.match(script, new RegExp(`\\b${branch}: \\{ name:`));
  }
  assert.equal((script.match(/scenario:/g) || []).length, 6);
  assert.match(script, /quizWellstone\.classList\.add\("attuned"\)/);
  assert.match(script, /Attunement complete/);
});

test("lore page contains published canon and no newsletter placeholder", async () => {
  const html = await readFile(lorePath, "utf8");

  for (const term of ["Valorra", "Cognitia", "Sanctaria", "Trivera", "Wellstone", "The Raiment"]) {
    assert.match(html, new RegExp(term));
  }
  assert.match(html, /Safe for new readers/);
  assert.doesNotMatch(html, /newsletter|mailing list|subscribe/i);
});
