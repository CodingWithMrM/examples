// On screen: the flicker. The server cannot read localStorage, so the first paint is always closed.
import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(localStorage.getItem("sidebar") === "open");
  }, []);

  return (
    <div className={open ? "layout open" : "layout"}>
      <aside className="sidebar">Menu</aside>
      <main>{children}</main>
    </div>
  );
}
