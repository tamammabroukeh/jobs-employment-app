export type TNameSignFormControl =
  | "userName"
  | "userEmail"
  | "password"
  | "newPassword"
  | "resetCode"
  | "title.en"
  | "title.ar";

export type TAuthData = {
  userName: string;
  userEmail: string;
  password: string;
}