import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { searchUsers } from "../src/api.js";

export function QuerySearch({ term }) {
  const { data } = useQuery({
    queryKey: ["search", term],
    queryFn: () => searchUsers(term),
  });

  return <ul data-term={data?.term}>{data?.results.map((r) => <li key={r}>{r}</li>)}</ul>;
}

export default function Harness() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <QuerySearch term="react" />
    </QueryClientProvider>
  );
}
