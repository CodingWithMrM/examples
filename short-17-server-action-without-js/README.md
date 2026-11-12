# Code for the "server action wrapped = dead before JS" Short

- `demo/`: Next.js app with `/broken` (form action = our `enhanced` wrapper) and `/fixed` (`hydrated ? enhanced : action`), one server action in `app/actions.ts`. `node_modules` is a symlink to `~/Projects/andini-counter-stock/node_modules` (Next 16.1.1, React 19.2.3), so nothing was downloaded.
- Build and serve: `cd demo && npx next build --webpack && npx next start -p 8793`.
- Run: `node run-demo.mjs` (headless Chrome on port 9371; JavaScript off, then on; 5 runs each) writes `demo-results.json`.
- Result: JS off, broken 0/5, fixed 5/5; JS on, both 5/5. `server-html.txt` holds the two `<form>` tags the server sends.
- `screen/FormFix.jsx`: exactly the code shown on screen, plus stand-ins for the server action and `useHydrated`, so `scripts/check-samples.mjs` compiles and renders it.
