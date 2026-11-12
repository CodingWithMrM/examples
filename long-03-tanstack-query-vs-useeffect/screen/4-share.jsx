import { useEffect, useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchUser } from "../src/api.js";

// before: every component fetches for itself
export function NaiveUser({ id }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  return <span>{user?.name}</span>;
}

// after: one hook, one key, any component
export function useUser(id) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
  });
}

export function UserBadge({ id }) {
  const { data } = useUser(id);
  return <span>{data?.name}</span>;
}

export default function Harness() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserBadge id={1} />
    </QueryClientProvider>
  );
}
