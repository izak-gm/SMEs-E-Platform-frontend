import type { UserRole } from '../types/authTypes';
import { useAuth } from './useAuth';

export const useAuthorization = (allowedRoles: UserRole[]) => {
  const { user } = useAuth();
  return user && allowedRoles.includes(user.role);
};
