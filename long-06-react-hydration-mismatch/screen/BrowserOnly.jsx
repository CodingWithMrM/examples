// On screen: React 19.3. Skip server rendering for one component, no effect needed.
import { Suspense, use } from "react";
import { browser } from "react-dom";

function Clock() {
  use(browser("Needs the browser clock"));
  return <h1>{new Date().toLocaleTimeString()}</h1>;
}

export default function Page() {
  return (
    <Suspense fallback={<h1>Loading…</h1>}>
      <Clock />
    </Suspense>
  );
}
