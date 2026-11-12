// Exactly the code shown on screen (lines 2-8), plus a tiny harness so check-samples can compile and render it.
import { useEffect, useState } from "react";

function Widget({ load }) {
  const [W, setW] = useState(null);
  useEffect(() => {
    load().then((m) => setW(() => m.default));
  }, [load]);
  return W ? <W /> : <Skeleton />;
}

function Skeleton() {
  return <div className="skeleton" />;
}

const loadChart = () => Promise.resolve({ default: () => <div>Chart</div> });

export default function Demo() {
  return <Widget load={loadChart} />;
}
