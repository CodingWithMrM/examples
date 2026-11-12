import React from "react";

function List({ items }) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>{it.text}</li>
      ))}
    </ul>
  );
}

export default function SearchListFix({
  items = [
    { text: "Item 1", active: true },
    { text: "Item 2", active: false },
  ],
}) {
  // Calculated during render (0 extra renders):
  const filtered = items.filter((i) => i.active);

  return <List items={filtered} />;
}
