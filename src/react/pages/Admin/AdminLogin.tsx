import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";

const AdminLogin: React.FC = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as unknown as {
    state?: { from?: { pathname?: string } };
  };

  const from =
    (location.state && location.state.from && location.state.from.pathname) ||
    "/admin";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    (async () => {
      try {
        const res = await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setError("Invalid token");
          return;
        }
        const json = await res.json();
        if (json && json.success) {
          // verified by server — store locally and continue
          localStorage.setItem("admin_token", token);
          navigate(from, { replace: true });
          return;
        }
        setError("Invalid token");
      } catch (err) {
        console.error("verify error", err);
        setError("Network error");
      }
    })();
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
          Token
          <input
            className="mt-1 block w-full rounded border px-2 py-1"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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
