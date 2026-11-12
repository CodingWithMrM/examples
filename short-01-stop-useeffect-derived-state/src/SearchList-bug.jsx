import React, { useState, useEffect } from "react";

function List({ items }) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>{it.text}</li>
      ))}
    </ul>
  );
}

export default function SearchListBug({
  items = [
    { text: "Item 1", active: true },
    { text: "Item 2", active: false },
  ],
}) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(items.filter((i) => i.active));
  }, [items]);

  return <List items={filtered} />;
}
