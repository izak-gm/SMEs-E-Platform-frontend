import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "@/components/auth/types/authTypes";
import { useAuth } from "../auth/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const token = localStorage.getItem("jwt");
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const updateUserFromToken = useCallback(() => {
    if (!token) return null;

    try {
      const decoded = jwtDecode<{
        email: string;
        id: number;
        roles?: UserRole[];
      }>(token);

      if (!decoded.roles?.[0]) {
        throw new Error("User has no role assigned");
      }

      return {
        email: decoded.email,
        role: decoded.roles[0],
        id: decoded.id,
      };
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("jwt");
      return null;
    }
  }, [token]);

  useEffect(() => {
    // Restore user from token on first load
    if (token && !user) {
      const userData = updateUserFromToken();
      if (userData) setUser(userData);
    }
    setIsLoading(false);
  }, [token, user, setUser, updateUserFromToken]);

  // Wait for auth state restoration before deciding
  if (isLoading) {
    return <div>Loading...</div>; // You can use a spinner or skeleton here
  }

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  const hasRequiredRole = allowedRoles.includes(user.role);
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
