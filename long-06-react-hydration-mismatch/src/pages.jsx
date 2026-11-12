// Demo pages for the hydration measurements. Named exports only (the on-screen samples live in ../screen).
import { useState, useEffect, Suspense, use } from "react";
import { browser } from "react-dom";

const time = () => new Date().toLocaleTimeString([], { hour12: false });

export function Clock() { return <h1 id="t">{time()}</h1>; }
export function ClockGate() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;
  return <h1 id="t">{time()}</h1>;
}
export function ClockSuppress() {
  // also record the time the BROWSER computed, so we can compare it with what stayed on screen
  const [clientTime, setClientTime] = useState("");
  useEffect(() => setClientTime(time()), []);
  return (<><h1 id="t" suppressHydrationWarning>{time()}</h1><p id="client">{clientTime}</p></>);
}
export function NestedSuppress() {
  return <div suppressHydrationWarning><p id="t">{time()}</p></div>;
}

const Layout = ({ open, children }) => (
  <div className={open ? "layout open" : "layout"}>
    <aside className="sidebar">Menu</aside>
    <main>{children ?? <p>Page content</p>}</main>
  </div>
);
export function SidebarInit() {
  const [open] = useState(() => typeof window === "undefined" ? false : localStorage.getItem("sidebar") === "open");
  return <Layout open={open} />;
}
export function SidebarEffect() {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(localStorage.getItem("sidebar") === "open"); }, []);
  return <Layout open={open} />;
}
export function SidebarGate() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;
  return <Layout open={localStorage.getItem("sidebar") === "open"} />;
}
// the fix: no React state at all; CSS reads html[data-sidebar] that the inline script set
export function SidebarCss() { return <div className="layout css"><aside className="sidebar">Menu</aside><main><p>Page content</p></main></div>; }

function BClock() { use(browser("Needs the browser clock")); return <h1 id="t">{time()}</h1>; }
export function BrowserOnly() { return <Suspense fallback={<h1 id="t">Loading…</h1>}><BClock /></Suspense>; }

export const PAGES = { BrowserOnly, Clock, ClockGate, ClockSuppress, NestedSuppress, SidebarInit, SidebarEffect, SidebarGate, SidebarCss };
