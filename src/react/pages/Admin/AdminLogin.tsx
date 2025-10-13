import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as unknown as {
    state?: { from?: { pathname?: string } };
  };

  const from =
    (location.state && location.state.from && location.state.from.pathname) ||
    "/admin";

  const { login } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const ok = await login(username, password);
      if (!ok) {
        setError("Invalid credentials");
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      console.error("login error", err);
      setError("Network error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded bg-white p-6 shadow"
      >
        <h2 className="mb-4 text-lg font-semibold">Admin Login</h2>
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        <label className="mb-2 block text-sm">
          Username
          <input
            className="mt-1 block w-full rounded border px-2 py-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </label>
        <label className="mb-2 block text-sm">
          Password
          <input
            className="mt-1 block w-full rounded border px-2 py-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="flex justify-end">
          <button
            className="rounded bg-sky-600 px-3 py-1 text-white"
            type="submit"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
