import { c as _c } from "react/compiler-runtime";
// The simpler fix: only the search box needs the text, so the state moves into it. No memo needed.
import { useState } from "react";
import { count, products, Row } from "./shared";
export default function App() {
  const $ = _c(1);
  count("App");
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <><SearchBox /><ProductTable /></>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function SearchBox() {
  const $ = _c(3);
  count("SearchBox");
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
  return t1;
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