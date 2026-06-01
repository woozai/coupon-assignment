export type AuthRole = 'admin' | 'reseller';

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  email?: string;
  role: AuthRole;
  sub: string;
}

export interface AuthTokenResponse {
  token: string;
}
