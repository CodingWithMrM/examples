// Runs every demo through React Compiler 1.0 (babel-plugin-react-compiler) into src-compiled/, keeping JSX for esbuild.
// Logs which functions the compiler optimised, so we know it really ran.
import { transformSync } from "@babel/core";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("src-compiled", { recursive: true });
for (const f of readdirSync("src").filter((f) => f.endsWith(".jsx") && f !== "main.jsx")) {
  const events = [];
  const out = transformSync(readFileSync(`src/${f}`, "utf8"), {
    filename: f,
    babelrc: false,
    configFile: false,
    plugins: ["@babel/plugin-syntax-jsx", ["babel-plugin-react-compiler", { target: "19", logger: { logEvent: (_file, e) => events.push(e) } }]],
  });
  writeFileSync(`src-compiled/${f}`, out.code);
  const ok = events.filter((e) => e.kind === "CompileSuccess").map((e) => e.fnName);
  const bad = events.filter((e) => e.kind !== "CompileSuccess" && e.kind !== "PipelineError" ? e.kind.includes("Error") || e.kind === "CompileSkip" : e.kind === "PipelineError").map((e) => `${e.fnName ?? "?"}: ${e.kind} ${e.detail?.reason ?? e.detail?.options?.reason ?? ""}`);
  console.log(`${f.padEnd(24)} compiled: ${ok.join(", ") || "-"}${bad.length ? `   ⚠ ${bad.join("; ")}` : ""}`);
}
