import { UserRole } from '@/constants/roles';

export interface IUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface IAuthResponse {
  message: string;
  user: IUser;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IAuth {
  message: string;
  user: IUser;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IRefreshToken {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user: IUser;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IForgotPasswordResponse {
  status: boolean;
  message: string;
}

export interface IVerifyCodeResponse {
  status: boolean;
  message: string;
  valid: boolean;
}

export interface IResetPasswordResponse {
  status: boolean;
  message: string;
}
