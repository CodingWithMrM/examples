// On screen (Shorts): a placeholder first, the real value in an effect.
import { useState, useEffect } from "react";

const clock = () => new Date().toLocaleTimeString();

export default function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => setT(clock()), []);
  return <h1>{t}</h1>;
}
