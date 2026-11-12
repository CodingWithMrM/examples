import { memo, useState } from "react";
import { Input, pick, Rows } from "./_ui";
// screen:start memo
const ProductTable = memo(
  function ProductTable(props) {
    return <Rows {...props} />;
  }
);
// screen:end
// screen:start app
function App() {
  const [q, setQ] = useState("");
  return (
    <>
      <Input q={q} set={setQ} />
      <ProductTable
        onSelect={(id) => pick(id)}
        style={{ cursor: "grab" }}
      />
    </>
  );
}
// screen:end
export default App;
