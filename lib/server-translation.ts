import { AllTranslationKeys } from "@/types/i18n-types"
import { getTranslations } from "next-intl/server"

export async function getTypedTranslations() {
  const t = await getTranslations()

  return (key: AllTranslationKeys, values?: Record<string, any>) => {
    return t(key, values)
  }
}

// Helper functions for specific namespaces on server
export async function getAuthTranslations() {
  return await getTranslations("auth")
}

export async function getDashboardTranslations() {
  return await getTranslations("dashboard")
}

export async function getErrorTranslations() {
  return await getTranslations("errors")
}

export async function getSessionTranslations() {
  return await getTranslations("session")
}

export async function serverT(key: AllTranslationKeys, values?: Record<string, any>) {
  const t = await getTranslations()
  return t(key, values)
}