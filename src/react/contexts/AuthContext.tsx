/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useEffect, useState } from "react";

type AuthContextValue = {
  token: string | null;
  setToken: (t: string | null) => void;
  verifyWithBackend: (token: string | null) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<
  React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null,
  );

  // cache to avoid hitting backend repeatedly in a session
  const [cachedVerified, setCachedVerified] = useState<boolean | null>(null);

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    if (t) {
      localStorage.setItem("admin_token", t);
    } else {
      localStorage.removeItem("admin_token");
      setCachedVerified(null);
    }
  }, []);

  const verifyWithBackend = useCallback(
    async (t: string | null) => {
      if (!t) return false;
      if (cachedVerified === true) return true;
      try {
        const res = await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (!res.ok) return false;
        const j = await res.json();
        const ok = Boolean(j && j.success);
        if (ok) setCachedVerified(true);
        return ok;
      } catch (err) {
        console.error("admin verify error", err);
        return false;
      }
    },
    [cachedVerified],
  );

  // keep local token state in sync with localStorage if changed elsewhere
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "admin_token") setTokenState(e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, verifyWithBackend }}>
      {children}
    </AuthContext.Provider>
  );
};

// note: intentionally only named exports to keep Fast Refresh working
