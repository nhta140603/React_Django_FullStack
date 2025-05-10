import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () =>{
    const isAuth = !!localStorage.getItem('accessToken')
    return isAuth ? <Outlet/> :<Navigate to ="/loginAdmin" replace/>
}

export default ProtectedRoute