import { memo, useContext, useState } from "react";
import { Ctx, Input } from "./_ui";
// screen:start app
function App() {
  const [theme] = useState("dark");
  const [q, setQ] = useState("");
  return (
    <Ctx
      value={{ theme, q, setQ }}
    >
      <SearchBox />
      <Sidebar />
    </Ctx>
  );
}
// screen:end
// screen:start link
function ThemedLink() {
  const { theme } = useContext(Ctx);
  return <a className={theme} />;
}
// screen:end
function SearchBox() {
  const { q, setQ } = useContext(Ctx);
  return <Input q={q} set={setQ} />;
}
const Sidebar = memo(() => <nav><ThemedLink /></nav>);
export default App;
