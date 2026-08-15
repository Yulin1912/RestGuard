function score(P, O, A) {
  return 2 * P + 3 * O + 0.25 * A;
}

function nextState(D, current, staffRest) {
  if (staffRest) return "rest";
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

const cases = [
  ["empty", score(0, 0, 0), 0],
  ["three approaches", score(3, 0, 0), 6],
  ["one door", score(0, 1, 0), 3],
  ["four sound minutes", score(0, 0, 4), 1],
  ["ppt example 3 approaches", score(3, 0, 4), 7],
];

let failed = 0;
for (const [name, got, want] of cases) {
  if (Math.abs(got - want) > 1e-9) {
    console.error(`FAIL ${name}: ${got} !== ${want}`);
    failed += 1;
  }
}

if (nextState(7, "green", false) !== "green") failed += 1;
if (nextState(11, "green", false) !== "amber") failed += 1;
if (nextState(8.5, "amber", false) !== "amber") failed += 1;
if (nextState(7.9, "amber", false) !== "green") failed += 1;
if (nextState(22, "amber", false) !== "rest") failed += 1;
if (nextState(0, "green", true) !== "rest") failed += 1;

if (failed) {
  console.error(`${failed} checks failed`);
  process.exit(1);
}
console.log("score and hysteresis checks passed");
