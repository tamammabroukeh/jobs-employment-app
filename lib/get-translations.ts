import { getTranslations as getNextIntlTranslations } from "next-intl/server"
import { AllTranslationKeys, MessageKeys, NamespaceKeys, NamespacePath } from "@/types/i18n-types"

/**
 * Server-side translation function with full autocomplete support
 * Use this in Server Components and Server Actions
 * 
 * @example
 * ```tsx
 * // In a Server Component - All keys
 * export default async function Page() {
 *   const t = await getTranslations();
 *   return <h1>{t('auth.signin.title')}</h1>;
 * }
 * 
 * // With namespace - Filtered keys
 * export default async function Page() {
 *   const t = await getTranslations('auth');
 *   return <h1>{t('signin.title')}</h1>;
 * }
 * 
 * // With nested namespace - Shortest keys
 * export default async function Page() {
 *   const t = await getTranslations('auth.signin');
 *   return <h1>{t('title')}</h1>;
 * }
 * ```
 */
export async function getTranslations(): Promise<(key: AllTranslationKeys, values?: Record<string, string | number>) => string>
export async function getTranslations<N extends MessageKeys>(namespace: N): Promise<(key: NamespaceKeys<N>, values?: Record<string, string | number>) => string>
export async function getTranslations<N extends NamespacePath>(namespace: N): Promise<(key: string, values?: Record<string, string | number>) => string>
export async function getTranslations(namespace?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await getNextIntlTranslations(namespace as any)
}

/**
 * Get translations for a specific namespace
 * More efficient when you only need translations from one namespace
 * 
 * @example
 * ```tsx
 * export default async function Page() {
 *   const t = await getNamespacedTranslations('auth.signin');
 *   return <h1>{t('title')}</h1>; // Translates 'auth.signin.title'
 * }
 * ```
 */
export async function getNamespacedTranslations<T extends NamespacePath>(namespace: T) {
  return await getNextIntlTranslations(namespace)
}

/**
 * Helper functions for specific namespaces
 * Use these for better type inference and cleaner code
 */
export async function getAuthTranslations() {
  return await getNextIntlTranslations("auth")
}

export async function getAuthSigninTranslations() {
  return await getNextIntlTranslations("auth.signin")
}

export async function getAuthSignupTranslations() {
  return await getNextIntlTranslations("auth.signup")
}

export async function getDashboardTranslations() {
  return await getNextIntlTranslations("dashboard")
}

export async function getErrorTranslations() {
  return await getNextIntlTranslations("errors")
}

export async function getSessionTranslations() {
  return await getNextIntlTranslations("session")
}
export async function getHomeTranslations() {
  return await getNextIntlTranslations("home")
}
export async function getFooterTranslations() {
  return await getNextIntlTranslations("footer")
}
