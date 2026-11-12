import { useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renameProject } from "../src/tabapi.js";
import { channel } from "./channel.js";

export function useRenameProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: renameProject,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["projects"],
      });
      channel.postMessage({
        type: "invalidate",
        queryKey: ["projects"],
      });
    },
  });
}

export default function Harness() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <span>{typeof useRenameProject}</span>
    </QueryClientProvider>
  );
}
