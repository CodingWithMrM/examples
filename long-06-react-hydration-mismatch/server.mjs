// Tiny SSR server for the measurements. node server.mjs  → http://localhost:8791/<Page>?dev=1&delay=300
import http from "node:http";
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const here = import.meta.dirname;
const common = { bundle: true, jsx: "automatic", nodePaths: [new URL("../../../../node_modules", pathToFileURL(here + "/")).pathname], logLevel: "error" };
await build({ ...common, entryPoints: [here + "/src/client.jsx"], outfile: here + "/out/client.dev.js", define: { "process.env.NODE_ENV": '"development"' } });
await build({ ...common, entryPoints: [here + "/src/client.jsx"], outfile: here + "/out/client.prod.js", define: { "process.env.NODE_ENV": '"production"' }, minify: true });
await build({ ...common, entryPoints: [here + "/src/pages.jsx"], outfile: here + "/out/pages.cjs", platform: "node", format: "cjs", external: ["react", "react-dom"], define: { "process.env.NODE_ENV": '"production"' } });
const { createRequire } = await import("node:module");
const req = createRequire(here + "/");
const { renderToString } = req(new URL("../../../../node_modules/react-dom/server.js", pathToFileURL(here + "/")).pathname);
const React = req(new URL("../../../../node_modules/react/index.js", pathToFileURL(here + "/")).pathname);
const { PAGES } = req(here + "/out/pages.cjs");
const css = `body{margin:0;font:28px system-ui;background:#fff}.layout{display:flex;min-height:100vh}.sidebar{width:260px;background:#1F2340;color:#fff;padding:24px;transform:translateX(-260px);margin-right:-260px}
.layout.open .sidebar{transform:none;margin-right:0}html[data-sidebar="open"] .layout.css .sidebar{transform:none;margin-right:0}main{padding:24px}`;
const inline = `try{var o=localStorage.getItem("sidebar")==="open";document.documentElement.dataset.sidebar=o?"open":"closed"}catch(e){}`; // = screen/InlineScript.jsx (long video)
// = screen/ShortInline.jsx (Shorts), wrapped in a block so it does not leak globals
const inlineShort = `{const html = document.documentElement; const saved = localStorage.getItem("sidebar"); html.dataset.sidebar = saved || "closed";}`;
const probe = `
window.__log=[];(function(){var f=function(){var a=document.querySelector(".sidebar");if(a){var r=a.getBoundingClientRect().left;window.__log.push([Math.round(performance.now()),r>-100?"open":"closed"])}requestAnimationFrame(f)};requestAnimationFrame(f)})();
new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(e.name==="first-contentful-paint")window.__fcp=e.startTime})}).observe({type:"paint",buffered:true});`;
http.createServer((rq, rs) => {
  const u = new URL(rq.url, "http://x");
  const name = u.pathname.slice(1);
  if (u.pathname.startsWith("/out/")) {
    const delay = Number(u.searchParams.get("delay") || 0);
    setTimeout(() => { rs.setHeader("content-type", "text/javascript"); rs.end(readFileSync(here + u.pathname)); }, delay);
    return;
  }
  if (name === "set") { rs.setHeader("content-type", "text/html"); return rs.end(`<script>localStorage.setItem("sidebar","${u.searchParams.get("v")}")</script>ok`); }
  const C = PAGES[name];
  if (!C) { rs.statusCode = 404; return rs.end("no"); }
  const dev = u.searchParams.get("dev") ? "dev" : "prod";
  const delay = u.searchParams.get("delay") || 0;
  const html = renderToString(React.createElement(C));
  const withScript = name === "SidebarCss" && !u.searchParams.get("noscript");
  rs.setHeader("content-type", "text/html");
  rs.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${css}</style>${withScript ? `<script>${u.searchParams.get("variant") === "short" ? inlineShort : inline}</script>` : ""}<script>${probe}</script></head><body><div id="root">${html}</div><script>window.__srvText=document.getElementById("t")&&document.getElementById("t").textContent</script><script src="/out/client.${dev}.js?delay=${delay}"></script></body></html>`);
}).listen(8791, () => console.log("ready :8791"));
