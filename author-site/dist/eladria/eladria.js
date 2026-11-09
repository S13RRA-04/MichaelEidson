const locations = {
  "zions-vale": { region: "Valorran frontier", index: "01 / 05", name: "Zion's Vale", description: "A hard-used settlement where the southern road meets the frontier. Its burning sets the first great journey in motion.", image: "./zions-vale.png", imageAlt: "Zion's Vale, a frontier settlement beneath the mountains" },
  trivera: { region: "Neutral city", index: "02 / 05", name: "Trivera", description: "Seat of the Tribunal, the Sovereignty Assembly, and the Emonantic Academy. It belongs to no nation—and therefore to all three." },
  verimere: { region: "Cognitia", index: "03 / 05", name: "Verimere", description: "A capital of libraries, registers, and inquiry. Its scholars preserve more of Eladria's history than most rulers find comfortable." },
  "brima-bastia": { region: "Valorra", index: "04 / 05", name: "Brima Bastia", description: "The fortress-capital of Valorra and home of the Martial Tribunal, built where mountains narrow the roads of empire." },
  oasis: { region: "Beyond the Frostmyr", index: "05 / 05", name: "The Dreamer's Oasis", description: "A valley of perpetual summer enclosed by ice, where Dreamers study the currents of feeling and the shapes of possible futures." }
};
document.querySelectorAll(".map-pin").forEach((pin) => pin.addEventListener("click", () => {
  const location = locations[pin.dataset.location];
  document.querySelectorAll(".map-pin").forEach((item) => item.classList.toggle("active", item === pin));
  document.getElementById("location-region").textContent = location.region;
  document.getElementById("location-index").textContent = location.index;
  document.getElementById("location-name").textContent = location.name;
  document.getElementById("location-description").textContent = location.description;
  const imageWrap = document.getElementById("location-image-wrap");
  const image = document.getElementById("location-image");
  imageWrap.hidden = !location.image;
  if (location.image) {
    image.src = location.image;
    image.alt = location.imageAlt;
  }
}));
let mapScale = 1;
const mapCanvas = document.getElementById("map-canvas");
const mapZoom = document.getElementById("map-zoom");
document.querySelectorAll("[data-map-action]").forEach((control) => control.addEventListener("click", () => {
  if (control.dataset.mapAction === "in") mapScale = Math.min(2, mapScale + 0.25);
  if (control.dataset.mapAction === "out") mapScale = Math.max(1, mapScale - 0.25);
  if (control.dataset.mapAction === "reset") mapScale = 1;
  mapCanvas.style.width = `${mapScale * 100}%`;
  mapZoom.value = `${Math.round(mapScale * 100)}%`;
  mapZoom.textContent = mapZoom.value;
}));
const artifacts = {
  wellstone: { glyph: "W", className: "Emonantic crystal", name: "Wellstone", thesis: "Feeling, held.", description: "Crystal capable of storing a single emotional current. It lights lamps, powers engines, serves as currency, and carries a more dangerous purpose inside a charge.", use: "Power, trade, weaponry", status: "Common / regulated" },
  chargers: { glyph: "C", className: "Emonantic firearm", name: "Chargers", thesis: "Emotion, fired.", description: "Firearms loaded with wellstone. The current inside determines the effect: fear can break resolve, surprise can stun, and anger can tear flesh.", use: "Military and law", status: "Controlled armament" },
  medallion: { glyph: "VIII", className: "Uncatalogued relic", name: "The Medallion", thesis: "A door without a room.", description: "An eight-pointed medallion with a white center and shifting threads of color. Its worn rim bears marks few living readers could name.", use: "Unknown", status: "Provenance disputed" },
  raiment: { glyph: "R", className: "Mythic inheritance", name: "The Raiment", thesis: "Eight pieces. Scattered.", description: "Objects left by Eladriz Immenuae before the first Emonari died. History, doctrine, and rumor disagree about nearly everything else.", use: "Unknown", status: "Lost / legendary" }
};
document.querySelectorAll("[data-artifact]").forEach((tab) => tab.addEventListener("click", () => {
  const artifact = artifacts[tab.dataset.artifact];
  document.querySelectorAll("[data-artifact]").forEach((item) => { const selected = item === tab; item.classList.toggle("active", selected); item.setAttribute("aria-selected", String(selected)); });
  document.getElementById("artifact-glyph").textContent = artifact.glyph;
  document.getElementById("artifact-class").textContent = artifact.className;
  document.getElementById("artifact-name").textContent = artifact.name;
  document.getElementById("artifact-thesis").textContent = artifact.thesis;
  document.getElementById("artifact-description").textContent = artifact.description;
  document.getElementById("artifact-use").textContent = artifact.use;
  document.getElementById("artifact-status").textContent = artifact.status;
}));
