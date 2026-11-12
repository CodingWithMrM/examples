// Runs every measured demo in Remotion's headless Chrome (foreground, no tab throttling). Needs the folder served on :8781.
//   python3 -m http.server 8781 --directory videos/03-tanstack-query/3-work/code &  then  node videos/03-tanstack-query/3-work/code/run-measure.mjs
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dirname;
const chrome = join(here, "../../../../node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const proc = spawn(chrome, ["--remote-debugging-port=9391", "--no-sandbox", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(1500);
const base = "http://localhost:8781/index.html";
async function newPage(url) {
  const t = await (await fetch(`http://127.0.0.1:9391/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.bringToFront");
  const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.result.value;
  return { ev, close: async () => { ws.close(); await fetch(`http://127.0.0.1:9391/json/close/${t.id}`); } };
}
const results = {};
for (const [demo, wait] of [["race", 65000], ["dedupe", 3000], ["cache", 8000], ["optimistic", 8000]]) {
  const p = await newPage(`${base}?demo=${demo}`);
  const t0 = Date.now();
  while (Date.now() - t0 < wait + 60000) { await sleep(500); if (await p.ev("!!window.__result")) break; }
  results[demo] = JSON.parse(await p.ev("JSON.stringify(window.__result)"));
  console.log(demo, JSON.stringify(results[demo]));
  await p.close();
}
// cross-tab: two tabs of the same browser, 3 runs per sync mode
results.tab = {};
for (const sync of ["none", "fact", "data", "two"]) {
  results.tab[sync] = [];
  for (let run = 0; run < 5; run++) {
    const a = await newPage(`${base}?demo=tab&role=A&sync=${sync}&r=${run}`);
    const b = await newPage(`${base}?demo=tab&role=B&sync=${sync}&r=${run}`);
    await sleep(1500);
    await a.ev(`window.__rename("Apollo 2")`);
    await sleep(2500);
    const ra = JSON.parse(await a.ev("JSON.stringify(window.__report())"));
    const rb = JSON.parse(await b.ev("JSON.stringify(window.__report())"));
    const shownB = rb.shown?.at(-1);
    results.tab[sync].push({
      bShowsAtEnd: shownB?.name,
      bUpdatedAfterMs: shownB?.name === "Apollo 2" ? Math.round(shownB.at - ra.mutationDoneAt) : null,
      aFetches: ra.fetches.length, bFetches: rb.fetches.length,
      aReceivedOwn: ra.received?.length ?? 0, bReceived: rb.received?.length ?? 0,
      bytes: sync === "fact" && run === 0 ? await a.ev("JSON.stringify(window.__bytes())") : undefined,
    });
    await a.close(); await b.close();
  }
  console.log("tab", sync, JSON.stringify(results.tab[sync]));
}
writeFileSync(join(here, "measure-results.json"), JSON.stringify(results, null, 1));
proc.kill();
