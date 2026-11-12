import { c as _c } from "react/compiler-runtime";
// Context: a new value object every render makes every consumer re-render, even ones that only read `theme`.
import { createContext, memo, useContext, useState } from "react";
import { count } from "./shared";
const AppContext = createContext(null);
export default function App() {
  const $ = _c(7);
  count("App");
  const [theme, setTheme] = useState("dark");
  const [query, setQuery] = useState("");
  let t0;
  if ($[0] !== query || $[1] !== theme) {
    t0 = {
      theme,
      setTheme,
      query,
      setQuery
    };
    $[0] = query;
    $[1] = theme;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  let t1;
  let t2;
  if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = <SearchBox />;
    t2 = <Sidebar />;
    $[3] = t1;
    $[4] = t2;
  } else {
    t1 = $[3];
    t2 = $[4];
  }
  let t3;
  if ($[5] !== t0) {
    t3 = <AppContext.Provider value={t0}>{t1}{t2}</AppContext.Provider>;
    $[5] = t0;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  return t3;
}
function SearchBox() {
  const $ = _c(5);
  count("SearchBox");
  const {
    query,
    setQuery
  } = useContext(AppContext);
  let t0;
  if ($[0] !== setQuery) {
    t0 = e => setQuery(e.target.value);
    $[0] = setQuery;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  let t1;
  if ($[2] !== query || $[3] !== t0) {
    t1 = <input value={query} onChange={t0} />;
    $[2] = query;
    $[3] = t0;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  return t1;
}
const Sidebar = memo(function Sidebar() {
  const $ = _c(1);
  count("Sidebar");
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <nav>{Array.from({
        length: 50
      }, _temp)}</nav>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
});
function ThemedLink(t0) {
  const $ = _c(3);
  const {
    i
  } = t0;
  count("ThemedLink");
  const {
    theme
  } = useContext(AppContext);
  let t1;
  if ($[0] !== i || $[1] !== theme) {
    t1 = <a className={theme}>Link {i}</a>;
    $[0] = i;
    $[1] = theme;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}
function _temp(_, i) {
  return <ThemedLink key={i} i={i} />;
}