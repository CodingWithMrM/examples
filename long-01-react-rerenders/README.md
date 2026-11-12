# Code for video #1: tested samples and measurements

Every sample shown on screen is a file in `src/`. Measured 2026-10-30.

**Setup:** React **19.3.1** + react-dom 19.3.1 (production build with the profiling renderer, `react-dom/profiling`), bundled with esbuild from the shared `node_modules`. Chrome 152 (Claude app browser pane) on an **Apple M4 Pro** MacBook (Mac16,8). No CPU throttling.

**Build and run:**
```bash
cd videos/01-react-rerenders/3-work/code
NODE_PATH=~/Workspace/remotion/node_modules ~/Workspace/remotion/node_modules/.bin/esbuild src/main.jsx --bundle --minify --jsx=automatic --define:process.env.NODE_ENV='"production"' --alias:react-dom/client=react-dom/profiling --outfile=dist/main.js
python3 -m http.server 4173 --directory ../../..   # then open /01-react-rerenders/3-work/code/index.html?demo=1-bug
```
`src/main.jsx` mounts the demo inside `<Profiler>`, resets the counters after mount, then types "wireless" one key at a time (8 keystrokes) or scrolls the panel 8 times, and prints the render counts, React's render time per update (`actualDuration`) and the number of DOM changes inside the table (MutationObserver).

**Method:** 5 runs per demo; times are the median of each run's median keystroke, plus the worst single keystroke over all runs. The rows are normal rows (a formatted price and a 30-point SVG sparkline), with no artificial slowdown.

## Results (8 keystrokes / 8 scroll steps), run 2 (2026-10-30, realistic product names)

| Demo | Renders during the 8 events | React time per keystroke (median of 5 runs) | Worst keystroke | Time before the typed key shows |
|---|---|---|---|---|
| `1-bug` state in App | App 8, ProductTable 8, **Row 3,200** | **8.7 ms** | 16.1 ms | 8.7 ms |
| `1-bug` DOM changes in the table | **0** (3,200 row renders changed nothing on screen) | | | |
| `2-memo-fails` memo + inline function/object props | App 8, ProductTable 8, **Row 3,200** (memo did nothing) | 8.4 ms | 13.3 ms | 8.4 ms |
| `3-memo-works` memo + useCallback + hoisted object | App 8, table 0, rows 0 | 0.1 ms | 0.3 ms | 0.1 ms |
| `4-move-state-down` state inside SearchBox | SearchBox 8, everything else 0 | 0.1 ms | 0.2 ms | 0.1 ms |
| `5b-children-bug` scroll panel with the table inside | ScrollPanel 11–13, ProductTable 8, Row 3,200 | 7.9 ms | 15.0 ms | 8.3 ms |
| `5-children` table passed as `children` | ScrollPanel 12–14, table 0, rows 0 | ~0 ms | 0.2 ms | 0.1 ms |
| `6-context-bug` one context object, memo'd Sidebar | **ThemedLink 400** (50 links × 8, despite memo) | 0.2 ms | 0.7 ms | 0.2 ms |
| `7-context-split` theme and search in separate contexts | ThemedLink 0 | 0.1 ms | 0.2 ms | 0.1 ms |
| `8-filter-bug` table filters by the text, same update as the input | Row 1,250, table DOM changes 250 | 5.1 ms | 9.2 ms | **5.1 ms** |
| `9-deferred` `useDeferredValue` + memo table | App 16 (8 urgent + 8 deferred), Row 1,250 | 3.4 ms (both commits) | 8.5 ms | **~0 ms** (input commit first, table after) |

Run 1 (generic names "Product N", same counts) gave 8.2 ms for `1-bug`; the script uses run 2.
(The scroll panel renders more than 8 times because setting `scrollTop` also fires the browser's own scroll events; that is the panel itself, not the table.)
`9-deferred`: every keystroke gives 2 commits: first the input alone (≈0 ms of React work), then the table with the deferred text. React can interrupt that second render if another key arrives (react.dev, `useDeferredValue`).

**Frame budget:** at 60 fps a frame has 16.7 ms for everything (React, style, layout, paint). The bug spends a median 8.7 ms (worst 16.1 ms) in React alone **on an M4 Pro**. Slower phones will be worse, but we did not measure a phone, so the script does not give a phone number.

## React Compiler 1.0 (run 3, 2026-10-30, same browser session for both columns)
**Setup:** `babel-plugin-react-compiler` **1.0.0** with `@babel/core` 7.29.7 and `@babel/plugin-syntax-jsx` (installed in this folder with the user's OK; React still comes from the shared `node_modules`). `node compile.mjs` runs every demo through the compiler (`target: "19"`) into `src-compiled/` and logs which components it optimised: **all of them** (App, ProductTable, Row, SearchBox, ScrollPanel, Sidebar, ThemedLink). The render counters stay outside the compiler's cache (checked in the output), so they still count every call. Then `src-compiled/main.jsx` is bundled to `dist/main-compiled.js` and served as `index-compiled.html?demo=<name>`. 5 runs per demo per column.

| Demo | Plain React 19.3: renders · time per key (median) | With React Compiler: renders · time per key | Why |
|---|---|---|---|
| `1-bug` state in App | Row **3,200** · 8.1 ms | **App 8 only, Row 0** · 0.1 ms | The compiler caches the `<ProductTable />` element inside App, so React gets the same element back and skips the table |
| `2-memo-fails` inline function + object | Row **3,200** · 8.4 ms | **Row 0** · 0.1 ms | The inline callback and the style object are cached, so `memo` finally sees equal props |
| `5b-children-bug` scroll panel | Row 3,200 · 7.5 ms | **Row 0** · ~0 ms | Same as `1-bug` |
| `6-context-bug` one context object | ThemedLink **400** · 0.2 ms | ThemedLink **400** · 0.2 ms | **Not fixed:** the value really changes on every key (it holds `query`), so every reader must re-render |
| `8-filter-bug` table filters by the text | Row 1,250 · 3.7 ms | Row 1,250 · **0.5 ms** | The rows really change, so they still render, but each render is cheaper (the price formatter and the sparkline points are cached per product) |
| `9-deferred` | Row 1,250 · 2.4 ms (input ≈0 ms) | Row 1,250 · 0.3 ms (input 0.1 ms) | As above |
| `3`, `4`, `5`, `7` (already fixed by hand) | 0 table renders | 0 table renders | Nothing left to fix |

Run 3's plain numbers differ slightly from run 2's (8.1 vs 8.7 ms for `1-bug`; normal run-to-run noise on a laptop); the counts are identical. **The script keeps run 2's numbers for the main story and uses counts, not milliseconds, for the compiler comparison.**

