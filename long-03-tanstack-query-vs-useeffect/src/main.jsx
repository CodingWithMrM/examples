// Measurement app. ?demo=race|dedupe|cache|optimistic|tab  (tab also takes role=A|B and sync=none|fact|data|two)
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { log, setTrial, sleep, fetchProjects, fetchTodos, todosDb } from "./api.js";
import { NaiveSearch } from "../screen/1-naive.jsx";
import { IgnoreSearch } from "../screen/2-ignore.jsx";
import { QuerySearch } from "../screen/3-query.jsx";
import { NaiveUser, UserBadge } from "../screen/4-share.jsx";
import { useProjects } from "../screen/5-cache.jsx";
import { Todos } from "../screen/6-optimistic.jsx";
import { PlainTodos } from "../screen/6a-invalidate.jsx";
import * as tabapi from "./tabapi.js";
import { useRenameProject } from "../screen/7-send.jsx";
import { CrossTabSync } from "../screen/8-receive.jsx";
import { channel } from "../screen/channel.js";

const q = new URLSearchParams(location.search);
const demo = q.get("demo");
const host = document.getElementById("root");
const mount = (el) => { const d = document.createElement("div"); host.appendChild(d); const r = createRoot(d); r.render(el); return { d, unmount: () => { r.unmount(); d.remove(); } }; };
const TERMS = ["r", "re", "rea", "reac", "react"];
const out = (o) => { window.__result = o; document.getElementById("out").textContent = JSON.stringify(o, null, 1); };

function Typer({ mode }) {
  const [term, setTerm] = useState(TERMS[0]);
  useEffect(() => { TERMS.slice(1).forEach((t, i) => setTimeout(() => setTerm(t), 80 * (i + 1))); }, []);
  if (mode === "naive") return <NaiveSearch term={term} />;
  if (mode === "ignore") return <IgnoreSearch term={term} />;
  return <QueryClientProvider client={new QueryClient()}><QuerySearch term={term} /></QueryClientProvider>;
}

async function race() {
  const N = 20, res = { trials: N, stale: { naive: 0, ignore: 0, query: 0 }, latenciesLastTrial: null };
  for (const mode of ["naive", "ignore", "query"]) {
    for (let t = 1; t <= N; t++) {
      setTrial(t);
      const m = mount(<Typer mode={mode} />);
      await sleep(1300);
      if (m.d.querySelector("ul").getAttribute("data-term") !== "react") res.stale[mode]++;
      m.unmount();
    }
  }
  // one concrete trial for the video: which responses arrive in which order (naive)
  setTrial(3); log.length = 0;
  const m = mount(<Typer mode="naive" />); await sleep(1300);
  res.example = { trial: 3, shownAtEnd: m.d.querySelector("ul").getAttribute("data-term"), calls: log.map((l) => ({ term: l.term, latencyMs: l.ms, startedAt: Math.round(l.at) - Math.round(log[0].at) })) };
  m.unmount();
  out(res);
}

function Three({ mode }) {
  const queryClient = useRef(new QueryClient()).current;
  const C = mode === "naive" ? NaiveUser : UserBadge;
  return <QueryClientProvider client={queryClient}><C id={1} /><C id={1} /><C id={1} /></QueryClientProvider>;
}
async function dedupe() {
  const res = {};
  for (const mode of ["naive", "query"]) {
    log.length = 0;
    const m = mount(<Three mode={mode} />); await sleep(700);
    res[mode] = log.filter((l) => l.call === "user").length;
    m.unmount();
  }
  out({ components: 3, requestsSent: res });
}

