export type UserRole = 'admin' | 'user';

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  isGoogleLinked: boolean;
  isBanned: boolean;
  createdAt: string;
}
