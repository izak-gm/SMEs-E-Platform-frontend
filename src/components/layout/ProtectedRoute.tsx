import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/components/auth/hooks/useAuth";
import { UserRole } from "@/components/auth/types/authTypes";

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
        enabled?: boolean;
      }>(token);

      return {
        email: decoded.email,
        role: decoded.roles?.[0],
        id: decoded.id,
        enabled: decoded.enabled ?? true,
      };
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("jwt");
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      const userData = updateUserFromToken();
      if (userData) {
        setUser(userData);
      }
    }
    setIsLoading(false);
  }, [token, user, setUser, updateUserFromToken]);

  useEffect(() => {
    if (!user || !token) return;

    const userData = updateUserFromToken();
    if (!userData) return;

    if (
      userData.email !== user.email ||
      userData.role !== user.role ||
      userData.id !== user.id ||
      userData.enabled !== user.enabled
    ) {
      setUser(userData);
    }
  }, [location.pathname, user, token, setUser, updateUserFromToken]);

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!user.enabled) {
    return <Navigate to="/unauthorized" replace />;
  }

  const hasRequiredRole = allowedRoles.some((role) => user.role === role);
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
