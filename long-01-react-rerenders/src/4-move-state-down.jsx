// The simpler fix: only the search box needs the text, so the state moves into it. No memo needed.
import { useState } from "react";
import { count, products, Row } from "./shared";

export default function App() {
  count("App");
  return (
    <>
      <SearchBox />
      <ProductTable />
    </>
  );
}

function SearchBox() {
  count("SearchBox");
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />;
}

function ProductTable() {
  count("ProductTable");
  return <table><tbody>{products.map((p) => <Row key={p.id} product={p} onSelect={() => {}} />)}</tbody></table>;
}
