import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import { getInfoUser } from "../api/authAdmin";

const PublicRoute = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['adminInfo'],
    queryFn: getInfoUser,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000, 
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white/80">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-3 text-base text-gray-700 font-medium">Đang tải...</p>
      </div>
    );
  }

  if (!isError && data) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default PublicRoute;