export type TLoginResponse = {
  accessToken: string;
  userData:{
    enrolledCourses:string[];
    userName: string;
    userEmail: string;
    role: string;
    gender: string;
    age:number;
    profileImage:string;
  }
} | null;
export type TAuthContext = {
  auth: TLoginResponse;
  setAuth: React.Dispatch<React.SetStateAction<TLoginResponse>>;
};



export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

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
  role: string;
  accessToken: string;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
  error?: string;
}