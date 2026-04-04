import { z } from 'zod';
import { UserRole } from '@/constants/roles';
import {
  requiredEmailValidation,
  requiredStringValidation,
} from './validations';

export const loginSchema = z.object({
  email: requiredEmailValidation(),
  password: requiredStringValidation({
    minLength: 6,
    minLengthError: 'Password must be at least 6 characters',
  }),
});

export const registerSchema = z
  .object({
    username: requiredStringValidation({
      minLength: 3,
      minLengthError: 'Username must be at least 3 characters',
    }),
    email: requiredEmailValidation(),
    password: requiredStringValidation({
      minLength: 6,
      minLengthError: 'Password must be at least 6 characters',
    }),
    confirmPassword: requiredStringValidation(),
    role: z.nativeEnum(UserRole).default(UserRole.EMPLOYEE),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: requiredEmailValidation(),
});

export const verifyCodeSchema = z.object({
  email: requiredEmailValidation(),
  code: requiredStringValidation({
    minLength: 6,
    maxLength: 6,
    minLengthError: 'Code must be 6 digits',
    maxLengthError: 'Code must be 6 digits',
  }),
});

export const resetPasswordSchema = z
  .object({
    email: requiredEmailValidation(),
    code: requiredStringValidation({
      minLength: 6,
      maxLength: 6,
      minLengthError: 'Code must be 6 digits',
      maxLengthError: 'Code must be 6 digits',
    }),
    password: requiredStringValidation({
      minLength: 6,
      minLengthError: 'Password must be at least 6 characters',
    }),
    confirmPassword: requiredStringValidation(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
