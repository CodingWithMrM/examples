// (copy of src/main.jsx, importing the compiler-built demos)
// Test harness: mounts one demo inside a <Profiler>, then types "wireless" (8 keys) or scrolls 8 times,
// and reports how many times each component rendered and how long React spent rendering (median of keys).
import { Profiler } from "react";
import { createRoot } from "react-dom/client";
import { renders } from "./shared";
import D1 from "./1-bug";
import D2 from "./2-memo-fails";
import D3 from "./3-memo-works";
import D4 from "./4-move-state-down";
import D5 from "./5-children";
import D5b from "./5b-children-bug";
import D6 from "./6-context-bug";
import D7 from "./7-context-split";
import D8 from "./8-filter-bug";
import D9 from "./9-deferred";

const demos = { "1-bug": D1, "2-memo-fails": D2, "3-memo-works": D3, "4-move-state-down": D4, "5-children": D5, "5b-children-bug": D5b, "6-context-bug": D6, "7-context-split": D7, "8-filter-bug": D8, "9-deferred": D9 };
const name = new URLSearchParams(location.search).get("demo");
const Demo = demos[name];
const durations = [];
const perEvent = [];
const onRender = (_id, phase, actual) => {
  if (phase === "mount") return;
  durations.push(actual);
  perEvent.at(-1)?.push(actual);
};

createRoot(document.getElementById("root")).render(<Profiler id="app" onRender={onRender}><Demo /></Profiler>);

const tick = () => new Promise((r) => setTimeout(r, 30));
const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
setTimeout(async () => {
  for (const k of Object.keys(renders)) delete renders[k];
  let tableMutations = 0;
  const table = document.querySelector("table");
  if (table) new MutationObserver((m) => (tableMutations += m.length)).observe(table, { subtree: true, childList: true, attributes: true, characterData: true });
  const input = document.querySelector("input");
  const panel = document.getElementById("panel");
  durations.length = 0;
  for (let i = 1; i <= 8; i++) {
    perEvent.push([]);
    if (input) {
      setValue.call(input, "wireless".slice(0, i));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      panel.scrollTop = i * 40;
      panel.dispatchEvent(new Event("scroll", { bubbles: true }));
    }
    await tick();
  }
  const sorted = [...durations].sort((a, b) => a - b);
  await tick();
  const firsts = perEvent.map((e) => e[0] ?? 0).sort((a, b) => a - b);
  const result = { demo: name, firstCommitMedianMs: +firsts[4].toFixed(2), commitsPerEvent: perEvent.map((e) => e.length), tableDomMutations: table ? tableMutations : null, events: 8, renders: { ...renders }, commits: durations.length, medianRenderMs: +(sorted[Math.floor(sorted.length / 2)] ?? 0).toFixed(2), maxRenderMs: +(sorted.at(-1) ?? 0).toFixed(2), react: (await import("react")).version, ua: navigator.userAgent };
  window.RESULT = result;
  document.title = "done";
  const pre = document.createElement("pre");
  pre.id = "result";
  pre.textContent = JSON.stringify(result, null, 1);
  document.body.prepend(pre);
}, 300);
