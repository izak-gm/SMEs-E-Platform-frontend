export type UserRole = 'admin' | 'lender' | 'agent' | 'super_admin';

export type User = {
  id: number;
  email: string;
  role: UserRole;
  status?: string;
};
