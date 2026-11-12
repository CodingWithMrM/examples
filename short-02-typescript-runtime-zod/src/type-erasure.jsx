import React from "react";

// Demonstration of compile output:
// TypeScript types are completely erased; only raw JS remains.
export default function TypeErasure() {
  const jsRuntimeCode = `
    async function getUser(id) {
      const res = await fetch("/api/user/" + id);
      return res.json(); // No types exist here!
    }
  `;
  return <pre>{jsRuntimeCode}</pre>;
}
