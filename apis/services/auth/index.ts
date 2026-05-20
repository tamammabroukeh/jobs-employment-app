import apiFetcher from '@/apis/api.instance';
import { authFetcher } from '@/apis/authInstace';
import { Methods } from '@/constants/methods';
import { IAuth, IRegisterRequest, ILoginRequest, IForgotPasswordResponse, IVerifyCodeResponse, IResetPasswordResponse, IUser } from './interface';

// API endpoints factory
export const authRepository = {
  signIn: (credentials: ILoginRequest): Promise<IAuth> =>
    apiFetcher<IAuth>(`/auth/login`, {
      method: Methods.POST,
      body: JSON.stringify(credentials),
    }),

  signUp: (data: IRegisterRequest): Promise<IAuth> =>
    apiFetcher<IAuth>(`/auth/register`, {
      method: Methods.POST,
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: { email: string }): Promise<IForgotPasswordResponse> =>
    apiFetcher<IForgotPasswordResponse>(`/auth/forgot-password`, {
      method: Methods.POST,
      body: JSON.stringify(data),
    }),

  verifyCode: (data: { email: string; code: string }): Promise<IVerifyCodeResponse> =>
    apiFetcher<IVerifyCodeResponse>(`/auth/verify-code`, {
      method: Methods.POST,
      body: JSON.stringify(data),
    }),

  resetPassword: (data: { email: string; code: string; password: string }): Promise<IResetPasswordResponse> =>
    apiFetcher<IResetPasswordResponse>(`/auth/reset-password`, {
      method: Methods.POST,
      body: JSON.stringify(data),
    }),

  getProfile: (): Promise<IUser> =>
    authFetcher<IUser>(`/auth/profile`, {
      method: Methods.GET,
    }),

  logout: (): Promise<{ message: string }> =>
    authFetcher<{ message: string }>(`/auth/logout`, {
      method: Methods.POST,
    }),
};
