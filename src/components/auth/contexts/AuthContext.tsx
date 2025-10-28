import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { User, UserRole } from "../types/authTypes";
import api from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  registeruser: (email: string, password: string) => Promise<UserRole>; // Change to Promise<UserRole>
  login: (email: string, password: string) => Promise<UserRole>; // Change to Promise<UserRole>
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

const [initializing, setInitializing] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("jwt");
  if (token) {
    validateToken(token).finally(() => setInitializing(false));
  } else {
    setInitializing(false);
  }
}, []);

  const validateToken = async (token: string) => {
    try {
      const decoded = jwtDecode<{
        id: number;
        email: string;
        roles: UserRole[];
        exp: number;
      }>(token);

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        throw new Error("Token Expired");
      }
      if (!decoded.roles?.[0]) {
        throw new Error("User has no role assigned");
      }

      setUser({
        email: decoded.email,
        role: decoded.roles[0],
        id: decoded.id,
      });
    } catch (err) {
      console.error("Invalid or Expired Token: ", err);
      localStorage.removeItem("jwt");
      setUser(null);
    }
  };

  const isValidTokenFormat = (token: string): boolean => {
    try {
      const parts = token.split(".");
      return parts.length === 3;
    } catch {
      return false;
    }
  };

  const registeruser = async (email: string, password: string): Promise<UserRole> => {
    setIsLoading(true);
    setError(null);

    try {
      localStorage.removeItem("jwt");

      // Use generic login endpoint - backend will determine role
      const response = await api.post(`auth/register`, {
        email,
        password,
      });

      const token: string =
        response.data.token?.accessToken ||
        response.data.accessToken ||
        response.data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      if (!isValidTokenFormat(token)) {
        throw new Error("Invalid token format received from server");
      }

      localStorage.setItem("jwt", token);

      const decoded = jwtDecode<{
        roles: UserRole[];
        email: string;
        id: number;
        exp: number;
      }>(token);

      if (!decoded.roles?.[0]) {
        throw new Error("User has no role assigned");
      }

      const userRole = decoded.roles[0];

      setUser({
        email: decoded.email,
        role: userRole,
        id: decoded.id,
      });

      toast({
        title: "Success",
        description: `Register in as ${userRole} successfully!`,
        variant: "success",
      });

      // Return the role for redirect logic
      return userRole;
    } catch (err: any) {
      console.error("Login error:", err);

      let errorMessage = "Login failed. Please check your credentials.";

      if (err.response?.status === 403) {
        errorMessage =
          "Access forbidden. Please check your credentials or contact administrator.";
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        variant: "error",
        description: errorMessage,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<UserRole> => {
    setIsLoading(true);
    setError(null);

    try {
      localStorage.removeItem("jwt");

      // Use generic login endpoint - backend will determine role
      const response = await api.post(`auth/login`, {
        email,
        password,
      });

      const token: string =
        response.data.token?.accessToken ||
        response.data.accessToken ||
        response.data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      if (!isValidTokenFormat(token)) {
        throw new Error("Invalid token format received from server");
      }

      localStorage.setItem("jwt", token);

      const decoded = jwtDecode<{
        roles: UserRole[];
        email: string;
        id: number;
        exp: number;
      }>(token);

      if (!decoded.roles?.[0]) {
        throw new Error("User has no role assigned");
      }

      const userRole = decoded.roles[0];

      setUser({
        email: decoded.email,
        role: userRole,
        id: decoded.id,
      });

      toast({
        title: "Success",
        description: `Logged in as ${userRole} successfully!`,
        variant: "success",
      });

      // Return the role for redirect logic
      return userRole;
    } catch (err: any) {
      console.error("Login error:", err);

      let errorMessage = "Login failed. Please check your credentials.";

      if (err.response?.status === 403) {
        errorMessage =
          "Access forbidden. Please check your credentials or contact administrator.";
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        variant: "error",
        description: errorMessage,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("jwt");
    toast({
      title: "Success",
      description: "Logged out successfully!",
      variant: "success",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, registeruser, login, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
