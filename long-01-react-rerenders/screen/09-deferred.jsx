import { memo, useDeferredValue, useState } from "react";
import { Input, products, Rows } from "./_ui";
const ProductTable = memo(({ q }) => <Rows rows={products.filter((p) => p.name.includes(q))} />);
// screen:start app
function App() {
  const [q, setQ] = useState("");
  const slowQ = useDeferredValue(q);
  return (
    <>
      <Input q={q} set={setQ} />
      <ProductTable q={slowQ} />
    </>
  );
}
// screen:end
export default App;
