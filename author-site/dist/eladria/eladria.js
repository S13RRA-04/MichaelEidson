const locations = {
  "zions-vale": { region: "Valorran frontier", index: "01 / 14", name: "Zion's Vale", description: "A hard-used settlement where the southern road meets the frontier. Its burning sets the first great journey in motion.", image: "./zions-vale.png", imageAlt: "Zion's Vale, a frontier settlement beneath the mountains" },
  trivera: { region: "Neutral city", index: "02 / 14", name: "Trivera", description: "Seat of the Tribunal, the Sovereignty Assembly, and the Emonantic Academy. It belongs to no nation—and therefore to all three.", image: "./trivera.jpg", imageAlt: "Trivera's domed Tribunal overlooking the Unity Garden and the crowded neutral city" },
  verimere: { region: "Cognitia", index: "03 / 14", name: "Verimere", description: "A capital of libraries, registers, and inquiry. Its scholars preserve more of Eladria's history than most rulers find comfortable.", image: "./verimere.jpg", imageAlt: "Verimere's treetop libraries, glass halls, bridges, and waterfalls beneath an immense forest canopy" },
  "brima-bastia": { region: "Valorra", index: "04 / 14", name: "Brima Bastia", description: "The fortress-capital of Valorra and home of the Martial Tribunal, built where mountains narrow the roads of empire.", image: "./brima-bastia.jpg", imageAlt: "Brima Bastia's mountain fortress, walled capital, military gate, and red-and-gold banners" },
  oasis: { region: "Beyond the Frostmyr", index: "05 / 14", name: "The Dreamer's Oasis", description: "A valley of perpetual summer enclosed by ice, where Dreamers study the currents of feeling and the shapes of possible futures.", image: "./dreamers-oasis.jpg", imageAlt: "The Dreamer's Oasis, a green sanctuary and turquoise lake enclosed by snowy mountain peaks" },
  respus: { region: "Northern Cognitia", index: "06 / 14", name: "Respus", description: "A pilgrim town above an abandoned quarry, where mountain roads gather travelers before the approaches to the Frostmyr.", image: "./respus.jpg", imageAlt: "Respus, a pilgrim town above an abandoned mountain quarry with travelers, stables, and a stream" },
  divinae: { region: "Sanctaria", index: "07 / 14", name: "Divinae", description: "The marked capital of Sanctaria, inland from the northern coast and east of the Frostmyr.", image: "./divinae.jpg", imageAlt: "Divinae's gilded domed sanctuary overlooking a ceremonial square in Sanctaria" },
  aperito: { region: "Northern Cognitia", index: "08 / 14", name: "Aperito", description: "A settlement between Cognitia's forested country and the mountain roads to the north." },
  marinport: { region: "Cognitian coast", index: "09 / 14", name: "Marinport", description: "A western harbor where Cognitia meets the sea." },
  havenbrook: { region: "Valorra", index: "10 / 14", name: "Havenbrook", description: "A Valorran settlement north of Zion's Vale, near the eastern mountain country.", image: "./havenbrook.jpg", imageAlt: "Havenbrook beside its river, rail depot, civic square, and mountain roads" },
  wardengate: { region: "Al-Andaluqia", index: "11 / 14", name: "Wardengate", description: "A fortified settlement guarding the mountain road toward Valorra." },
  uigeschan: { region: "Maritara", index: "12 / 14", name: "Uigeschan", description: "An inland Maritaran settlement north of the Dread Strait." },
  ceolpurt: { region: "Maritaran coast", index: "13 / 14", name: "Ceolpurt", description: "A port on Maritara's southeastern coast." },
  "dom-mendacium": { region: "Northern mountains", index: "14 / 14", name: "Dom'Mendacium", description: "A ruined mountain fortress reached by twin bridges, hidden among the frozen approaches beyond Cognitia.", image: "./dom-mendacium.jpg", imageAlt: "Dom'Mendacium, a ruined fortress beyond twin bridges in the snowy northern mountains" }
};
const domMendaciumPin = document.createElement("button");
domMendaciumPin.className = "map-pin";
domMendaciumPin.type = "button";
domMendaciumPin.dataset.location = "dom-mendacium";
domMendaciumPin.setAttribute("aria-label", "Open field note for Dom'Mendacium");
domMendaciumPin.style.setProperty("--x", "20.35%");
domMendaciumPin.style.setProperty("--y", "13.32%");
domMendaciumPin.append(document.createElement("span"));
document.getElementById("map-canvas").append(domMendaciumPin);
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

