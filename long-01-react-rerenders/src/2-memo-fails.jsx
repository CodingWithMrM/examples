// "Just add memo": it does nothing here, because App passes a new function and a new object every render.
import { memo, useState } from "react";
import { count, products, Row } from "./shared";

export default function App() {
  count("App");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
      <ProductTable onSelect={(id) => setSelected(id)} rowStyle={{ cursor: "pointer" }} />
    </>
  );
}

const ProductTable = memo(function ProductTable({ onSelect, rowStyle }) {
  count("ProductTable");
  return <table><tbody>{products.map((p) => <Row key={p.id} product={p} onSelect={onSelect} style={rowStyle} />)}</tbody></table>;
});
