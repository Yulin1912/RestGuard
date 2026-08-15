const WINDOW_MIN = 30;
const TICK_MS = 1000;

const STATES = {
  green: { label: "Quiet viewing", message: "QUIET VIEWING", ring: "#3d8b5a" },
  amber: { label: "Please give space", message: "PLEASE GIVE SPACE", ring: "#c9a15b" },
  rest: { label: "Rest period", message: "REST PERIOD", ring: "#a65d4a" },
};

const sim = {
  playing: true,
  minute: 0,
  events: [],
  soundOn: false,
  soundStarted: null,
  staffRest: false,
  state: "green",
  dwellSec: 4,
  noiseThreshold: 62,
};

const $ = (id) => document.getElementById(id);

function log(text) {
  const row = document.createElement("div");
  row.textContent = `${clockLabel(sim.minute)}  ${text}`;
  $("log").prepend(row);
}

function clockLabel(min) {
  const m = Math.floor(min);
  const s = Math.round((min - m) * 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function prune() {
  const cut = sim.minute - WINDOW_MIN;
  sim.events = sim.events.filter((e) => e.t > cut);
}

function counts() {
  prune();
  const P = sim.events.filter((e) => e.type === "approach").length;
  const O = sim.events.filter((e) => e.type === "door").length;
  let A = 0;
  for (const e of sim.events) {
    if (e.type === "sound") A += e.minutes;
  }
  if (sim.soundOn && sim.soundStarted !== null) {
    A += Math.max(0, sim.minute - sim.soundStarted);
  }
  const D = 2 * P + 3 * O + 0.25 * A;
  return { P, O, A, D };
}

function nextState(D, current) {
  if (sim.staffRest) return "rest";
  if (current === "green") {
    if (D >= 21) return "rest";
    if (D >= 11) return "amber";
    return "green";
  }
  if (current === "amber") {
    if (D >= 21) return "rest";
    if (D < 8) return "green";
    return "amber";
  }
  if (D < 18) return "amber";
  return "rest";
}

function render() {
  const { P, O, A, D } = counts();
  const next = nextState(D, sim.state);
  if (next !== sim.state) {
    sim.state = next;
    log(`Public state → ${STATES[next].label} (D=${D.toFixed(2)})`);
  }
  const look = STATES[sim.state];
  $("ring").style.setProperty("--ring", look.ring);
  $("epaper").textContent = look.message;
  $("score").textContent = D.toFixed(1);
  $("state-label").textContent = look.label;
  $("p").textContent = P;
  $("o").textContent = O;
  $("a").textContent = A.toFixed(1);
  $("formula-live").textContent = `D = 2(${P}) + 3(${O}) + 0.25(${A.toFixed(1)}) = ${D.toFixed(2)}`;
  $("sound-fill").style.width = `${Math.min(100, (A / WINDOW_MIN) * 100)}%`;
  $("clock").textContent = `${clockLabel(sim.minute)} / 30:00`;
  $("staff-state").textContent = look.label;
  $("staff-score").textContent = `Score ${Math.round(D)} / 30`;
  $("staff-orb").style.background = look.ring;
  $("staff-orb").style.boxShadow = `0 0 0 6px ${look.ring}29`;
  drawTicks();
}

function drawTicks() {
  const box = $("ticks");
  box.innerHTML = "";
  for (let i = 0; i < WINDOW_MIN; i += 1) {
    const start = sim.minute - WINDOW_MIN + i;
    const mark = document.createElement("i");
    const hit = sim.events.find((e) => e.t >= start && e.t < start + 1);
    if (hit) mark.className = hit.type === "approach" ? "p" : hit.type === "door" ? "o" : "a";
    if (sim.soundOn && sim.soundStarted !== null && start >= sim.soundStarted) mark.className = "a";
    mark.style.height = hit || mark.className ? "100%" : "18%";
    box.appendChild(mark);
  }
}

function moveVisitor(leftPct, on, label = "clear") {
  const el = $("visitor");
  el.style.left = `${leftPct}%`;
  el.classList.toggle("on", on);
  $("tof").textContent = label;
}

function qualifyApproach() {
  moveVisitor(38, true, "0.8 m · dwelling");
  log(`ToF: body entered 0.3–1.5 m. Waiting ${sim.dwellSec}s dwell…`);
  window.setTimeout(() => {
    sim.events.push({ t: sim.minute, type: "approach" });
    log("Qualified approach counted (entry + dwell).");
    render();
    window.setTimeout(() => moveVisitor(8, false, "clear"), 700);
  }, Math.min(1200, sim.dwellSec * 180));
}

function walkPast() {
  moveVisitor(18, true, "2.4 m · pass-by");
  log("ToF blip < dwell time — not counted.");
  window.setTimeout(() => moveVisitor(72, false, "clear"), 800);
}

function openDoor() {
  sim.events.push({ t: sim.minute, type: "door" });
  log("Reed switch: door open event.");
  render();
}

function soundOn() {
  if (sim.soundOn) return;
  sim.soundOn = true;
  sim.soundStarted = sim.minute;
  log(`Sound above relative threshold (${sim.noiseThreshold}). Accumulating A.`);
  render();
}

function soundOff() {
  if (!sim.soundOn) return;
  const minutes = Math.max(0.2, sim.minute - sim.soundStarted);
  sim.events.push({ t: sim.minute, type: "sound", minutes });
  sim.soundOn = false;
  sim.soundStarted = null;
  log(`Sound back below threshold. +${minutes.toFixed(1)} min to A.`);
  render();
}

function tick() {
  if (!sim.playing) return;
  sim.minute += 1;
  if (sim.minute > 240) {
    sim.minute = WINDOW_MIN;
    prune();
  }
  render();
}

document.querySelectorAll("[data-act]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const act = btn.dataset.act;
    if (act === "approach") qualifyApproach();
    if (act === "passby") walkPast();
    if (act === "door") openDoor();
    if (act === "sound-on") soundOn();
    if (act === "sound-off") soundOff();
  });
});

