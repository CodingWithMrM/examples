// Runs every demo in Remotion's headless Chrome (foreground). Needs `node server.mjs` running on :8791.
//   node run-measure.mjs   → measure-results.json
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
const here = import.meta.dirname;
const chrome = join(here, "../../../../node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const proc = spawn(chrome, ["--remote-debugging-port=9334", "--no-sandbox", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(1500);
const targets = await (await fetch("http://127.0.0.1:9334/json")).json();
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); let consoleMsgs = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id) pending.get(d.id)?.(d); else if (d.method === "Runtime.consoleAPICalled") consoleMsgs.push(d.params.type + ": " + d.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 400)); else if (d.method === "Runtime.exceptionThrown") consoleMsgs.push("exception: " + (d.params.exceptionDetails.exception?.description ?? "").slice(0, 300)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => { const r = await Promise.race([send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true }), sleep(6000).then(() => null)]); return r?.result?.result?.value ?? null; };
await send("Runtime.enable"); await send("Page.enable");
const go = async (url, wait = 2800) => { consoleMsgs = []; await send("Page.navigate", { url }); await sleep(wait); };
const B = "http://localhost:8791";
const out = {};
// 1. the error, development build (React 19.3.1)
await go(`${B}/set?v=closed`, 300);
for (const [k, p] of [["Clock", "Clock?dev=1&delay=1500"], ["ClockSuppress", "ClockSuppress?dev=1&delay=1500"], ["NestedSuppress", "NestedSuppress?dev=1&delay=1500"], ["ClockGate", "ClockGate?dev=1&delay=1500"]]) {
  await go(`${B}/${p}`, 3500);
  out[k] = { console: consoleMsgs.filter((m) => !/Download the React DevTools/.test(m)), serverHtml: await (await fetch(`${B}/${p}`)).text().then((t) => t.match(/<div id="root">(.*?)<\/div><script src/)?.[1]), text: await ev(`document.getElementById("t")?.textContent ?? null`), clientTime: await ev(`document.getElementById("client")?.textContent ?? null`), recoverable: await ev("JSON.stringify(window.__recoverable||[])") };
}
await go(`${B}/set?v=open`, 300);
await go(`${B}/SidebarInit?dev=1&delay=300`, 2500);
out.SidebarInit = { layoutClass: await ev(`document.querySelector(".layout").className`), asideLeft: await ev(`Math.round(document.querySelector(".sidebar").getBoundingClientRect().left)`), console: consoleMsgs.filter((m) => !/DevTools/.test(m)), recoverable: await ev("JSON.stringify(window.__recoverable||[])") };
// 2. flicker, production build, JS delayed by 0 and 300 ms, saved state = open, 10 runs each
out.flicker = {};
for (const delay of [0, 300]) {
  for (const page of ["SidebarEffect", "SidebarGate", "SidebarCss", "SidebarCss&variant=short"]) {
    const runs = [];
    for (let i = 0; i < 10; i++) {
      await go(`${B}/${page.replace("&", "?")}${page.includes("&") ? "&" : "?"}delay=${delay}&i=${i}`, 1800);
      const r = JSON.parse((await ev(`JSON.stringify({fcp:window.__fcp, log:window.__log})`)) ?? "{}");
      const log = r.log || [];
      const closedFrames = log.filter((x) => x[1] === "closed" && x[0] >= (r.fcp || 0) - 1).length;
      const firstOpen = log.find((x) => x[1] === "open");
      runs.push({ firstSeen: log[0]?.[0], fcp: Math.round(r.fcp), firstOpen: firstOpen?.[0], wrongMs: firstOpen ? Math.max(0, firstOpen[0] - r.fcp) : null, closedFrames, firstFrame: log[0]?.[1] });
    }
    out.flicker[`${page}@${delay}`] = runs;
  }
}
writeFileSync(join(here, "measure-results.json"), JSON.stringify(out, null, 1));
const med = (a) => a.sort((x, y) => x - y)[Math.floor(a.length / 2)];
for (const [k, v] of Object.entries(out.flicker)) console.log(k, "firstSeen median", med(v.map((r) => r.firstSeen ?? -1)), "fcp median", med(v.map((r) => r.fcp)), "wrongMs median", med(v.map((r) => r.wrongMs ?? -1)), "closedFrames median", med(v.map((r) => r.closedFrames)), "firstFrame", [...new Set(v.map((r) => r.firstFrame))].join(","));
console.log(JSON.stringify({ ...out, flicker: undefined }, null, 1));
ws.close(); proc.kill();
