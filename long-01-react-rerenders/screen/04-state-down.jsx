import { useState } from "react";
import { Input, ProductTable } from "./_ui";
// screen:start app
function App() {
  return (
    <>
      <SearchBox />
      <ProductTable />
    </>
  );
}
function SearchBox() {
  const [q, setQ] = useState("");
  return <Input q={q} set={setQ} />;
}
// screen:end
export default App;
