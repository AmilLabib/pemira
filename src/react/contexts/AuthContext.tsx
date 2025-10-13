/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useState } from "react";

type AuthContextValue = {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyWithBackend: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<
  React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cachedVerified, setCachedVerified] = useState<boolean | null>(null);

  const verifyWithBackend = useCallback(async () => {
    if (cachedVerified === true) return true;
    try {
      const res = await fetch("/api/admin/verify", {
        credentials: "same-origin",
      });
      if (!res.ok) return false;
      const j = await res.json();
      const ok = Boolean(j && j.success);
      if (ok) {
        setCachedVerified(true);
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      return ok;
    } catch (err) {
      console.error("admin verify error", err);
      setIsAdmin(false);
      return false;
    }
  }, [cachedVerified]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const j = await res.json();
      if (j && j.success) {
        setCachedVerified(true);
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("login error", err);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch (err) {
      // ignore network errors on logout
    }
    setCachedVerified(null);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, verifyWithBackend }}>
      {children}
    </AuthContext.Provider>
  );
};

// note: intentionally only named exports to keep Fast Refresh working
