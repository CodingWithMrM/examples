import { c as _c } from "react/compiler-runtime";
// "Just add memo": it does nothing here, because App passes a new function and a new object every render.
import { memo, useState } from "react";
import { count, products, Row } from "./shared";
export default function App() {
  const $ = _c(6);
  count("App");
  const [query, setQuery] = useState("");
  const [, setSelected] = useState(null);
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
    t2 = <ProductTable onSelect={id => setSelected(id)} rowStyle={{
      cursor: "pointer"
    }} />;
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
const ProductTable = memo(function ProductTable(t0) {
  const $ = _c(5);
  const {
    onSelect,
    rowStyle
  } = t0;
  count("ProductTable");
  let t1;
  if ($[0] !== onSelect || $[1] !== rowStyle) {
    t1 = products.map(p => <Row key={p.id} product={p} onSelect={onSelect} style={rowStyle} />);
    $[0] = onSelect;
    $[1] = rowStyle;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  let t2;
  if ($[3] !== t1) {
    t2 = <table><tbody>{t1}</tbody></table>;
    $[3] = t1;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  return t2;
});