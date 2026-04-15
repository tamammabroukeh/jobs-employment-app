import apiFetcher from '@/api/api.instance';
import { Methods } from '@/constants/methods';
import { LoginFormData, RegisterFormData, ForgotPasswordFormData, VerifyCodeFormData, ResetPasswordFormData } from '@/schemas/auth';
import { IAuth, IForgotPasswordResponse, IVerifyCodeResponse, IResetPasswordResponse, IUser } from './interface';

// API endpoints factory
export const authRepository = {
  signIn: (credentials: LoginFormData): Promise<IAuth> =>
    apiFetcher<IAuth>(`/auth/login`, {
      method: Methods.POST,
      body: JSON.stringify(credentials),
    }),

  signUp: (credentials: RegisterFormData): Promise<IAuth> =>
    apiFetcher<IAuth>(`/auth/register`, {
      method: Methods.POST,
      body: JSON.stringify({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
      }),
    }),

  forgotPassword: (data: ForgotPasswordFormData): Promise<IForgotPasswordResponse> =>
    apiFetcher<IForgotPasswordResponse>(`/auth/forgot-password`, {
      method: Methods.POST,
      body: JSON.stringify(data),
    }),

  verifyCode: (data: VerifyCodeFormData): Promise<IVerifyCodeResponse> =>
    apiFetcher<IVerifyCodeResponse>(`/auth/verify-code`, {
      method: Methods.POST,
      body: JSON.stringify(data),
    }),

  resetPassword: (data: ResetPasswordFormData): Promise<IResetPasswordResponse> =>
    apiFetcher<IResetPasswordResponse>(`/auth/reset-password`, {
      method: Methods.POST,
      body: JSON.stringify({
        email: data.email,
        code: data.code,
        password: data.password,
      }),
    }),

  getProfile: (): Promise<IUser> =>
    apiFetcher<IUser>(`/auth/profile`, {
      method: Methods.GET,
    }),
};
