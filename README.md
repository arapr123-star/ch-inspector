# CH Inspector — internal field-capture app

A single-file Progressive Web App (PWA) for Cleanaholics inspectors. Walk into a
house with the iPad, capture each room and instrument by camera, and the app
**reads the instrument displays automatically** (Claude vision) and **builds the
report on the spot**. Works on iPad, iPhone and Android — installs to the home
screen, runs offline for capture.

## What it does

1. **New inspection** → client, address, property type, room/toilet count, inspector.
2. **Capture** (one screen):
   - **Rooms & areas** — add Living Room, Master Bedroom, Kitchen, toilets… each with photos + notes.
   - **Air quality** — snap the INKBIRD monitor → AQI, PM2.5/PM10, CO₂, TVOC, HCHO, temp, humidity extracted into editable fields.
   - **Thermal** — snap HIKMICRO frames → Cen / Max / Min °C read off each.
   - **Moisture** — snap the Protimeter Surveymaster → value + Dry / At Risk / Wet.
   - **UV blue-light** — photo + tag (mould / sewage / biological) + location.
   Every extracted value is tappable to correct on the spot.
3. **Review & generate report** → a clean, branded inspection record (gold-coin Cleanaholics identity) with all readings, tables and photos. **Print** or **export PDF** immediately.

Inspections + photos are stored on-device in IndexedDB. The only thing that needs
a connection is the AI reading of instrument photos (and the first PDF export,
which pulls html2pdf from CDN).

## One-time setup (per iPad)

1. Host the `CH-Inspector/` folder over **HTTPS** (or `localhost`) — a PWA needs a
   secure origin to install and to use the camera. Options:
   - **Quick local test:** `cd CH-Inspector && python3 -m http.server 8765` then open `http://localhost:8765` on the same machine.
   - **For the iPad on-site:** put the folder behind any HTTPS host (Netlify drop, Cloudflare Pages, an internal server, or a tunnel like Cloudflare Tunnel / ngrok). Open the HTTPS URL in **Safari** on the iPad.
2. In Safari: **Share → Add to Home Screen.** It now opens full-screen like an app.
3. Open the app → **Settings ⚙︎** → paste the **Anthropic API key** (`sk-ant-…`).
   The key is stored only on that device (localStorage) and is used to read
   instrument photos and draft reports. Model defaults to **Opus 4.8** (most
   accurate); Sonnet 4.6 is offered for faster/cheaper runs.

> The API key lives on the device and is sent directly to `api.anthropic.com`
> from the browser (using the `anthropic-dangerous-direct-browser-access` header).
> Fine for an internal, single-org tool. If this ever goes to third parties,
> move the key behind a small proxy/backend instead of shipping it to the client.

## Cost

Each instrument photo read is one short vision call (~a few cents at Opus 4.8;
less on Sonnet 4.6). A full inspection is well under RM 1 of API usage.

## Files

- `index.html` — the entire app (UI + capture + camera + Claude vision + report).
- `sw.js` — service worker; caches the app shell so it opens offline.
- `manifest.webmanifest` — makes it installable, sets the gold-coin icon.
- `assets/` — gold-coin brand icons.

## Roadmap (not built yet)

- Cloud sync / multi-inspector accounts + central history (currently device-local).
- Offline queue: auto-extract instrument photos when signal returns.
- Wire the on-spot report into the full premium proposal template.
