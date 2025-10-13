export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SELLER' | 'ROLE_SUPER_ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}