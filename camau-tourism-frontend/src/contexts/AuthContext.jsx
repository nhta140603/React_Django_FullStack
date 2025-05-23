import React, { createContext, useContext, useState, useEffect } from "react";
import { getInfoUser } from '../api/user_api';
import { logoutUser } from '../api/auth_api';

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInfoUser()
      .then(profile => setUser(profile))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async () => {
    try {
      const profile = await getInfoUser();
      setUser(profile);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'logout') {
        setUser(null);
      }
    }
    window.addEventListener('storage', fn);
    return () => window.removeEventListener('storage', fn);
  }, []);

  const broadcastLogout = () => {
    localStorage.setItem('logout', Date.now());
  }

  return (
    <AuthContext.Provider value={{ user, login, logout: () => { logout(); broadcastLogout(); }, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}