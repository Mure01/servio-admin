"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  _id?: string;
  email?: string;
  name?: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const TOKEN_KEY = "servio_admin_token";
const USER_KEY = "servio_admin_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // init from localStorage
    const savedToken = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    const savedUser = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser?: AuthUser) => {
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const refresh = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/auth/verify", {
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        logout();
        return;
      }
      if (json?.data?.user) {
        setUser(json.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(json.data.user));
      }
    } catch {
      // do nothing (offline)
    }
  };

  const value = useMemo(
    () => ({ token, user, isLoading, login, logout, refresh }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
