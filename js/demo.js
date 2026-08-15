const formula = {
  p: 3,
  o: 0,
  a: 4,
  restOverride: false,
};

const els = {
  p: document.querySelector("#p"),
  o: document.querySelector("#o"),
  a: document.querySelector("#a"),
  pVal: document.querySelector("[data-p]"),
  oVal: document.querySelector("[data-o]"),
  aVal: document.querySelector("[data-a]"),
  score: document.querySelector("[data-score]"),
  state: document.querySelector("[data-state]"),
  epaper: document.querySelector("[data-epaper]"),
  ring: document.querySelector("[data-ring]"),
  appState: document.querySelector("[data-app-state]"),
  appScore: document.querySelector("[data-app-score]"),
  appP: document.querySelector("[data-app-p]"),
  appO: document.querySelector("[data-app-o]"),
  appA: document.querySelector("[data-app-a]"),
  soundFill: document.querySelector("[data-sound-fill]"),
  log: document.querySelector("[data-log]"),
};

function score() {
  return 2 * formula.p + 3 * formula.o + 0.25 * formula.a;
}

function publicState(d) {
  if (formula.restOverride || d > 20) {
    return { name: "Rest period", message: "REST PERIOD", color: "#a65d4a", glow: "rgba(166,93,74,.4)", hint: "Avoid interaction" };
  }
  if (d >= 11) {
    return { name: "Please give space", message: "GIVE SPACE", color: "#d4a24a", glow: "rgba(212,162,74,.4)", hint: "Disturbance is accumulating" };
  }
  return { name: "Quiet viewing", message: "QUIET VIEWING", color: "#3ddc6a", glow: "rgba(61,220,106,.45)", hint: "Observe calmly" };
}

function render() {
  const d = Number(score().toFixed(2));
  const st = publicState(d);
  els.pVal.textContent = formula.p;
  els.oVal.textContent = formula.o;
  els.aVal.textContent = formula.a;
  els.score.textContent = d;
  els.state.textContent = st.name;
  els.epaper.textContent = st.message;
  els.ring.style.borderColor = st.color;
  els.ring.style.boxShadow = `0 0 18px ${st.glow}`;
  els.appState.textContent = st.name;
  els.appScore.textContent = `${Math.round(d)} / 30`;
  els.appP.textContent = formula.p;
  els.appO.textContent = formula.o;
  els.appA.textContent = `${formula.a} minutes above configured level`;
  els.soundFill.style.width = `${Math.min(100, (formula.a / 20) * 100)}%`;
  const swatch = document.querySelector("[data-app-swatch]");
  if (swatch) swatch.style.background = st.color;
}

function log(text) {
  if (!els.log) return;
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  item.textContent = `${time} · ${text}`;
  els.log.prepend(item);
  while (els.log.children.length > 6) els.log.lastChild.remove();
}

["p", "o", "a"].forEach((key) => {
  els[key].addEventListener("input", (e) => {
    formula[key] = Number(e.target.value);
    render();
  });
});

document.querySelector("[data-approach]")?.addEventListener("click", () => {
  formula.p = Math.min(20, formula.p + 1);
  els.p.value = formula.p;
  log("Qualified approach counted (entry + dwell).");
  render();
});

document.querySelector("[data-door]")?.addEventListener("click", () => {
  formula.o = Math.min(12, formula.o + 1);
  els.o.value = formula.o;
  log("Door-open event captured by reed switch.");
  render();
});

document.querySelector("[data-sound]")?.addEventListener("click", () => {
  formula.a = Math.min(30, formula.a + 1);
  els.a.value = formula.a;
  log("Sound level stayed above threshold for 1 minute.");
  render();
});

document.querySelector("[data-reset]")?.addEventListener("click", () => {
  formula.p = 0;
  formula.o = 0;
  formula.a = 0;
  formula.restOverride = false;
  els.p.value = 0;
  els.o.value = 0;
  els.a.value = 0;
  log("Staff reset after relocation. Score window cleared.");
  render();
});

document.querySelector("[data-rest]")?.addEventListener("click", () => {
  formula.restOverride = !formula.restOverride;
  log(formula.restOverride ? "Manual rest period started." : "Manual rest period ended.");
  render();
});

render();
