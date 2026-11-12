# Coding with Mr. M · examples

The real code behind the videos on **Coding with Mr. M** (YouTube, Instagram and TikTok: @codingwithmrm). Every number shown in a video was measured with the code in its folder.

| Folder | Video |
|---|---|
| `long-01-react-rerenders` | Why your React app re-renders |
| `long-03-tanstack-query-vs-useeffect` | useEffect showed the wrong results 13 times in 20. TanStack Query: 0 |
| `long-06-react-hydration-mismatch` | suppressHydrationWarning doesn't fix your bug (here's what does) |
| `short-01-stop-useeffect-derived-state` | Stop using useEffect to copy props into state |
| `short-02-typescript-runtime-zod` | TypeScript types vanish at runtime: use Zod |
| `short-12-html-streaming` | Streaming AI text without innerHTML |
| `short-14-suspense-300ms` | Your React code loaded. Why is it still hidden? (Suspense 300 ms) |
| `short-15-hydration-sidebar-flicker` | Fix the React hydration flicker: wrong for 310 ms, then 0 |
| `short-16-suppress-hydration-warning` | React hydration error: this prop is a trap |
| `short-17-server-action-without-js` | Your Next.js form breaks before JavaScript loads |

Each folder has its own README with versions and how the measurement was run. `screen/` holds the exact code shown on screen. Build outputs (`dist/`, `out/`, `bundle.js`) and `node_modules/` are not committed: install React 19 and esbuild (`npm i react react-dom esbuild`) and build with the command in the folder's README. Some READMEs give paths from the channel's production repo (`videos/...`); run the same command from inside the folder instead.

Code is MIT licensed. Benchmarks by others are credited in each video and README.
