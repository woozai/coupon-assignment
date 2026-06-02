export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
}
