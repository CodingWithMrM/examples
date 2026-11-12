import { c as _c } from "react/compiler-runtime";
// The same panel with the table written inside it: every scroll event re-renders the table.
import { useState } from "react";
import { count, products, Row } from "./shared";
export default function App() {
  const $ = _c(1);
  count("App");
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <ScrollPanel />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function ScrollPanel() {
  const $ = _c(10);
  count("ScrollPanel");
  const [scrollY, setScrollY] = useState(0);
  let t0;
  let t1;
  let t2;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = {
      height: 300,
      overflow: "auto"
    };
    t1 = e => setScrollY(e.currentTarget.scrollTop);
    t2 = {
      position: "sticky",
      top: 0
    };
    $[0] = t0;
    $[1] = t1;
    $[2] = t2;
  } else {
    t0 = $[0];
    t1 = $[1];
    t2 = $[2];
  }
  let t3;
  if ($[3] !== scrollY) {
    t3 = Math.round(scrollY);
    $[3] = scrollY;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  let t4;
  if ($[5] !== t3) {
    t4 = <div style={t2}>Scrolled {t3}px</div>;
    $[5] = t3;
    $[6] = t4;
  } else {
    t4 = $[6];
  }
  let t5;
  if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = <ProductTable />;
    $[7] = t5;
  } else {
    t5 = $[7];
  }
  let t6;
  if ($[8] !== t4) {
    t6 = <div id="panel" style={t0} onScroll={t1}>{t4}{t5}</div>;
    $[8] = t4;
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