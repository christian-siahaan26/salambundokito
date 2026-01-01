import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/ui/Loading";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoutes = {
      OWNER: "/owner/dashboard",
      ADMIN: "/admin/dashboard",
      DRIVER: "/driver/dashboard",
      CUSTOMER: "/customer/dashboard",
    };

    const redirectPath = dashboardRoutes[user?.role] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
