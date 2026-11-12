import React, { useState } from "react";

// TS Illusion: Types declare that user will ALWAYS be valid:
// interface User { name: string; age: number; }

export default function ApiBug() {
  const [user, setUser] = useState(null);

  const fetchUser = () => {
    // External API unexpectedly sends null in production
    const payload = null;
    setUser(payload);
  };

  return (
    <div>
      <button onClick={fetchUser}>Fetch</button>
      {user && <span>{user.name.toUpperCase()}</span>}
    </div>
  );
}
