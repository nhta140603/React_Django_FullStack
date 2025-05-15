import React, { createContext, useContext, useState, useEffect } from "react";
import { getInfoUser } from '../api/user_api';
import {logoutUser} from '../api/auth_api'

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getInfoUser()
      .then(profile => setUser(profile))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (loginData) => {
    await getInfoUser()
      .then(profile => setUser(profile))
      .catch(() => setUser(null));
  };

const logout = async () => {
  try {
    await logoutUser();
    setUser(null);
  } catch (err) {
    alert(err.message);
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