// Every line of the on-screen code (src/v03/code.ts) must exist in a real, compiled sample file in screen/.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const here = import.meta.dirname;
const files = readdirSync(join(here, "screen")).map((f) => readFileSync(join(here, "screen", f), "utf8"));
const all = files.join("\n").split("\n").map((l) => l.replace(/\s+$/, ""));
const src = readFileSync(join(here, "../../../../src/v03/code.ts"), "utf8");
let bad = 0, n = 0;
for (const m of src.matchAll(/^\s+(["'`])(.*)\1,$/gm)) {
  const line = JSON.parse(m[1] === "'" ? `"${m[2].replace(/"/g, '\\"').replace(/\\'/g, "'")}"` : m[0].trim().replace(/,$/, ""));
  n++;
  if (line === "" ) continue;
  if (!all.includes(line)) { bad++; console.log("NOT IN SAMPLES:", line); }
}
console.log(`${n} on-screen code lines checked, ${bad} not found`);
process.exit(bad ? 1 : 0);
