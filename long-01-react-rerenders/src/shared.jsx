// Shared bits for every demo: fake data, a render counter, and a realistic row.
export const renders = {};
export const count = (name) => (renders[name] = (renders[name] ?? 0) + 1);

export const products = Array.from({ length: 400 }, (_, i) => ({
  id: i,
  name: `${["Wireless mouse", "Wireless keyboard", "Wireless earbuds", "USB-C cable", "Laptop stand", "Webcam", "Monitor arm", "Desk lamp"][i % 8]} ${Math.floor(i / 8) + 1}`,
  price: 5 + ((i * 37) % 500),
  sales: Array.from({ length: 30 }, (_, d) => 20 + ((i * 7 + d * 13) % 50)),
}));

// A normal table row: formatted price + a 30-point sparkline. No artificial slowdown.
export function Row({ product, onSelect, style }) {
  count("Row");
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price);
  const pts = product.sales.map((v, d) => `${d * 4},${70 - v}`).join(" ");
  return (
    <tr style={style} onClick={() => onSelect(product.id)}>
      <td>{product.name}</td>
      <td>{price}</td>
      <td><svg width="120" height="24" viewBox="0 0 120 70"><polyline points={pts} fill="none" stroke="currentColor" /></svg></td>
    </tr>
  );
}
