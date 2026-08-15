# RestGuard

A non-contact disturbance monitor for animal-care enclosures — portfolio website and precise interactive prototype.

RestGuard sits **outside** the kennel. It watches three environmental events (visitor approach, sound level, door opening), turns them into a rolling 30-minute score, and shows one humane public state. It does not diagnose stress, store audio, or put a wearable on the animal.

## Open the site

This is a static site. From the repo root:

```bash
python3 -m http.server 4173
```

Then visit:

- [http://localhost:4173/](http://localhost:4173/) — story, exploded demo, multi-sensor science
- [http://localhost:4173/prototype.html](http://localhost:4173/prototype.html) — live enclosure lab
- [http://localhost:4173/chip.html](http://localhost:4173/chip.html) — hardware hero of the prototype board

## What is in the prototype

The lab implements the portfolio formula and hysteresis, not a welfare standard:

`D = 2P + 3O + 0.25A`

| Symbol | Meaning |
| --- | --- |
| P | Qualified approaches (enter 0.3–1.5 m **and** dwell) |
| O | Door-open events |
| A | Minutes above a staff-set sound threshold |

- Green `0–10` · Amber from `11` · Rest `>20` or staff override
- Return to green only after D falls below `8`
- Walk-bys do not count
- One simulated second equals one minute in the rolling window
- Staff can start a rest period, clear override, or reset after relocation

## Design references

The site is a warm, pet-care translation of two technology explainers:

- Garmin multi-sensor wearable science (chip photography, sensor tabs, fused applications)
- Dyson Demo (assembled / exploded / hands-on product lab)

Palette matches the August 2026 portfolio: cream `#F0F0E8`, sage, terracotta.

## Credit

Concept and engineering report: **Yulin Zhang**, August 2026.

RestGuard is a designed system — not yet a validated animal-welfare product.
