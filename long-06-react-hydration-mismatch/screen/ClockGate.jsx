// On screen: the null gate. The server sends nothing, the browser fills it in.
import { useState, useEffect } from "react";

function ClockGate() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;
  return <h1>{new Date().toLocaleTimeString()}</h1>;
}

export default function Page() {
  return <main><ClockGate /></main>;
}
