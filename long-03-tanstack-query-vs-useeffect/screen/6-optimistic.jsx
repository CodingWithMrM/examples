import { useMutation, useQuery, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchTodos, toggleTodo } from "../src/api.js";

const flip = (t) => ({ ...t, done: !t.done });

export function useToggleTodo(fail = false) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => toggleTodo(id, fail),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["todos"] });
      const previous = qc.getQueryData(["todos"]);
      qc.setQueryData(["todos"], (old) =>
        old.map((t) => (t.id === id ? flip(t) : t))
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      qc.setQueryData(["todos"], context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function Todos({ fail }) {
  const { data = [] } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
  const toggle = useToggleTodo(fail);
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
      <Todos />
    </QueryClientProvider>
  );
}