document.querySelectorAll("[data-staff]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const act = btn.dataset.staff;
    if (act === "rest") {
      sim.staffRest = true;
      log("Staff override: rest period started.");
    }
    if (act === "clear-rest") {
      sim.staffRest = false;
      log("Staff override cleared. Score logic resumes.");
    }
    if (act === "reset") {
      sim.events = [];
      sim.soundOn = false;
      sim.soundStarted = null;
      sim.staffRest = false;
      sim.state = "green";
      sim.minute = 0;
      log("Reset after relocation. Neutral guidance restored.");
    }
    render();
  });
});

$("device-button").addEventListener("click", () => {
  sim.staffRest = !sim.staffRest;
  log(sim.staffRest ? "Recessed button: rest override on." : "Recessed button: override off.");
  render();
});

$("play-btn").addEventListener("click", () => {
  sim.playing = !sim.playing;
  $("play-btn").textContent = sim.playing ? "Pause window" : "Run window";
});

$("dwell").addEventListener("input", (e) => {
  sim.dwellSec = Number(e.target.value);
  $("dwell-val").textContent = `${sim.dwellSec}s`;
});

$("noise").addEventListener("input", (e) => {
  sim.noiseThreshold = Number(e.target.value);
  $("noise-val").textContent = String(sim.noiseThreshold);
});

for (let i = 0; i < WINDOW_MIN; i += 1) {
  const mark = document.createElement("i");
  mark.style.height = "18%";
  $("ticks").appendChild(mark);
}

document.querySelectorAll(".nav-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".nav")?.classList.toggle("open");
  });
});

log("Device booted to neutral guidance. No raw audio or images stored.");
render();
window.setInterval(tick, TICK_MS);
