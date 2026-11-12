// Browser entry: ?mode=suspense or ?mode=gate. Prints the measured table into the page and window.__result.
import { createRoot } from "react-dom/client";
import Measure, { log, DELAYS } from "./Measure.jsx";

const mode = new URLSearchParams(location.search).get("mode") || "suspense";
createRoot(document.getElementById("root")).render(<Measure mode={mode} />);

setTimeout(() => {
  const rows = [...log].sort((a, b) => a.i - b.i).map((r) => ({ widget: r.i + 1, ready: r.ready, shown: r.shown, waited: r.shown - r.ready }));
  window.__result = { mode, react: "19.3.1", delays: DELAYS, rows };
  document.getElementById("out").textContent = JSON.stringify(window.__result, null, 1);
}, 1500);
