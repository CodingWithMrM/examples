import { c as _c } from "react/compiler-runtime";
// Shared bits for every demo: fake data, a render counter, and a realistic row.
export const renders = {};
export const count = name => renders[name] = (renders[name] ?? 0) + 1;
export const products = Array.from({
  length: 400
}, (_, i) => ({
  id: i,
  name: `${["Wireless mouse", "Wireless keyboard", "Wireless earbuds", "USB-C cable", "Laptop stand", "Webcam", "Monitor arm", "Desk lamp"][i % 8]} ${Math.floor(i / 8) + 1}`,
  price: 5 + i * 37 % 500,
  sales: Array.from({
    length: 30
  }, (_, d) => 20 + (i * 7 + d * 13) % 50)
}));

// A normal table row: formatted price + a 30-point sparkline. No artificial slowdown.
export function Row(t0) {
  const $ = _c(19);
  const {
    product,
    onSelect,
    style
  } = t0;
  count("Row");
  let t1;
  if ($[0] !== product.price) {
    t1 = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(product.price);
    $[0] = product.price;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const price = t1;
  let t2;
  if ($[2] !== product.sales) {
    t2 = product.sales.map(_temp).join(" ");
    $[2] = product.sales;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const pts = t2;
  let t3;
  if ($[4] !== onSelect || $[5] !== product.id) {
    t3 = () => onSelect(product.id);
    $[4] = onSelect;
    $[5] = product.id;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  let t4;
  if ($[7] !== product.name) {
    t4 = <td>{product.name}</td>;
    $[7] = product.name;
    $[8] = t4;
  } else {
    t4 = $[8];
  }
  let t5;
  if ($[9] !== price) {
    t5 = <td>{price}</td>;
    $[9] = price;
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  let t6;
  if ($[11] !== pts) {
    t6 = <td><svg width="120" height="24" viewBox="0 0 120 70"><polyline points={pts} fill="none" stroke="currentColor" /></svg></td>;
    $[11] = pts;
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  let t7;
  if ($[13] !== style || $[14] !== t3 || $[15] !== t4 || $[16] !== t5 || $[17] !== t6) {
    t7 = <tr style={style} onClick={t3}>{t4}{t5}{t6}</tr>;
    $[13] = style;
    $[14] = t3;
    $[15] = t4;
    $[16] = t5;
    $[17] = t6;
    $[18] = t7;
  } else {
    t7 = $[18];
  }
  return t7;
}
function _temp(v, d) {
  return `${d * 4},${70 - v}`;
}