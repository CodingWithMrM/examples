// On screen: reading localStorage in the first render. The server and the browser disagree.
import { useState } from "react";

export default function Layout({ children }) {
  const [open] = useState(() =>
    typeof window === "undefined"
      ? false
      : localStorage.getItem("sidebar") === "open"
  );

  return (
    <div className={open ? "layout open" : "layout"}>
      <aside className="sidebar">Menu</aside>
      <main>{children}</main>
    </div>
  );
}
