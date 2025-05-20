import React, { createContext, useContext, useState, useEffect } from "react";
import { getInfoUser } from '../api/user_api';
import { logoutUser } from '../api/auth_api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const hasLogin = localStorage.getItem("has_login");
  if (!hasLogin) {
    setUser(null);
    setLoading(false);
    return;
  }
  getInfoUser()
    .then(profile => setUser(profile))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));
}, []);

  const login = async () => {
    try {
      const profile = await getInfoUser();
      setUser(profile);
      localStorage.setItem("has_login", "1");
    } catch {
      setUser(null);
      localStorage.removeItem("has_login");
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      localStorage.removeItem("has_login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}