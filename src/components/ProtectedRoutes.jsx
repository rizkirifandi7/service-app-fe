import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = Cookies.get("auth_session");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;