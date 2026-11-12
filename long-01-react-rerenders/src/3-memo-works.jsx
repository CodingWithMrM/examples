// memo works once the props are stable: useCallback for the function, the object moved out of the component.
import { memo, useCallback, useState } from "react";
import { count, products, Row } from "./shared";

const rowStyle = { cursor: "pointer" };

export default function App() {
  count("App");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const onSelect = useCallback((id) => setSelected(id), []);
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
      <ProductTable onSelect={onSelect} rowStyle={rowStyle} />
    </>
  );
}

const ProductTable = memo(function ProductTable({ onSelect, rowStyle }) {
  count("ProductTable");
  return <table><tbody>{products.map((p) => <Row key={p.id} product={p} onSelect={onSelect} style={rowStyle} />)}</tbody></table>;
});
