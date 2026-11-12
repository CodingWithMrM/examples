import { useMutation, useQuery, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchTodos, toggleTodo } from "../src/api.js";

export function useToggleTodoPlain() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => toggleTodo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function PlainTodos() {
  const { data = [] } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
  const toggle = useToggleTodoPlain();
  return (
    <ul>
      {data.map((t) => (
        <li key={t.id} data-id={t.id} data-done={t.done} onClick={() => toggle.mutate(t.id)}>{t.text}</li>
      ))}
    </ul>
  );
}

export default function Harness() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <PlainTodos />
    </QueryClientProvider>
  );
}
