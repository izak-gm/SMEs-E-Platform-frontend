import React, { useEffect, useState } from "react";
import { AuthContext } from "./authContextData";
import api from "@/utils/axios";
import { jwtDecode } from "jwt-decode";
import { User, UserRole } from "../types/authTypes";
import { toast } from "sonner";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) validateToken(token);
  }, []);

  const validateToken = async (token: string) => {
    try {
const decoded = jwtDecode<{
  roles?: UserRole[];
  email: string;
  id: number;
  exp: number;
}>(token);
const role = decoded.roles?.[0];
if (!role) throw new Error("Invalid token: missing role");
setUser({ email: decoded.email, role, id: decoded.id });

    } catch (err) {
      console.error("Invalid or expired token:", err);
      localStorage.removeItem("jwt");
      setUser(null);
    }
  };

const login = async (email: string, password: string, role: UserRole) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await api.post(`/auth/${role}/login`, { email, password });

    const token: string =
      response.data.token?.accessToken || response.data.accessToken;

    localStorage.setItem("jwt", token);

    const decoded = jwtDecode<{
      roles?: UserRole[];
      email: string;
      id: number;
      exp: number;
    }>(token);

    const userRole = decoded.roles?.[0]; // ✅ renamed to avoid shadowing
    if (!userRole) throw new Error("Invalid token: missing role");

    setUser({ email: decoded.email, role: userRole, id: decoded.id });

    toast.success("Logged in successfully!");
  } catch (err) {
    console.error("Login error:", err);
    setError("Invalid email or password");
    toast.error("Login failed. Please check your credentials.");
    throw err;
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jwt");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
