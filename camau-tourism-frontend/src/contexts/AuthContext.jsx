import React, { createContext, useContext, useState, useEffect } from "react";
import { getInfoUser } from '../api/user_api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      getInfoUser()
        .then(profile => setUser(profile))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (loginData) => {
    await getInfoUser()
      .then(profile => setUser(profile))
      .catch(() => setUser(null));
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
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