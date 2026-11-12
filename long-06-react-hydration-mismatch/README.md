# Code for "Hydration mismatch" (long video + 2 Shorts)

Everything shown on screen is real and was run. Versions: React and react-dom 19.3.1, esbuild (shared node_modules), macOS arm64, Remotion's headless Chrome (chrome-headless-shell, foreground, so no tab throttling).

- `screen/*.jsx`: the exact code shown on screen (each one compiles and renders under `scripts/check-samples.mjs`).
- `src/pages.jsx`, `src/client.jsx`, `server.mjs`: the demo. `server.mjs` renders each page with `renderToString` (real SSR), serves it with the client bundle and lets us delay the JS file (`?delay=300` = a slower connection). Development builds (`?dev=1`) for the warnings, production builds for timings.
- `run-measure.mjs`: drives Chrome over CDP. Needs `node server.mjs` running on :8791. Writes `measure-results.json` (10 runs per flicker case; the saved sidebar state is "open").
- Run it: `node server.mjs &` then `node run-measure.mjs`.

## What we measured (median of 10 runs, headless Chrome, production build)
| Sidebar version | JS delay | First frame with the sidebar | Wrong (closed) until | Frames shown wrong |
|---|---|---|---|---|
| useEffect (server renders closed) | 300 ms | ~12 ms | +310 ms after first paint | 18 |
| useEffect | 0 ms | ~15 ms | +12 ms | 0-1 |
| Null gate (render nothing) | 300 ms | **327 ms** (blank page before that) | n/a | 0 (but nothing at all for 327 ms) |
| Inline script + CSS | 300 ms | ~12 ms, already open | 0 | 0 |

## Mismatch facts we saw (development build, React 19.3.1)
- Clock in render (`new Date().toLocaleTimeString()`): React threw "Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client." (reported through `onRecoverableError`).
- `suppressHydrationWarning` on the `<h1>`: no error, but the text on screen stayed the server's time (2 s old) while the browser's own clock was 1 s ahead of that. React kept the server text.
- `suppressHydrationWarning` on a parent `<div>` with a mismatching `<p>` inside: the error came back (one level deep only).
- Sidebar state read from localStorage in the first render: console error "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up." The sidebar stayed closed (class "layout", left -260 px) although the saved state was open.
- `use(browser())` in a `<Suspense>`: server HTML contained the fallback "Loading…"; after hydration the real time appeared; no error. `browser` is exported by react-dom 19.3.1.

## Two full runs
The whole measurement was run twice (the second time to include the Shorts' script variant). Run 1: effect wrong 310 ms (no delay 12 ms), gate blank 327 ms, script 0. Run 2 (`measure-results.json`, `measure-run.log`): effect wrong 313 ms (no delay 10 ms), gate blank 327 ms, script and Shorts script variant 0 ms. The videos say "about 310 ms". `run-pair.mjs` captured the clock numbers (12:21:04 server / 12:21:06 browser; 12:21:08 kept / 12:21:10 browser clock). `screen/ShortInline.jsx` is the Shorts' narrower formatting of the same logic as `screen/InlineScript.jsx` (variant=short in the server).
