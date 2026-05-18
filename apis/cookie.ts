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

/*

{
  "message": "User successfully registered",
  "user": {
    "name": "Tammam",
    "email": "tammam@gmail.com",
    "roles": [
      "employee"
    ],
    "updated_at": "2026-05-18T18:08:51.052000Z",
    "created_at": "2026-05-18T18:08:51.052000Z",
    "id": "6a0b55b303cb8385ed09ede3"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2pvYm9mZmVycy1tYWluLXVqMmVoai5mcmVlLmxhcmF2ZWwuY2xvdWQvYXBpL2F1dGgvcmVnaXN0ZXIiLCJpYXQiOjE3NzkxMjc3MzEsImV4cCI6MTc3OTEzMTMzMSwibmJmIjoxNzc5MTI3NzMxLCJqdGkiOiJlZDdrelRDTTBEZ29IcjRKIiwic3ViIjoiNmEwYjU1YjMwM2NiODM4NWVkMDllZGUzIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.CVdrqDYWvWwuBPVR_qtC7OHkhaw-h8E8TnhDy0E4cUk",
  "token_type": "bearer",
  "expires_in": 3600
}



*/