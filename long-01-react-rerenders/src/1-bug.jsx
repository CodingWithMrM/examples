// The bug: the search text lives in App, so every keystroke re-renders the whole table.
import { useState } from "react";
import { count, products, Row } from "./shared";

export default function App() {
  count("App");
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
      <ProductTable />
    </>
  );
}

function ProductTable() {
  count("ProductTable");
  return <table><tbody>{products.map((p) => <Row key={p.id} product={p} onSelect={() => {}} />)}</tbody></table>;
}
