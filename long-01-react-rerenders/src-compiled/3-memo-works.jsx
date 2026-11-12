import { c as _c } from "react/compiler-runtime";
// memo works once the props are stable: useCallback for the function, the object moved out of the component.
import { memo, useCallback, useState } from "react";
import { count, products, Row } from "./shared";
const rowStyle = {
  cursor: "pointer"
};
export default function App() {
  const $ = _c(7);
  count("App");
  const [query, setQuery] = useState("");
  const [, setSelected] = useState(null);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = id => setSelected(id);
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const onSelect = t0;
  let t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = e => setQuery(e.target.value);
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== query) {
    t2 = <input value={query} onChange={t1} placeholder={"Search\u2026"} />;
    $[2] = query;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = <ProductTable onSelect={onSelect} rowStyle={rowStyle} />;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  let t4;
  if ($[5] !== t2) {
    t4 = <>{t2}{t3}</>;
    $[5] = t2;
    $[6] = t4;
  } else {
    t4 = $[6];
  }
  return t4;
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