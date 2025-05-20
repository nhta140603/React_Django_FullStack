import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ProfileMain from "../../components/Users/ProfileMain";
import { getInfoUser, updateInfoUser } from "../../api/user_api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function UserProfile() {
  const queryClient = useQueryClient();
  const { data: userData, isLoading: loading, error } = useQuery({
    queryKey: ["userData"],
    queryFn: getInfoUser,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const updateMutation = useMutation({
    mutationFn: updateInfoUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      toast.success("Cập nhật thành công!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSaveInfo = (data) => {
    updateMutation.mutate(data);
  };

  if (loading) return <MainLayout></MainLayout>;
  if (error)
    return (
      <MainLayout>
        <div className="text-center py-20 text-red-500">{error}</div>
      </MainLayout>
    );
  if (!userData) return null;

  return (
    <main className="flex-1 p-4 bg-[#f5f7fb]">
      <ProfileMain
        userData={userData}
        onSaveInfo={handleSaveInfo}
        isSaving={updateMutation.isLoading}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
}