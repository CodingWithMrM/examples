import { useEffect, useState } from "react";
import { searchUsers } from "../src/api.js";

export function IgnoreSearch({ term }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let ignore = false;
    searchUsers(term).then((res) => {
      if (!ignore) setData(res);
    });
    return () => {
      ignore = true;
    };
  }, [term]);

  return <ul data-term={data?.term}>{data?.results.map((r) => <li key={r}>{r}</li>)}</ul>;
}

export default function Harness() {
  return <IgnoreSearch term="react" />;
}
