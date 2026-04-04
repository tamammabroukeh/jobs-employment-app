import { z } from "zod"
import { UserRole } from "@/constants/roles"
import { createValidations } from "./validation-factory"

/**
 * Factory function to create auth schemas with translations
 * Use this in your components/hooks where you have access to useTranslations
 * 
 * @example
 * const t = useTranslations('errors.validation')
 * const tAuth = useTranslations('auth.validation')
 * const schemas = createAuthSchemas(t, tAuth)
 * const { data, errors } = await schemas.login.safeParseAsync(formData)
 */
export function createAuthSchemas(
  t: (key: string, values?: Record<string, string | number>) => string,
  tAuth: (key: string, values?: Record<string, string | number>) => string
) {
  const v = createValidations(t)

  return {
    login: z.object({
      email: v.requiredEmail({
        invalidError: tAuth("emailInvalid"),
      }),
      password: v.requiredString({
        minLength: 6,
        minLengthError: tAuth("passwordMinLength"),
      }),
      isLoading: v.requiredBoolean()
    }),

    register: z
      .object({
        username: v.requiredString({
          minLength: 3,
          minLengthError: tAuth("usernameRequired"),
        }),
        email: v.requiredEmail({
          invalidError: tAuth("emailInvalid"),
        }),
        password: v.requiredString({
          minLength: 6,
          minLengthError: tAuth("passwordMinLength"),
        }),
        confirmPassword: v.requiredString({
          error: tAuth("passwordRequired"),
        }),
        role: z.nativeEnum(UserRole),
        isLoading: v.requiredBoolean()
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: tAuth("passwordsNoMatch"),
        path: ["confirmPassword"],
      }),

    forgotPassword: z.object({
      email: v.requiredEmail({
        invalidError: tAuth("emailInvalid"),
      }),
    }),

    verifyCode: z.object({
      email: v.requiredEmail({
        invalidError: tAuth("emailInvalid"),
      }),
      code: v.requiredString({
        minLength: 6,
        maxLength: 6,
        minLengthError: tAuth("codeLength"),
        maxLengthError: tAuth("codeLength"),
        error: tAuth("codeRequired"),
      }),
    }),

    resetPassword: z
      .object({
        email: v.requiredEmail({
          invalidError: tAuth("emailInvalid"),
        }),
        code: v.requiredString({
          minLength: 6,
          maxLength: 6,
          minLengthError: tAuth("codeLength"),
          maxLengthError: tAuth("codeLength"),
          error: tAuth("codeRequired"),
        }),
        password: v.requiredString({
          minLength: 6,
          minLengthError: tAuth("passwordMinLength"),
        }),
        confirmPassword: v.requiredString({
          error: tAuth("passwordRequired"),
        }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: tAuth("passwordsNoMatch"),
        path: ["confirmPassword"],
      }),
  }
}

// Type exports
export type LoginFormData = z.infer<ReturnType<typeof createAuthSchemas>["login"]>
export type RegisterFormData = z.infer<ReturnType<typeof createAuthSchemas>["register"]>
export type ForgotPasswordFormData = z.infer<ReturnType<typeof createAuthSchemas>["forgotPassword"]>
export type VerifyCodeFormData = z.infer<ReturnType<typeof createAuthSchemas>["verifyCode"]>
export type ResetPasswordFormData = z.infer<ReturnType<typeof createAuthSchemas>["resetPassword"]>
