import { useState } from "react";
import { Input, ProductTable } from "./_ui";
// screen:start app
function App() {
  const [q, setQ] = useState("");
  return (
    <>
      <Input q={q} set={setQ} />
      <ProductTable />
    </>
  );
}
// screen:end
export default App;
