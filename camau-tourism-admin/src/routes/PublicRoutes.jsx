import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const isAuth = localStorage.getItem('accessToken');
    return !isAuth ? <Outlet /> : <Navigate to="/dashboard" replace />;
  };

export default PublicRoute;
