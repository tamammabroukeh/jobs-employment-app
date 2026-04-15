import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "use-intl"
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
      const result = await registerAction(data)

      if (result?.data?.success) {
        toast.success(t("success"))
        router.push(ROUTES.AUTH.LOGIN)
      } else if (result?.serverError) {
        toast.error(result.serverError)
      }
    } catch {
      toast.error("An error occurred. Please try again.")
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
    isLoading:form.watch("isLoading"),
    onSubmit,
    inputs,
    roleOptions,
    links,
    t,
  }
}
