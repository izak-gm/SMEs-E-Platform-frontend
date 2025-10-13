export type UserRole = 'admin' | 'user' | 'seller' | 'super_admin';

export type User = {
  id: number;
  email: string;
  role: UserRole | undefined;
  enabled?: boolean;
};
