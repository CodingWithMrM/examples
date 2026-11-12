import { memo, useContext, useState } from "react";
import { Input, Query, Theme } from "./_ui";
// screen:start app
function App() {
  const [q, setQ] = useState("");
  return (
    <Theme value="dark">
      <Query value={[q, setQ]}>
        <SearchBox />
        <Sidebar />
      </Query>
    </Theme>
  );
}
// screen:end
// screen:start link
function ThemedLink() {
  const theme = useContext(Theme);
  return <a className={theme} />;
}
// screen:end
function SearchBox() {
  const [q, setQ] = useContext(Query);
  return <Input q={q} set={setQ} />;
}
const Sidebar = memo(() => <nav><ThemedLink /></nav>);
export default App;
