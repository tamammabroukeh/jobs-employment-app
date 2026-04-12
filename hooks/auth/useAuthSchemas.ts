import { useMemo } from "react"
import { createAuthSchemas } from "@/schemas/auth-factory"
import { useTypedTranslations } from "../use-translations"

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
  const tValidation = useTypedTranslations("errors.validation")
  const tAuth = useTypedTranslations("auth.validation")

  const schemas = useMemo(() => {
    return createAuthSchemas(tValidation, tAuth)
  }, [tValidation, tAuth])

  return {
    loginSchema: schemas.login,
    registerSchema: schemas.register,
    forgotPasswordSchema: schemas.forgotPassword,
    verifyCodeSchema: schemas.verifyCode,
    resetPasswordSchema: schemas.resetPassword,
  }
}
