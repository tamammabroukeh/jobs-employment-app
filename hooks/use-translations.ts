
import { AllTranslationKeys } from "@/types/i18n-types"
import { useLocale, useTranslations } from "use-intl"

export function useTypedTranslations() {
  const t = useTranslations()

  return (key: AllTranslationKeys, values?: Record<string, any>) => {
    return t(key, values)
  }
}

export { useLocale }

// Helper hooks for specific namespaces
export function useAuthTranslations() {
  return useTranslations("auth")
}

export function useDashboardTranslations() {
  return useTranslations("dashboard")
}

export function useErrorTranslations() {
  return useTranslations("errors")
}

export function useSessionTranslations() {
  return useTranslations("session")
}
