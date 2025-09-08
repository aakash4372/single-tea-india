// src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Replace with a proper loading spinner if needed
  }

  if (!user) {
    // Redirect to login, preserving the attempted URL in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Redirect non-admin users to home or login
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;