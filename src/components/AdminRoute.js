import { useAuth } from "./authContext";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  return children;
};

export default AdminRoute;
