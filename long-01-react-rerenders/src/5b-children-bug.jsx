// The same panel with the table written inside it: every scroll event re-renders the table.
import { useState } from "react";
import { count, products, Row } from "./shared";

export default function App() {
  count("App");
  return <ScrollPanel />;
}

function ScrollPanel() {
  count("ScrollPanel");
  const [scrollY, setScrollY] = useState(0);
  return (
    <div id="panel" style={{ height: 300, overflow: "auto" }} onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}>
      <div style={{ position: "sticky", top: 0 }}>Scrolled {Math.round(scrollY)}px</div>
      <ProductTable />
    </div>
  );
}

function ProductTable() {
  count("ProductTable");
  return <table><tbody>{products.map((p) => <Row key={p.id} product={p} onSelect={() => {}} />)}</tbody></table>;
}
