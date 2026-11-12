import { c as _c } from "react/compiler-runtime";
// The bug: the search text lives in App, so every keystroke re-renders the whole table.
import { useState } from "react";
import { count, products, Row } from "./shared";
export default function App() {
  const $ = _c(6);
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
    t1 = <input value={query} onChange={t0} placeholder={"Search\u2026"} />;
    $[1] = query;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  let t2;
  if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = <ProductTable />;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] !== t1) {
    t3 = <>{t1}{t2}</>;
    $[4] = t1;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  return t3;
}
function ProductTable() {
  const $ = _c(1);
  count("ProductTable");
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <table><tbody>{products.map(_temp2)}</tbody></table>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function _temp2(p) {
  return <Row key={p.id} product={p} onSelect={_temp} />;
}
function _temp() {}