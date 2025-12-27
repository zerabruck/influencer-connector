// Shared Constants, Enums, and Interfaces

export enum UserRole {
  INFLUENCER = 'INFLUENCER',
  BRAND = 'BRAND',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface AuthenticatedUser extends User {}

export interface AuthResponse {
  user: User;
  access_token: string;
}
