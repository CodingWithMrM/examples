// On screen (Shorts): the inline script, formatted for a narrow card.
const script = `
  const html = document.documentElement;
  const saved =
    localStorage.getItem("sidebar");
  html.dataset.sidebar =
    saved || "closed";
`;

export default function Head() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
