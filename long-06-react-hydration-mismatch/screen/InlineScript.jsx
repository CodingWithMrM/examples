// On screen: the fix. A tiny script runs before the first paint and sets one attribute on <html>.
const script = `
  try {
    var open = localStorage.getItem("sidebar") === "open";
    document.documentElement.dataset.sidebar =
      open ? "open" : "closed";
  } catch (e) {}
`;

export default function Root({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
