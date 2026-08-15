const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

const tabs = document.querySelectorAll("[data-sensor-tab]");
const panels = document.querySelectorAll("[data-sensor-panel]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.sensorTab;
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
    });
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
