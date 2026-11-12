import { useEffect } from "react";
import { useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { channel } from "./channel.js";

export function CrossTabSync() {
  const qc = useQueryClient();

  useEffect(() => {
    const onMessage = ({ data }) => {
      if (data.type !== "invalidate") return;
      if (!Array.isArray(data.queryKey)) return;
      qc.invalidateQueries({
        queryKey: data.queryKey,
      });
    };
    channel.addEventListener("message", onMessage);
    return () => channel.removeEventListener("message", onMessage);
  }, [qc]);

  return null;
}

export default function Harness() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <CrossTabSync />
      <span>listening</span>
    </QueryClientProvider>
  );
}
