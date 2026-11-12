// Fake API for the measured demos: every call has a delay, every call is logged.
export const log = [];
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// deterministic "random" latency so every mode faces the same server (mulberry32)
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export let trialSeed = 1;
export const setTrial = (n) => { trialSeed = n; };
// search: 100-900 ms, decided by (trial, term) so all modes see the same latency per keystroke
export async function searchUsers(term) {
  const ms = 100 + Math.floor(rng(trialSeed * 1000 + term.length)() * 800);
  log.push({ call: "search", term, ms, at: performance.now() });
  await sleep(ms);
  return { term, results: [`${term}-1`, `${term}-2`] };
}
export async function fetchUser(id) {
  log.push({ call: "user", id, at: performance.now() });
  await sleep(300);
  return { id, name: "Mia", role: "admin" };
}
export const DB = { projects: Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Project ${i + 1}`, owner: "mia@example.com", tags: ["web", "api"] })) };
export async function fetchProjects() {
  log.push({ call: "projects", at: performance.now() });
  await sleep(400);
  return DB.projects.map((p) => ({ ...p }));
}
export const todosDb = { items: [{ id: 1, text: "Write script", done: false }, { id: 2, text: "Record voice", done: false }] };
export async function fetchTodos() {
  log.push({ call: "todos", at: performance.now() });
  await sleep(300);
  return todosDb.items.map((t) => ({ ...t }));
}
export async function toggleTodo(id, fail = false) {
  log.push({ call: "toggle", id, at: performance.now() });
  await sleep(400);
  if (fail) throw new Error("server said no");
  todosDb.items = todosDb.items.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  return { ok: true };
}
