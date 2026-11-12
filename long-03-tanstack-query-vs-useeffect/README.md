# Code for #03 TanStack Query (rebuild)

All on-screen code is in `screen/` (real files, compiled and rendered once by `node scripts/check-samples.mjs videos/03-tanstack-query`, and every line shown in the video is checked by `node videos/03-tanstack-query/3-work/code/check-screen-lines.mjs` against `src/v03/code.ts`).

- Versions: React 19.3.1, react-dom 19.3.1, @tanstack/react-query 5.106.1 (the shared `node_modules`). Browser: Remotion's headless Chrome (`chrome-headless-shell`, macOS arm64), foreground tab, background-throttling flags off.
- `src/api.js`: fake API. Every call waits (search 100–900 ms decided by trial and term, projects 400 ms, todos 300 ms, toggle 400 ms, user 300 ms) and is logged. `src/tabapi.js`: the cross-tab fake server in `localStorage` (shared by all tabs of the origin).
- `src/main.jsx`: the measurement page, `?demo=race|dedupe|cache|optimistic|tab`.
- Build: `NODE_PATH=node_modules node_modules/.bin/esbuild videos/03-tanstack-query/3-work/code/src/main.jsx --bundle --jsx=automatic --define:process.env.NODE_ENV='"production"' --minify --outfile=videos/03-tanstack-query/3-work/code/bundle.js`
- Serve: `python3 -m http.server 8781 --directory videos/03-tanstack-query/3-work/code`, run: `node videos/03-tanstack-query/3-work/code/run-measure.mjs` (writes `measure-results.json`; uses its own Chrome on debug port 9391).

## What was measured (median or count, see measure-results.json)
| Demo | Result |
|---|---|
| Race: 5 keystrokes 80 ms apart, 20 trials, random 100–900 ms latency (same latencies for every mode) | wrong final result: plain `useEffect` 13/20, `useEffect` with an ignore flag 0/20, `useQuery` 0/20 |
| Trial 3 of the race | "reac" (start 242 ms, 709 ms) lands at 951 ms, after "react" (start 322 ms, 536 ms) lands at 858 ms; the screen ends on "reac" |
| Dedupe: 3 components, same user | requests sent: `useEffect` 3, `useQuery` 1 |
| Cache: leave a page for 300 ms and come back (400 ms fake server) | time to data: `useEffect` 402.5 ms, `useQuery` 0.4 ms; network calls: 2 with staleTime 0, 1 with staleTime 30 s |
| Mutation: time from click until the checkbox shows | plain mutate + invalidate 708 ms; optimistic 2 ms; optimistic with a failing server: ticked at 0.9 ms, rolled back at 407.7 ms |
| Cross-tab: 5 runs per mode, staleTime 60 s, refetchOnWindowFocus off in the test | no sync: tab B still old after 2.5 s; key only (the "fact"): B updated 404–406 ms after A's mutation succeeded (that is B's own 400 ms fetch), message 45 bytes; full data: message 3,880 bytes and A had to fetch the list first (3 fetches in A); two channel objects in one tab: A received its own message and fetched 3 times instead of 2 |

Honest limits: a fake API with fixed delays on one Mac (loaded by other renders), not a real network; the numbers show the mechanism, not your app's speed. The cross-tab test turns off focus refetching so the gap is visible; with the default it would also be fixed when you click back on tab B, but only if the data is stale.
Docs checked in `node_modules/@tanstack/query-core/build/modern`: default `gcTime` 5 min (3e5) on the client, `invalidateQueries` cancels a running fetch by default (`cancelRefetch: true`), the query function context has an abort `signal`.
