import { useState } from "react";
import { Input, products, Rows } from "./_ui";
// screen:start table
function ProductTable({ q }) {
  const rows = products.filter(
    (p) => p.name.includes(q)
  );
  return <Rows rows={rows} />;
}
// screen:end
function App() {
  const [q, setQ] = useState("");
  return <><Input q={q} set={setQ} /><ProductTable q={q} /></>;
}
export default App;
