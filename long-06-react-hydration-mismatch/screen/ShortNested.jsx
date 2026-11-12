// On screen (Shorts): the prop works one level deep, so the paragraph still mismatches.
export default function Nested() {
  return (
    <div suppressHydrationWarning>
      <p>
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
