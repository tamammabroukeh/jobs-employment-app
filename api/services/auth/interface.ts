import { UserRole } from '@/constants/roles';

export interface IUser {
  id: string | number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: UserRole;
  phone_number?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IAuth {
  status?: boolean;
  message?: string;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  data?: IUser;
}

export interface IRefreshToken {
  status?: boolean;
  message?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  data?: IUser;
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
