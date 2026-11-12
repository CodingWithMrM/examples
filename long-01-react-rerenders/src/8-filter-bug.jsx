// When the table really uses the text: filtering 400 rows on every key, all in the same urgent update as the input.
import { useState } from "react";
import { count, products, Row } from "./shared";

export default function App() {
  count("App");
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
      <ProductTable query={query} />
    </>
  );
}

function ProductTable({ query }) {
  count("ProductTable");
  const visible = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  return <table><tbody>{visible.map((p) => <Row key={p.id} product={p} onSelect={() => {}} />)}</tbody></table>;
}
