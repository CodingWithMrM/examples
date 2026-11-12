// useDeferredValue: the input updates first; the table follows with a deferred copy of the text, in a render React can interrupt.
import { memo, useDeferredValue, useState } from "react";
import { count, products, Row } from "./shared";

export default function App() {
  count("App");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
      <ProductTable query={deferredQuery} />
    </>
  );
}

const ProductTable = memo(function ProductTable({ query }) {
  count("ProductTable");
  const visible = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  return <table><tbody>{visible.map((p) => <Row key={p.id} product={p} onSelect={() => {}} />)}</tbody></table>;
});
