import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "use-intl"
import { useEffect } from "react"
import { signInAction } from "@/apis/services/auth/actions"
import ROUTES from "@/constants/routes"
import { useAuthSchemas } from "./useAuthSchemas"

export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("auth.signin")
  
  const { loginSchema } = useAuthSchemas()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      isLoading: false
    },
  })

  // Pre-fill email from query parameter (e.g., after registration)
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      form.setValue('email', emailParam)
      toast.info("Please enter your password to login")
    }
  }, [searchParams, form])

  const onSubmit = async (data: { email: string; password: string }) => {
    form.setValue("isLoading", true)
    try {
      const result = await signInAction(data)

      if (result?.data?.success) {
        toast.success(t("success"))
        // Redirect to home page after successful login
        router.push(ROUTES.HOME)
        router.refresh()
      } else if (result?.serverError) {
        toast.error(result.serverError)
      } else if (result?.validationErrors) {
        // Handle validation errors
        const firstError = Object.values(result.validationErrors).find(
          (errors) => Array.isArray(errors) && errors.length > 0
        );
        if (firstError && Array.isArray(firstError)) {
          toast.error(firstError[0])
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(t("unexpectedError"))
    } finally {
      form.setValue("isLoading", false)
    }
  }

  const inputs = [
    {
      name: "email",
      label: t("email"),
      type: "email",
      placeholder: t("emailPlaceholder"),
    },
    {
      name: "password",
      label: t("password"),
      type: "password",
      placeholder: t("passwordPlaceholder"),
    },
  ]

  const links = [
    {
      title: `${t("noAccount")} ${t("signup")}`,
      path: ROUTES.AUTH.REGISTER,
    },
    {
      title: t("forgotPassword"),
      path: ROUTES.AUTH.FORGOT_PASSWORD,
    },
  ]

  return {
    form,
    isLoading: form.watch("isLoading"),
    onSubmit,
    inputs,
    links,
    t,
  }
}
