import React, { createContext, useContext, useState, useEffect } from "react";
import { getInfoUser } from '../api/authAdmin';

// 1. Tạo context
const AdminAuthContext = createContext();

// 2. Provider cho Admin
export function AdminAuthProvider({ children }) {
  // Lấy thông tin admin từ localStorage nếu có
  const [admin, setAdmin] = useState(() => {
    const adminData = localStorage.getItem("adminUser");
    return adminData ? JSON.parse(adminData) : null;
  });
  const [adminProfile, setAdminProfile] = useState(null);

  // 3. Đồng bộ thông tin với localStorage
  useEffect(() => {
    if (admin) localStorage.setItem("adminUser", JSON.stringify(admin));
    else localStorage.removeItem("adminUser");
  }, [admin]);

  // 4. Lấy profile của admin từ API khi đăng nhập
  useEffect(() => {
    async function fetchProfile() {
      if (!admin) {
        setAdminProfile(null);
        return;
      }
      try {
        const profile = await getInfoUser(admin.id);
        setAdminProfile(profile);
      } catch {
        setAdminProfile(null);
      }
    }
    fetchProfile();
  }, [admin]);

  // 5. Hàm login cho admin
  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("adminUser", JSON.stringify(adminData));

  };

  // 6. Hàm logout cho admin
  const logoutAdmin = () => {
    setAdmin(null);
    setAdminProfile(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // 7. Hàm kiểm tra quyền (ví dụ: quyền "admin")
  const isAdmin = () => {
    return admin && (admin.role === "admin" || admin.isAdmin);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminProfile,
        loginAdmin,
        logoutAdmin,
        isAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

// 8. Custom hook cho admin
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}