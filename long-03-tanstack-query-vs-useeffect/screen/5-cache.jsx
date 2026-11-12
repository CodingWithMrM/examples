import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchProjects } from "../src/api.js";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 30_000,
  });
}

export function ProjectList() {
  const { data, isFetching } = useProjects();
  return <ul data-fetching={isFetching}>{data?.slice(0, 3).map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}

export default function Harness() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ProjectList />
    </QueryClientProvider>
  );
}
