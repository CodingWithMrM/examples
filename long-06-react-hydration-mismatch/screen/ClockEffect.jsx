// On screen: a cleaner clock. A placeholder on the server, the real time in an effect, once.
import { useState, useEffect } from "react";

export default function ClockEffect() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  return <h1>{time}</h1>;
}
