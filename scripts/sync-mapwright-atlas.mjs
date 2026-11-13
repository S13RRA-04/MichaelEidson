import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [atlasArg, outputArg] = process.argv.slice(2);
if (!atlasArg || !outputArg) {
  console.error("Usage: node scripts/sync-mapwright-atlas.mjs <atlas.json> <output.js>");
  process.exit(1);
}

const atlas = JSON.parse(await readFile(resolve(atlasArg), "utf8"));
if (atlas.app !== "mapwright-atlas" || !Array.isArray(atlas.maps)) {
  throw new Error("The input is not a Mapwright atlas.");
}

const entry = atlas.maps.find((candidate) => candidate.id === atlas.activeId);
if (!entry) throw new Error("The atlas active map does not exist.");

const map = entry.map;
const placeTypes = new Set([
  "capital", "city", "town", "village", "port", "castle", "tower",
  "temple", "ruins", "cave", "station", "ford", "battle", "poi"
]);
const labels = map.labels.filter((label) => label.style === "place");
const markers = map.markers.filter((marker) => placeTypes.has(marker.type));
const candidates = [];

labels.forEach((label, labelIndex) => {
  markers.forEach((marker, markerIndex) => {
    candidates.push({
      labelIndex,
      markerIndex,
      distance: Math.hypot(marker.x - label.x, marker.y - label.y)
    });
  });
});
candidates.sort((left, right) => left.distance - right.distance);

const usedLabels = new Set();
const usedMarkers = new Set();
const matches = [];
for (const candidate of candidates) {
  if (candidate.distance > 100 || usedLabels.has(candidate.labelIndex) || usedMarkers.has(candidate.markerIndex)) continue;
  usedLabels.add(candidate.labelIndex);
  usedMarkers.add(candidate.markerIndex);
  matches.push({
    label: labels[candidate.labelIndex],
    marker: markers[candidate.markerIndex]
  });
}

const slug = (value) => value
  .toLowerCase()
  .replace(/[’']/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const locations = matches
  .sort((left, right) => labels.indexOf(left.label) - labels.indexOf(right.label))
  .map(({ label, marker }, index) => ({
    id: slug(label.text),
    name: label.text,
    type: marker.type,
    x: Number((marker.x / map.width * 100).toFixed(3)),
    y: Number((marker.y / map.height * 100).toFixed(3)),
    index: `${String(index + 1).padStart(2, "0")} / ${matches.length}`
  }));

const data = {
  atlas: atlas.name,
  map: map.name,
  image: "./eladria-ruin-of-nations.png",
  width: map.width,
  height: map.height,
  locations
};

await writeFile(resolve(outputArg), `window.mapwrightBook2 = ${JSON.stringify(data, null, 2)};\n`, "utf8");
console.log(`Synced ${locations.length} Mapwright locations from ${atlas.name}.`);
