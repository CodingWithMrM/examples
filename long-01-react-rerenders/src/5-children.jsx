// When the state must wrap the table (a panel that tracks scroll), pass the table in as children.
// Children are created by App, which does not re-render, so React reuses the same elements.
import { useState } from "react";
import { count, products, Row } from "./shared";

export default function App() {
  count("App");
  return (
    <ScrollPanel>
      <ProductTable />
    </ScrollPanel>
  );
}

function ScrollPanel({ children }) {
  count("ScrollPanel");
  const [scrollY, setScrollY] = useState(0);
  return (
    <div id="panel" style={{ height: 300, overflow: "auto" }} onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}>
      <div style={{ position: "sticky", top: 0 }}>Scrolled {Math.round(scrollY)}px</div>
      {children}
    </div>
  );
}

function ProductTable() {
  count("ProductTable");
  return <table><tbody>{products.map((p) => <Row key={p.id} product={p} onSelect={() => {}} />)}</tbody></table>;
}
