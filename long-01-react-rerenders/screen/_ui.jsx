// Small stand-ins the screen snippets use, so the snippets stay short (≤ 36 characters a line) and still run.
import { createContext, useState } from "react";

export const products = [{ id: 1, name: "Wireless mouse" }, { id: 2, name: "USB-C cable" }];
export const Input = ({ q, set }) => <input value={q} onChange={(e) => set(e.target.value)} />;
export const Rows = ({ rows = products, style, onSelect }) => (
  <table><tbody>{rows.map((p) => <tr key={p.id} style={style} onClick={() => onSelect?.(p.id)}><td>{p.name}</td></tr>)}</tbody></table>
);
export const ProductTable = (props) => <Rows {...props} />;
export const Panel = ({ y, children }) => <div data-y={y}>{children}</div>;
export const pick = () => {};
// re-renders its caller on every scroll, like useState + onScroll
export const useScrollY = () => useState(0)[0];
export const Ctx = createContext(null);
export const Theme = createContext("dark");
export const Query = createContext(null);
export const Sidebar = () => <nav />;
