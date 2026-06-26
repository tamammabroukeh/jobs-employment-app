export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {}

export interface Token {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  user: User;
  error?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "owner" | "employer" | "employee";
}

export interface AuthSession {
  user: SessionUser;
  accessToken: string;
  expires: string;
  error?: string;
}