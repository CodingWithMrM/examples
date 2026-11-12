import { c as _c } from "react/compiler-runtime";
// When the state must wrap the table (a panel that tracks scroll), pass the table in as children.
// Children are created by App, which does not re-render, so React reuses the same elements.
import { useState } from "react";
import { count, products, Row } from "./shared";
export default function App() {
  const $ = _c(1);
  count("App");
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <ScrollPanel><ProductTable /></ScrollPanel>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function ScrollPanel(t0) {
  const $ = _c(10);
  const {
    children
  } = t0;
  count("ScrollPanel");
  const [scrollY, setScrollY] = useState(0);
  let t1;
  let t2;
  let t3;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {
      height: 300,
      overflow: "auto"
    };
    t2 = e => setScrollY(e.currentTarget.scrollTop);
    t3 = {
      position: "sticky",
      top: 0
    };
    $[0] = t1;
    $[1] = t2;
    $[2] = t3;
  } else {
    t1 = $[0];
    t2 = $[1];
    t3 = $[2];
  }
  let t4;
  if ($[3] !== scrollY) {
    t4 = Math.round(scrollY);
    $[3] = scrollY;
    $[4] = t4;
  } else {
    t4 = $[4];
  }
  let t5;
  if ($[5] !== t4) {
    t5 = <div style={t3}>Scrolled {t4}px</div>;
    $[5] = t4;
    $[6] = t5;
  } else {
    t5 = $[6];
  }
  let t6;
  if ($[7] !== children || $[8] !== t5) {
    t6 = <div id="panel" style={t1} onScroll={t2}>{t5}{children}</div>;
    $[7] = children;
    $[8] = t5;
    $[9] = t6;
  } else {
    t6 = $[9];
  }
  return t6;
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