function Page({ mode, qc }) {
  const [page, setPage] = useState("list");
  useEffect(() => { window.__go = setPage; }, []);
  return page === "list" ? <List mode={mode} /> : <div>settings</div>;
}
function List({ mode }) {
  const t0 = useRef(performance.now());
  const [naive, setNaive] = useState(null);
  const { data: qd } = useProjects2(mode);
  useEffect(() => { if (mode === "naive") fetchProjects().then(setNaive); }, [mode]);
  const data = mode === "naive" ? naive : qd;
  useLayoutEffect(() => { if (data && window.__ttd == null) window.__ttd = performance.now() - t0.current; }, [data]);
  return <ul>{data?.slice(0, 3).map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
function useProjects2(mode) {
  const stale = mode === "query-30s" ? 30_000 : 0;
  return useQuery({ queryKey: ["projects"], queryFn: fetchProjects, staleTime: stale, enabled: mode !== "naive" });
}
async function cache() {
  const res = {};
  for (const mode of ["naive", "query-0", "query-30s"]) {
    log.length = 0; window.__ttd = null;
    const qc = new QueryClient();
    const m = mount(<QueryClientProvider client={qc}><Page mode={mode} /></QueryClientProvider>);
    await sleep(900);
    const first = window.__ttd;
    window.__go("settings"); await sleep(300);
    window.__ttd = null; window.__go("list"); await sleep(900);
    res[mode] = { firstVisitMs: Math.round(first), comeBackMs: +window.__ttd.toFixed(1), networkCalls: log.filter((l) => l.call === "projects").length };
    m.unmount();
  }
  out(res);
}

async function optimistic() {
  const res = {};
  for (const mode of ["plain", "optimistic", "optimistic-fail"]) {
    todosDb.items = todosDb.items.map((t) => ({ ...t, done: false }));
    const qc = new QueryClient();
    const fail = mode === "optimistic-fail";
    const m = mount(<QueryClientProvider client={qc}>{mode === "plain" ? <PlainTodos /> : <Todos fail={fail} />}</QueryClientProvider>);
    await sleep(700);
    const li = m.d.querySelector("li[data-id='1']");
    const seen = [];
    const t0 = performance.now();
    const mo = new MutationObserver(() => seen.push({ ms: +(performance.now() - t0).toFixed(1), done: m.d.querySelector("li[data-id='1']").getAttribute("data-done") }));
    mo.observe(m.d, { attributes: true, subtree: true, childList: true });
    li.click();
    await sleep(1500);
    mo.disconnect();
    res[mode] = seen.filter((s, i) => i === 0 || s.done !== seen[i - 1].done);
    m.unmount();
  }
  out(res);
}

// ---------- cross-tab ----------
function Project1({ sync }) {
  const { data } = useQuery({ queryKey: ["projects"], queryFn: tabapi.fetchProjects, staleTime: 60_000, refetchOnWindowFocus: false });
  const name = data?.[0].name;
  useEffect(() => { if (name) (window.__shown ||= []).push({ name, at: performance.timeOrigin + performance.now() }); }, [name]);
  return <h1 id="name">{name}</h1>;
}
function Renamer({ sync }) {
  const qc = useQueryClient();
  const base = useRenameProject();
  const alt = useMutation2(sync, qc);
  useEffect(() => {
    window.__rename = (name) => sync === "fact"
      ? base.mutate({ id: 1, name }, { onSuccess: () => { window.__mutationDoneAt = performance.timeOrigin + performance.now(); } })
      : alt({ id: 1, name });
  }, [base, alt, sync]);
  return null;
}
import { useMutation } from "@tanstack/react-query";
function useMutation2(sync, qc) {
  const two = useRef(null);
  const m = useMutation({
    mutationFn: tabapi.renameProject,
    onSuccess: async (data) => {
      window.__mutationDoneAt = performance.timeOrigin + performance.now();
      qc.invalidateQueries({ queryKey: ["projects"] });
      if (sync === "fact") channel.postMessage({ type: "invalidate", queryKey: ["projects"] });
      if (sync === "data") { const list = await tabapi.fetchProjects(); channel.postMessage({ type: "data", queryKey: ["projects"], data: list }); }
      if (sync === "two") { two.current ||= new BroadcastChannel("query-sync"); two.current.postMessage({ type: "invalidate", queryKey: ["projects"] }); }
    },
  });
  return m.mutate;
}
function Listener2({ sync }) {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = sync === "two" ? new BroadcastChannel("query-sync") : channel;
    const on = ({ data }) => {
      (window.__received ||= []).push({ type: data.type, at: performance.timeOrigin + performance.now() });
      if (data.type === "invalidate") qc.invalidateQueries({ queryKey: data.queryKey });
      if (data.type === "data") qc.setQueryData(data.queryKey, data.data);
    };
    ch.addEventListener("message", on);
    return () => ch.removeEventListener("message", on);
  }, [qc, sync]);
  return null;
}
function TabApp() {
  const role = q.get("role"), sync = q.get("sync") || "fact";
  const qc = useRef(new QueryClient()).current;
  return <QueryClientProvider client={qc}>{sync === "fact" ? <CrossTabSync /> : sync !== "none" && <Listener2 sync={sync} />}<Project1 sync={sync} />{role === "A" && <Renamer sync={sync} />}</QueryClientProvider>;
}
window.__report = () => ({ shown: window.__shown, received: window.__received, fetches: tabapi.tabLog.map((l) => l.at), mutationDoneAt: window.__mutationDoneAt });
window.__bytes = () => {
  const list = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Project ${i + 1}`, owner: "mia@example.com", tags: ["web", "api"] }));
  const n = (o) => new TextEncoder().encode(JSON.stringify(o)).length;
  return { fact: n({ type: "invalidate", queryKey: ["projects"] }), data: n({ type: "data", queryKey: ["projects"], data: list }) };
};

if (demo === "race") race();
else if (demo === "dedupe") dedupe();
else if (demo === "cache") cache();
else if (demo === "optimistic") optimistic();
else if (demo === "tab") { if (q.get("role") === "A") tabapi.resetServer(); mount(<TabApp />); }
