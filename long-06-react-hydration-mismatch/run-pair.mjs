// Captures the server text vs the browser's own clock for the clock demos (feeds the numbers on screen).  node run-pair.mjs → pair-results.json
import { spawn } from "node:child_process"; import { writeFileSync } from "node:fs"; import { join } from "node:path";
const here = import.meta.dirname;
const chrome = join(here, "../../../../node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const proc = spawn(chrome, ["--remote-debugging-port=9336", "--no-sandbox", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); await sleep(1500);
const t = await (await fetch("http://127.0.0.1:9336/json")).json();
const ws = new WebSocket(t.find((x) => x.type === "page").webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const p = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id) p.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send("Runtime.evaluate", { expression: e, returnByValue: true })).result.result.value;
await send("Runtime.enable"); await send("Page.enable");
const out = {};
for (const page of ["Clock", "ClockSuppress"]) {
  await send("Page.navigate", { url: `http://localhost:8791/${page}?dev=1&delay=1500` }); await sleep(3500);
  out[page] = JSON.parse(await ev(`JSON.stringify({server: window.__srvText, afterHydration: document.getElementById("t").textContent, browserClock: (document.getElementById("client")||{}).textContent || new Date().toLocaleTimeString([], {hour12:false}), recoverable: window.__recoverable||[]})`));
}
console.log(JSON.stringify(out, null, 1)); writeFileSync(join(here, "pair-results.json"), JSON.stringify(out, null, 1));
ws.close(); proc.kill();
