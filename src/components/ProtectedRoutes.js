import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";
import Loading from "./Loading";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    // console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected content
  // console.log("✅ User authenticated, rendering protected content");
  return <Outlet />;
};

export default ProtectedRoutes;
