const demoImages = {
  assembled: {
    src: "assets/images/restguard-device-front.jpg",
    alt: "RestGuard assembled cream enclosure",
  },
  exploded: {
    src: "assets/images/restguard-exploded.jpg",
    alt: "Exploded RestGuard layers on a warm cream studio background",
  },
  board: {
    src: "assets/images/restguard-tracer-pcb.jpg",
    alt: "Bare RestGuard prototype PCB",
  },
};

const sensorVisuals = {
  mems: "assets/images/restguard-mems-chip.jpg",
  tof: "assets/images/restguard-tof-sensor.jpg",
  mic: "assets/images/restguard-tracer-pcb.jpg",
  door: "assets/images/restguard-exploded.jpg",
};

function setDemoView(view) {
  const img = document.getElementById("demo-image");
  const next = demoImages[view];
  if (!img || !next) return;
  img.src = next.src;
  img.alt = next.alt;
  document.querySelectorAll("[data-view]").forEach((el) => {
    el.classList.toggle("on", el.dataset.view === view);
  });
}

function setSensor(name) {
  const visual = document.getElementById("sensor-visual");
  if (visual && sensorVisuals[name]) visual.src = sensorVisuals[name];
  document.querySelectorAll(".sensor-tabs button").forEach((btn) => {
    btn.classList.toggle("on", btn.dataset.sensor === name);
  });
  document.querySelectorAll(".sensor-panel").forEach((panel) => {
    panel.classList.toggle("on", panel.dataset.sensor === name);
  });
}

document.querySelectorAll("[data-view]").forEach((el) => {
  el.addEventListener("click", () => setDemoView(el.dataset.view));
});

document.querySelectorAll(".sensor-tabs button").forEach((btn) => {
  btn.addEventListener("click", () => setSensor(btn.dataset.sensor));
});

document.querySelectorAll(".nav-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".nav")?.classList.toggle("open");
  });
});
