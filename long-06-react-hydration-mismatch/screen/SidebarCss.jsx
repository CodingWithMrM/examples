// On screen: the React side has no state to disagree about. CSS reads the attribute.
export default function Layout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">Menu</aside>
      <main>{children}</main>
    </div>
  );
}
// styles.css: html[data-sidebar="open"] .sidebar { transform: none; }
