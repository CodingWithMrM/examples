// Runs the Suspense measurement in Remotion's headless Chrome (foreground, no tab throttling), 10 runs per mode.
//   node videos/shorts/14-suspense-300ms-style-r-test/3-work/code/run-measure.mjs   (needs the page served on :8779)
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dirname;
const chrome = join(here, "../../../../../node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const proc = spawn(chrome, ["--remote-debugging-port=9333", "--no-sandbox", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(1500);
const targets = await (await fetch("http://127.0.0.1:9333/json")).json();
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

const out = [];
for (const mode of ["suspense", "gate"]) {
  for (let k = 0; k < 10; k++) {
    await send("Page.navigate", { url: `http://localhost:8779/index.html?mode=${mode}&k=${k}` });
    await sleep(2200);
    const r = await send("Runtime.evaluate", { expression: "JSON.stringify(window.__result)", returnByValue: true });
    const res = JSON.parse(r.result.result.value);
    out.push(res);
    const w = res.rows.map((x) => x.waited);
    console.log(mode, k, "ready", res.rows.map((x) => x.ready).join(","), "shown", res.rows.map((x) => x.shown).join(","), "waited", w.join(","));
  }
}
writeFileSync(join(here, "measure-results.json"), JSON.stringify(out, null, 1));
ws.close();
proc.kill();
