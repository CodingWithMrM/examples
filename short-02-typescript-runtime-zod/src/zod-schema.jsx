import React from "react";
import { z } from "zod";

// The runtime schema shown on screen: safeParse on a null payload reports failure instead of crashing.
const User = z.object({
  name: z.string() });

export default function ZodSchema({ data = null }) {
  const r = User.safeParse(data);
  return <p>{r.success ? "valid: " + r.data.name : "rejected at the boundary"}</p>;
}
