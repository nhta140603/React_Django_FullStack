import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white/80">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-3 text-base text-gray-700 font-medium">Đang tải...</p>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default PublicRoute;