import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  nome: string;
  role: "COMMON_USER" | "ORGANIZER" | "ADMIN";
  id?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_DURATION_MS = 3 * 60 * 60 * 1000; // 3 horas

function loadFromStorage(): { token: string | null; user: User | null } {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const loginAt = localStorage.getItem("loginAt");

  if (!storedToken || !storedUser || !loginAt)
    return { token: null, user: null };

  const elapsed = Date.now() - Number(loginAt);
  if (elapsed > SESSION_DURATION_MS) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginAt");
    return { token: null, user: null };
  }

  return { token: storedToken, user: JSON.parse(storedUser) };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = loadFromStorage();
  const [user, setUser] = useState<User | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("userEmail", newUser.email);
    localStorage.setItem("loginAt", String(Date.now()));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginAt");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
