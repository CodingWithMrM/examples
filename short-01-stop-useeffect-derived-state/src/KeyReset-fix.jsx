import React, { useState } from "react";

function ProfileEditor({ userId = "123" }) {
  const [name, setName] = useState("User " + userId);
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
}

export default function KeyResetFix() {
  const [userId, setUserId] = useState("123");
  return (
    <div>
      <button onClick={() => setUserId(String(Date.now()))}>Change User</button>
      <ProfileEditor key={userId} userId={userId} />
    </div>
  );
}
