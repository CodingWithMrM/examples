import React from "react";

// The compiled JavaScript has no types: reading .name on null throws. The message below is what the engine reports.
function greet(user) {
  return "Hello " + user.name;
}

export default function CrashNull() {
  let message = "";
  try {
    greet(null);
  } catch (e) {
    message = e.message;
  }
  return <p>{message}</p>;
}