const emonariBranches = {
  joy: { name: "Joy", color: "#e0b34f", colorName: "gold", thesis: "You make light that others can stand inside.", description: "You meet hardship by protecting the possibility of delight. A Joy Emonari does not ignore darkness; they insist it has not won." },
  trust: { name: "Trust", color: "#b9d99e", colorName: "pale green", thesis: "You build the ground beneath a company.", description: "Loyalty, connection, and earned faith guide you. A Trust Emonari turns separate people into something stronger than any one of them." },
  fear: { name: "Fear", color: "#58a66c", colorName: "green", thesis: "You notice the danger before it has a name.", description: "Caution is not cowardice in your hands. A Fear Emonari reads risk clearly, survives what others overlook, and keeps watch when certainty fails." },
  surprise: { name: "Surprise", color: "#9fc9da", colorName: "pale blue", thesis: "You change the shape of the moment.", description: "You are alert to openings, reversals, and the unexpected. A Surprise Emonari thrives where a rigid plan breaks and something new must happen now." },
  sadness: { name: "Sadness", color: "#5f89bd", colorName: "blue", thesis: "You remember what the world cannot afford to lose.", description: "You honor consequence and carry memory with care. A Sadness Emonari finds strength in grief without pretending the wound was never there." },
  disgust: { name: "Disgust", color: "#9b72aa", colorName: "purple", thesis: "You know what must not be allowed to stand.", description: "Your instincts sharpen around corruption, cruelty, and falsehood. A Disgust Emonari draws clear boundaries and refuses to call poison medicine." },
  anger: { name: "Anger", color: "#c85848", colorName: "red", thesis: "You move when the line has been crossed.", description: "Injustice turns feeling into action for you. An Anger Emonari is force, courage, and refusal—most powerful when rage serves a purpose beyond itself." },
  anticipation: { name: "Anticipation", color: "#cf8140", colorName: "orange", thesis: "You are already preparing for what comes next.", description: "Patterns, possibilities, and momentum draw your eye forward. An Anticipation Emonari makes readiness feel almost like prophecy." }
};

const attunementQuestions = [
  { scenario: "A warning at dusk", prompt: "A rider arrives with word that danger is one night away. What do you do first?", answers: [
    ["Fortify the gate and dare it to come.", "anger"], ["Find every weak point and prepare an escape.", "fear"], ["Gather the town and give everyone a task.", "trust"], ["Set a trap no invader would expect.", "surprise"]
  ] },
  { scenario: "A buried record", prompt: "You uncover a truth powerful people erased. What matters most?", answers: [
    ["Preserving the names of those who paid for it.", "sadness"], ["Exposing the rot that required the lie.", "disgust"], ["Understanding what the truth will change next.", "anticipation"], ["Giving people a reason to believe change is possible.", "joy"]
  ] },
  { scenario: "The company falters", prompt: "Your companions are exhausted and beginning to turn on one another. You…", answers: [
    ["Remind them why they chose to travel together.", "trust"], ["Lay out the road ahead and the next reachable goal.", "anticipation"], ["Confront the grievance before it poisons the group.", "anger"], ["Make room for what everyone has lost.", "sadness"]
  ] },
  { scenario: "The plan breaks", prompt: "The careful plan fails in its first minute. Your instinct is to…", answers: [
    ["Use the confusion before anyone else recovers.", "surprise"], ["Find the absurdity that keeps panic from winning.", "joy"], ["Stop, listen, and locate the hidden threat.", "fear"], ["Abandon the compromised plan completely.", "disgust"]
  ] },
  { scenario: "Power offered", prompt: "Someone offers you authority with one troubling condition. You focus on…", answers: [
    ["Who will be hurt if you refuse to challenge it.", "anger"], ["What accepting it would make you become.", "disgust"], ["Whether the person offering it has earned belief.", "trust"], ["The danger hidden inside the condition.", "fear"]
  ] },
  { scenario: "A road unopened", prompt: "At the edge of the known map, what pulls you onward?", answers: [
    ["The wonder of seeing what no one has described.", "joy"], ["The stories left behind by those who vanished there.", "sadness"], ["The chance that the world is stranger than expected.", "surprise"], ["The feeling that what comes next has already begun.", "anticipation"]
  ] }
];

