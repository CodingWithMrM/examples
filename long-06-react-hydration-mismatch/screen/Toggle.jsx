// On screen: the toggle. Flip the attribute, then save it.
export default function Toggle() {
  function toggle() {
    const html = document.documentElement;
    const open = html.dataset.sidebar === "open";
    html.dataset.sidebar = open ? "closed" : "open";
    localStorage.setItem("sidebar", html.dataset.sidebar);
  }
  return <button onClick={toggle}>Menu</button>;
}
