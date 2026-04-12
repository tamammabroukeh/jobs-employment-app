import { AllTranslationKeys } from "@/types/i18n-types"
import { getTranslations } from "next-intl/server"

/**
 * Server-side typed translation function with full autocomplete support
 * 
 * @example
 * ```tsx
 * // All keys
 * const t = await getTypedTranslations();
 * t('auth.signin.title')
 * 
 * // With namespace (use getTranslations from @/lib/get-translations for better autocomplete)
 * const t = await getTypedTranslations('auth');
 * t('signin.title')
 * ```
 */
export async function getTypedTranslations(): Promise<(key: AllTranslationKeys, values?: Record<string, string | number>) => string>
export async function getTypedTranslations<N extends string>(namespace: N): Promise<(key: string, values?: Record<string, string | number>) => string>
export async function getTypedTranslations(namespace?: string): Promise<(key: string, values?: Record<string, string | number>) => string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any)

  return (key: string, values?: Record<string, string | number>) => {
    return t(key, values)
  }
}

/**
 * Quick server translation function
 * Use for one-off translations without storing the function
 * 
 * @example
 * ```tsx
 * const title = await serverT('auth.signin.title');
 * ```
 */
export async function serverT(key: AllTranslationKeys, values?: Record<string, string | number>) {
  const t = await getTranslations()
  return t(key, values)
}