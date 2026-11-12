# Short 02 code (checked 2026-11-06)
- `src/crash-null.jsx`: the compiled-JS `greet(null)`; the engine message is "Cannot read properties of null (reading 'name')" (shown on screen).
- `src/zod-schema.jsx`: real Zod `safeParse` on null → rejected.
- `src/api-bug.jsx`, `src/type-erasure.jsx`, `src/zod-fix.jsx`: the first-pass samples.
Run: `node scripts/check-samples.mjs videos/shorts/02-ts-vs-js` (compile + render once).
