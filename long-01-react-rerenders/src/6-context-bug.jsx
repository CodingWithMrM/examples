// Context: a new value object every render makes every consumer re-render, even ones that only read `theme`.
import { createContext, memo, useContext, useState } from "react";
import { count } from "./shared";

const AppContext = createContext(null);

export default function App() {
  count("App");
  const [theme, setTheme] = useState("dark");
  const [query, setQuery] = useState("");
  return (
    <AppContext.Provider value={{ theme, setTheme, query, setQuery }}>
      <SearchBox />
      <Sidebar />
    </AppContext.Provider>
  );
}

function SearchBox() {
  count("SearchBox");
  const { query, setQuery } = useContext(AppContext);
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

const Sidebar = memo(function Sidebar() {
  count("Sidebar");
  return <nav>{Array.from({ length: 50 }, (_, i) => <ThemedLink key={i} i={i} />)}</nav>;
});

function ThemedLink({ i }) {
  count("ThemedLink");
  const { theme } = useContext(AppContext);
  return <a className={theme}>Link {i}</a>;
}
