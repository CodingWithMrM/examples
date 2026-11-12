// Fake server shared by every tab of this origin (localStorage), with delays. Used by the cross-tab demo.
import { sleep } from "./api.js";
export const tabLog = [];
const KEY = "demo-project-1-name";
export async function fetchProjects() {
  tabLog.push({ call: "fetchProjects", at: performance.timeOrigin + performance.now() });
  await sleep(400);
  const name = localStorage.getItem(KEY) ?? "Apollo";
  return Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: i === 0 ? name : `Project ${i + 1}`, owner: "mia@example.com", tags: ["web", "api"] }));
}
export async function renameProject({ id, name }) {
  await sleep(300);
  localStorage.setItem(KEY, name);
  return { id, name };
}
export const resetServer = () => localStorage.removeItem(KEY);
