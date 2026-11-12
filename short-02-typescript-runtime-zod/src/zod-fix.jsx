import React, { useState } from "react";

// Runtime validation boundary (schema guard)
function validateUser(data) {
  if (data && typeof data.name === "string" && typeof data.age === "number") {
    return { ok: true, value: data };
  }
  return { ok: false, error: "Invalid payload from API" };
}

export default function ZodFix() {
  const [status, setStatus] = useState("idle");

  const handleFetch = (externalApiPayload) => {
    const parsed = validateUser(externalApiPayload);
    if (!parsed.ok) {
      setStatus("Protected: " + parsed.error);
    } else {
      setStatus("Safe user: " + parsed.value.name.toUpperCase());
    }
  };

  return (
    <div>
      <button onClick={() => handleFetch(null)}>Test Bad Payload</button>
      <div>Status: {status}</div>
    </div>
  );
}
