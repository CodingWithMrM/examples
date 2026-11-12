// Fix: split the context. Components that read only the theme no longer care about the search text.
import { createContext, memo, useContext, useState } from "react";
import { count } from "./shared";

const ThemeContext = createContext("dark");
const SearchContext = createContext(null);

export default function App() {
  count("App");
  const [theme] = useState("dark");
  const [query, setQuery] = useState("");
  return (
    <ThemeContext value={theme}>
      <SearchContext value={{ query, setQuery }}>
        <SearchBox />
        <Sidebar />
      </SearchContext>
    </ThemeContext>
  );
}

function SearchBox() {
  count("SearchBox");
  const { query, setQuery } = useContext(SearchContext);
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

const Sidebar = memo(function Sidebar() {
  count("Sidebar");
  return <nav>{Array.from({ length: 50 }, (_, i) => <ThemedLink key={i} i={i} />)}</nav>;
});

function ThemedLink({ i }) {
  count("ThemedLink");
  const theme = useContext(ThemeContext);
  return <a className={theme}>Link {i}</a>;
}
