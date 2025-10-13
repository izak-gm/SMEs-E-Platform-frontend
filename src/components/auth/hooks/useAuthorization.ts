import type { UserRole } from "../types/authTypes";
import { useAuth } from "@/components/auth/contexts/AuthContext";

export const useAuthorization = (allowedRoles: UserRole[]) => {
  const { user } = useAuth();
  return !!(user && user.role && allowedRoles.includes(user.role));
};
