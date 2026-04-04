import { useTranslations } from "use-intl"
import { useMemo } from "react"
import { createAuthSchemas } from "@/schemas/auth-factory"

/**
 * Hook to get auth schemas with translations
 * Use this in your auth forms/components
 * 
 * @example
 * const { loginSchema, signupSchema } = useAuthSchemas()
 * const form = useForm({
 *   resolver: zodResolver(loginSchema)
 * })
 */
export function useAuthSchemas() {
  const t = useTranslations("errors.validation")
  const tAuth = useTranslations("auth.validation")

  const schemas = useMemo(() => {
    return createAuthSchemas(t, tAuth)
  }, [t, tAuth])

  return {
    loginSchema: schemas.login,
    registerSchema: schemas.register,
    forgotPasswordSchema: schemas.forgotPassword,
    verifyCodeSchema: schemas.verifyCode,
    resetPasswordSchema: schemas.resetPassword,
  }
}
