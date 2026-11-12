// On screen: the trap. The warning goes away, the wrong text stays.
export default function ClockSuppress() {
  return (
    <h1 suppressHydrationWarning>
      {new Date().toLocaleTimeString()}
    </h1>
  );
}