const quizStart = document.getElementById("quiz-start");
if (quizStart) {
  const quizIntro = document.getElementById("quiz-intro");
  const quizQuestion = document.getElementById("quiz-question");
  const quizResult = document.getElementById("quiz-result");
  const quizAnswers = document.getElementById("quiz-answers");
  const quizWellstone = document.getElementById("quiz-wellstone");
  const wellstoneStatus = document.getElementById("wellstone-status");
  const quizLive = document.getElementById("quiz-live");
  let questionIndex = 0;
  let choices = [];

  const resetWellstone = () => {
    quizWellstone.classList.remove("attuned");
    quizWellstone.style.removeProperty("--wellstone-color");
    quizResult.style.removeProperty("--wellstone-color");
    quizWellstone.setAttribute("aria-label", "An unlit wellstone awaiting attunement");
    wellstoneStatus.textContent = "Listening";
  };

  const renderQuestion = () => {
    const question = attunementQuestions[questionIndex];
    document.getElementById("quiz-step").textContent = `Question ${questionIndex + 1} of ${attunementQuestions.length}`;
    document.getElementById("quiz-progress-bar").style.width = `${((questionIndex + 1) / attunementQuestions.length) * 100}%`;
    document.getElementById("quiz-scenario").textContent = question.scenario;
    document.getElementById("quiz-prompt").textContent = question.prompt;
    quizAnswers.replaceChildren();
    question.answers.forEach(([label, branch], answerIndex) => {
      const answer = document.createElement("button");
      answer.type = "button";
      answer.innerHTML = `<span>${String.fromCharCode(65 + answerIndex)}</span>${label}`;
      answer.addEventListener("click", () => {
        choices.push(branch);
        questionIndex += 1;
        if (questionIndex < attunementQuestions.length) {
          renderQuestion();
          document.getElementById("quiz-prompt").focus();
        } else {
          revealResult();
        }
      });
      quizAnswers.append(answer);
    });
    quizLive.textContent = `Question ${questionIndex + 1}: ${question.prompt}`;
  };

  const revealResult = () => {
    const scores = Object.fromEntries(Object.keys(emonariBranches).map((branch) => [branch, 0]));
    choices.forEach((branch, index) => { scores[branch] += 1 + ((attunementQuestions.length - index) / 100); });
    const resultKey = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
    const result = emonariBranches[resultKey];
    quizQuestion.hidden = true;
    quizResult.hidden = false;
    document.getElementById("quiz-result-name").textContent = result.name;
    document.getElementById("quiz-result-thesis").textContent = result.thesis;
    document.getElementById("quiz-result-description").textContent = result.description;
    quizWellstone.style.setProperty("--wellstone-color", result.color);
    quizResult.style.setProperty("--wellstone-color", result.color);
    quizWellstone.classList.add("attuned");
    quizWellstone.setAttribute("aria-label", `A wellstone glowing ${result.colorName} for the ${result.name} branch`);
    wellstoneStatus.textContent = `${result.name} · ${result.colorName}`;
    quizLive.textContent = `Attunement complete. Your Emonari branch is ${result.name}.`;
    document.getElementById("quiz-result-name").focus();
  };

  quizStart.addEventListener("click", () => {
    quizIntro.hidden = true;
    quizResult.hidden = true;
    quizQuestion.hidden = false;
    questionIndex = 0;
    choices = [];
    resetWellstone();
    renderQuestion();
    document.getElementById("quiz-prompt").setAttribute("tabindex", "-1");
    document.getElementById("quiz-prompt").focus();
  });

  document.getElementById("quiz-retake").addEventListener("click", () => quizStart.click());
}
