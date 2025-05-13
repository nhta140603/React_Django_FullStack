import React, { createContext, useContext, useState, useEffect } from "react";
import { getInfoUser } from '../api/authAdmin';

const AdminAuthContext = createContext();
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      fetchProfile()
        .then(profile => setAdmin(profile))
        .catch(() => setAdmin(null))
        .finaly(() => setLoading(false))
    }
  }, []);

  const loginAdmin = async (adminData) => {
    await getInfoUser()
      .then(profile => setAdmin(profile))
      .catch(() => setAdmin(null))
  };

  const logoutAdmin = () => {
    setAdmin(null);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  };

  const isAdmin = () => {
    return admin && (admin.role === "admin" || admin.isAdmin);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin, isAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}