// Measured demo for the Style R test Short: React.lazy + Suspense hold ready widgets back.
// 6 lazy widgets whose code "arrives" at 40, 80, 120, 160, 200 and 240 ms.
// Mode "suspense": each widget in its own <Suspense>. Mode "gate": no suspending (placeholder, load in an effect, swap).
// For every widget we log: code ready (ms) and content painted (ms, useLayoutEffect after commit).
import { Suspense, lazy, useEffect, useLayoutEffect, useState } from "react";

export const DELAYS = [40, 80, 120, 160, 200, 240];
const t0 = typeof performance !== "undefined" ? performance.now() : 0;
const now = () => Math.round((typeof performance !== "undefined" ? performance.now() : 0) - t0);
export const log = [];

function makeWidget(i) {
  return function Widget() {
    useLayoutEffect(() => {
      const row = log.find((r) => r.i === i);
      if (row && row.shown == null) row.shown = now();
    }, []);
    return <div className="w">Widget {i + 1}</div>;
  };
}

function loader(i) {
  return () =>
    new Promise((res) =>
      setTimeout(() => {
        log.push({ i, ready: now(), shown: null });
        res({ default: makeWidget(i) });
      }, DELAYS[i])
    );
}

const lazies = DELAYS.map((_, i) => lazy(loader(i)));

function Gated({ i }) {
  const [C, setC] = useState(null);
  useEffect(() => {
    let active = true;
    loader(i)().then((m) => active && setC(() => m.default));
    return () => { active = false; };
  }, [i]);
  return C ? <C /> : <div className="w ph">…</div>;
}

export default function Measure({ mode = "suspense" }) {
  return (
    <div className="grid">
      {DELAYS.map((_, i) => {
        const L = lazies[i];
        return mode === "gate" ? (
          <Gated key={i} i={i} />
        ) : (
          <Suspense key={i} fallback={<div className="w ph">…</div>}>
            <L />
          </Suspense>
        );
      })}
    </div>
  );
}
