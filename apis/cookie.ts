"use server";
import { cookies } from "next/headers";
const IN_HOURS = 1;
const EXPIRES_IN_HOURS = 1000 * 60 * 24 * IN_HOURS;
const expires = Date.now() + +EXPIRES_IN_HOURS;

export const setCookie = async (
  key: string,
  value: string | Promise<string>,
) => {
  (await cookies()).set({
    name: key,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    value: value as string,
    expires: expires,
    priority: "medium",
  });
};
export const getCookie = async (name: string) => {
  return (await cookies()).get(name)?.value;
};
export const hasCookie = async (name: string) => {
  return (await cookies()).has(name)
};
export const deleteCookie = async (name: string) => {
  return (await cookies()).delete(name)
};
