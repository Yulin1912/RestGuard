# RestGuard

A non-contact disturbance monitor for animal-care enclosures — portfolio website and interactive prototype.

RestGuard observes visitor approach, elevated sound and door openings from **outside** the enclosure, then shows one public state (quiet viewing / give space / rest) plus a local staff summary. It does not diagnose stress, store raw audio, or use a camera.

## Open the prototype

Serve the folder and start at `index.html`:

```bash
python3 -m http.server 4173
```

Then visit:

- [Story](index.html) — product narrative in the cream / sage / gold portfolio palette
- [Demo](demo.html) — live disturbance score, public ring and staff app
- [Sensing board](chip.html) — RG-SENSE ESP32-S3 board photograph

## What is in this repo

| Path | Purpose |
| --- | --- |
| `index.html` | Garmin-style multi-sensor story + Dyson-style exploded / demo invitation |
| `demo.html` | Interactive Level A prototype (`D = 2P + 3O + 0.25A`) |
| `chip.html` | Dedicated board page |
| `assets/images/` | Concept renders, lifestyle stills and the RG-SENSE board photo |
| `css/styles.css` | Shared design system |

## Design notes

- Palette matches the August 2026 portfolio: warm cream ground, forest and sage, mustard gold.
- Public colour is always paired with e-paper text.
- The score is a prototype formula on a rolling 30-minute window, not a welfare standard.

Prepared by Yulin Zhang · Concept design · August 2026
