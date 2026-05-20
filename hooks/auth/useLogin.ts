import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "use-intl"
import { useEffect } from "react"
import { signIn } from "next-auth/react"
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
      console.log("[Login] ========== LOGIN ATTEMPT ==========");
      console.log("[Login] Email:", data.email);
      console.log("[Login] Password length:", data.password?.length);
      console.log("[Login] Calling signInAction...");
      
      const result = await signInAction(data)

      console.log("[Login] ========== SIGN IN ACTION RESULT ==========");
      console.log("[Login] Result:", JSON.stringify(result, null, 2));
      console.log("[Login] Has data?", !!result?.data);
      console.log("[Login] Has serverError?", !!result?.serverError);
      console.log("[Login] Has validationErrors?", !!result?.validationErrors);

      if (result?.data?.success) {
        console.log("[Login] Login API successful!");
        console.log("[Login] Creating NextAuth session...");
        
        // Create NextAuth session using signIn
        const signInResult = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        console.log("[Login] NextAuth signIn result:", signInResult);

        if (signInResult?.ok) {
          console.log("[Login] Session created successfully!");
          toast.success(t("success"))
          // Redirect to home page after successful login
          router.push(ROUTES.HOME)
          router.refresh()
        } else {
          console.error("[Login] Failed to create session:", signInResult?.error);
          toast.error("Failed to create session. Please try again.")
        }
      } else if (result?.serverError) {
        console.error("[Login] Server error:", result.serverError);
        toast.error(result.serverError)
      } else if (result?.validationErrors) {
        console.error("[Login] Validation errors:", result.validationErrors);
        // Handle validation errors
        const firstError = Object.values(result.validationErrors).find(
          (errors) => Array.isArray(errors) && errors.length > 0
        );
        if (firstError && Array.isArray(firstError)) {
          toast.error(firstError[0])
        }
      } else {
        console.error("[Login] Unknown error - no success, serverError, or validationErrors");
        console.error("[Login] Full result:", result);
      }
    } catch (error) {
      console.error("[Login] ========== EXCEPTION ==========");
      console.error("[Login] Error:", error);
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
