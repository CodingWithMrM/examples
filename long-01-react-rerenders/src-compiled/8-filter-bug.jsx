import { c as _c } from "react/compiler-runtime";
// When the table really uses the text: filtering 400 rows on every key, all in the same urgent update as the input.
import { useState } from "react";
import { count, products, Row } from "./shared";
export default function App() {
  const $ = _c(3);
  count("App");
  const [query, setQuery] = useState("");
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = e => setQuery(e.target.value);
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  let t1;
  if ($[1] !== query) {
    t1 = <><input value={query} onChange={t0} placeholder={"Search\u2026"} /><ProductTable query={query} /></>;
    $[1] = query;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}
function ProductTable(t0) {
  const $ = _c(4);
  const {
    query
  } = t0;
  count("ProductTable");
  let t1;
  if ($[0] !== query) {
    const visible = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    t1 = visible.map(_temp2);
    $[0] = query;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== t1) {
    t2 = <table><tbody>{t1}</tbody></table>;
    $[2] = t1;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  return t2;
}
function _temp2(p_0) {
  return <Row key={p_0.id} product={p_0} onSelect={_temp} />;
}
function _temp() {}