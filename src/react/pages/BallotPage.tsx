import React, { useState } from "react";

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const headers = new Headers();
      headers.set("Authorization", "Basic " + btoa(`${username}:${password}`));
      const res = await fetch("/ballot", {
        method: "POST",
        headers,
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError("Invalid credentials or unauthorized");
      }
    } catch (err) {
      setStatus("error");
      setError("Network error");
    }
  };

  if (status === "success") {
    return (
      <div>
        <h1>Ballot</h1>
        <p>Access granted. You can now vote!</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Ballot</h1>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 320, margin: "2rem auto" }}
      >
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Checking..." : "Login"}
        </button>
        {status === "error" && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
};

export default Dashboard;
