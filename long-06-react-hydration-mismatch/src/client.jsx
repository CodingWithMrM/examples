import { hydrateRoot } from "react-dom/client";
import { PAGES } from "./pages.jsx";
const name = location.pathname.slice(1);
const C = PAGES[name];
window.__hydrateStart = performance.now();
hydrateRoot(document.getElementById("root"), <C />, { onRecoverableError: (e) => (window.__recoverable = (window.__recoverable || []).concat(String(e.message).slice(0, 160))) });
window.__hydrateEnd = performance.now();
