const tabs = document.querySelectorAll("[data-sensor-tab]");
const panels = document.querySelectorAll("[data-sensor-panel]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.sensorTab;
    tabs.forEach((t) => t.classList.toggle("active", t === tab));
    panels.forEach((p) => p.classList.toggle("active", p.dataset.sensorPanel === id));
  });
});

document.querySelectorAll("[data-hotspot]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-hotspot]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const target = document.querySelector("[data-explode-note]");
    if (target) target.textContent = btn.dataset.note;
  });
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
