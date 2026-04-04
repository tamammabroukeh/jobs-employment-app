import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "use-intl"
import { signInAction } from "@/api/services/auth/actions"
import ROUTES from "@/constants/routes"
import { useAuthSchemas } from "./useAuthSchemas"

export function useLogin() {
  const router = useRouter()
  const t = useTranslations("auth.signin")
  const { loginSchema } = useAuthSchemas()

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: { email: string; password: string }) => {
    form.setValue("isLoading", true)
    try {
      const result = await signInAction(data)

      if (result?.data?.success) {
        toast.success(t("success"))
        router.push("/dashboard")
        router.refresh()
      } else if (result?.serverError) {
        toast.error(result.serverError)
      }
    } catch {
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
    isLoading:form.watch("isLoading"),
    onSubmit,
    inputs,
    links,
    t,
  }
}
