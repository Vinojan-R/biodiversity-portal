import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/home" replace />;
}

export default AdminRoute;