import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { searchUsers } from "../src/api.js";

export function NaiveSearch({ term }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    searchUsers(term).then(setData);
  }, [term]);

  return <ul data-term={data?.term}>{data?.results.map((r) => <li key={r}>{r}</li>)}</ul>;
}

export default function Harness() {
  return <NaiveSearch term="react" />;
}
