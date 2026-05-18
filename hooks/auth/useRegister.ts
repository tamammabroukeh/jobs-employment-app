import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "use-intl"
import { signIn } from "next-auth/react"
import { registerAction } from "@/apis/services/auth/actions"
import { UserRole } from "@/constants/roles"
import ROUTES from "@/constants/routes"
import { useAuthSchemas } from "./useAuthSchemas"

export function useRegister() {
  const router = useRouter()
  const t = useTranslations("auth.signup")
  const { registerSchema } = useAuthSchemas()

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.EMPLOYEE,
      isLoading: false
    },
  })

  const onSubmit = async (data: {
    username: string
    email: string
    password: string
    confirmPassword: string
    role: UserRole
  }) => {
    form.setValue("isLoading", true)
    try {
      // Register the user
      console.log("[Register] Starting registration for:", data.email);
      const result = await registerAction(data)

      if (result?.data?.success) {
        console.log("[Register] Registration successful!");
        console.log("[Register] User ID:", result.data.user?.id);
        
        toast.success(result.data.message || t("success"))
        toast.info("Redirecting to login page...")
        
        // Redirect to login page with email as query parameter
        setTimeout(() => {
          router.push(`${ROUTES.AUTH.LOGIN}?email=${encodeURIComponent(data.email)}`)
        }, 1500)
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
      console.error("[Register] Registration error:", error)
      toast.error("Connection error. Please check your internet and try again.")
    } finally {
      form.setValue("isLoading", false)
    }
  }

  const inputs = [
    {
      name: "username",
      label: t("username"),
      type: "text",
      placeholder: t("usernamePlaceholder"),
    },
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
    {
      name: "confirmPassword",
      label: t("confirmPassword"),
      type: "password",
      placeholder: t("confirmPasswordPlaceholder"),
    },
  ]

  const roleOptions = [
    { value: UserRole.EMPLOYEE, title: t("roles.employee") },
    { value: UserRole.COMPANY, title: t("roles.company") },
  ]

  const links = [
    {
      title: `${t("hasAccount")} ${t("signin")}`,
      path: ROUTES.AUTH.LOGIN,
    },
  ]

  return {
    form,
    isLoading: form.watch("isLoading"),
    onSubmit,
    inputs,
    roleOptions,
    links,
    t,
  }
}
