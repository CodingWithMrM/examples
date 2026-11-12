// Submits both forms in Remotion's headless Chrome with JavaScript OFF and ON (5 runs each), against `next start -p 8793`.
//   (cd demo && npx next build --webpack && npx next start -p 8793) ; node run-demo.mjs   -> writes demo-results.json
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
const here = import.meta.dirname;
const chrome = join(here, "../../../../../node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const proc = spawn(chrome, ["--remote-debugging-port=9371", "--no-sandbox", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(1500);
const targets = await (await fetch("http://127.0.0.1:9371/json")).json();
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable"); await send("DOM.enable");
const out = [];
for (const js of [false, true]) for (const route of ["broken", "fixed"]) for (let k = 0; k < 5; k++) {
  await send("Emulation.setScriptExecutionDisabled", { value: !js });
  await send("Page.navigate", { url: `http://localhost:8793/${route}?k=${k}` });
  await sleep(1500);
  const doc = (await send("DOM.getDocument", { depth: 1 })).result.root.nodeId;
  const btn = (await send("DOM.querySelector", { nodeId: doc, selector: "button" })).result.nodeId;
  const box = (await send("DOM.getBoxModel", { nodeId: btn })).result.model.content;
  const x = (box[0] + box[2]) / 2, y = (box[1] + box[5]) / 2;
  for (const type of ["mousePressed", "mouseReleased"]) await send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
  await sleep(1200);
  const root = (await send("DOM.getDocument", { depth: 1 })).result.root.nodeId;
  const p = (await send("DOM.querySelector", { nodeId: root, selector: "#out" })).result.nodeId;
  const html = (await send("DOM.getOuterHTML", { nodeId: p })).result.outerHTML;
  const url = (await send("Runtime.evaluate", { expression: "location.href", returnByValue: true }).catch(() => null))?.result?.result?.value;
  const text = html.replace(/<[^>]*>/g, "");
  out.push({ js: js ? "on" : "off", route, run: k, result: text });
  console.log(js ? "JS on " : "JS off", route.padEnd(7), "→", text);
}
writeFileSync(join(here, "demo-results.json"), JSON.stringify(out, null, 1));
proc.kill(); ws.close(); process.exit(0);
