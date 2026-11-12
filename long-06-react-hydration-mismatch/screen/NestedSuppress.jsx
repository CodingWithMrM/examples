// On screen: the prop only works one level deep. The paragraph inside still mismatches.
export default function Nested() {
  return (
    <div suppressHydrationWarning>
      <p>{new Date().toLocaleTimeString()}</p>
    </div>
  );
}
