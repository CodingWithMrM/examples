# Code for the Suspense 300 ms test Short

- `src/Measure.jsx` and `src/main.jsx`: the measured demo. Six `React.lazy` widgets whose loaders resolve after 40–240 ms. `?mode=suspense` puts each one in its own `<Suspense>`; `?mode=gate` uses the placeholder + effect + swap pattern. Each widget logs when its code was ready and when it was painted (`useLayoutEffect`).
- Build: `NODE_PATH=node_modules node_modules/.bin/esbuild <this folder>/src/main.jsx --bundle --jsx=automatic --define:process.env.NODE_ENV='"production"' --minify --outfile=<this folder>/bundle.js`
- Serve: `.claude/launch.json` → "suspense-measure" (python http.server on port 8779).
- Run: `node <this folder>/run-measure.mjs` (Remotion's headless Chrome in the foreground, 10 runs per mode) writes `measure-results.json`. The in-app browser pane gave noisy timings because a background tab throttles its timers, so only the headless runs are used.
- `screen/LazyWidget.jsx`: exactly the code shown on screen (plus a tiny harness so `scripts/check-samples.mjs` can compile and render it).
