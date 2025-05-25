import React, { useState } from "react";
import ProfileSidebar from "../components/Users/ProfileSidebar";
import MainLayout from "./MainLayout";
import { Outlet } from "react-router-dom";
import { getInfoUser } from "../api/user_api";
import { useQuery } from "@tanstack/react-query";
export default function UserProfile() {
  const { data: userData, isLoading: loading, error } = useQuery({
    queryKey: ["userData"],
    queryFn: getInfoUser,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
  const [selectedTab, setSelectedTab] = useState("trang-ca-nhan");

  if (loading) return <MainLayout></MainLayout>;
  if (error)
    return (
      <MainLayout>
        <div className="text-center py-20 text-red-500">{error}</div>
      </MainLayout>
    );
  if (!userData) return null;

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <ProfileSidebar
          selected={selectedTab}
          onSelect={setSelectedTab}
          avatar={userData.avatar}
          name={userData.name}
        />
        <Outlet />
      </div>
    </MainLayout>
  );
}