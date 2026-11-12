import { memo, useCallback, useState } from "react";
import { Input, pick, Rows } from "./_ui";
const ProductTable = memo((props) => <Rows {...props} />);
// screen:start app
const rowStyle = { cursor: "grab" };

function App() {
  const [q, setQ] = useState("");
  const onSelect = useCallback(
    (id) => pick(id),
    []
  );
  return (
    <>
      <Input q={q} set={setQ} />
      <ProductTable
        onSelect={onSelect}
        style={rowStyle}
      />
    </>
  );
}
// screen:end
export default App;
