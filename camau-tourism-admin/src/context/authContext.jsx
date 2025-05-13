import React, { createContext, useContext, useState, useEffect } from "react";
import { getInfoUser } from '../api/authAdmin';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInfoUser()
      .then(profile => setAdmin(profile))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const loginAdmin = async () => {
    try {
      const profile = await getInfoUser();
      setAdmin(profile);
    } catch {
      setAdmin(null);
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
  };

  const isAdmin = () => {
    return admin && (admin.role === "admin" || admin.is_staff || admin.is_superuser);
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