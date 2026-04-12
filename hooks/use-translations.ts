import { AllTranslationKeys, MessageKeys, NamespaceKeys, NamespacePath } from "@/types/i18n-types"
import { useLocale, useTranslations as useNextIntlTranslations } from "use-intl"

/**
 * Client-side translation hook with full autocomplete support
 * Use this in Client Components
 * 
 * @example
 * ```tsx
 * // In a Client Component - All keys
 * export default function Component() {
 *   const t = useTypedTranslations();
 *   return <h1>{t('auth.signin.title')}</h1>;
 * }
 * 
 * // With namespace - Filtered keys
 * export default function Component() {
 *   const t = useTypedTranslations('auth');
 *   return <h1>{t('signin.title')}</h1>;
 * }
 * 
 * // With nested namespace - Shortest keys
 * export default function Component() {
 *   const t = useTypedTranslations('auth.signin');
 *   return <h1>{t('title')}</h1>;
 * }
 * ```
 */
export function useTypedTranslations(): (key: AllTranslationKeys, values?: Record<string, string | number>) => string
export function useTypedTranslations<N extends MessageKeys>(namespace: N): (key: NamespaceKeys<N>, values?: Record<string, string | number>) => string
export function useTypedTranslations<N extends NamespacePath>(namespace: N): (key: string, values?: Record<string, string | number>) => string
export function useTypedTranslations(namespace?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useNextIntlTranslations(namespace as any)
}

export { useLocale }

// Helper hooks for specific namespaces with proper typing
export function useAuthTranslations() {
  return useNextIntlTranslations("auth")
}

export function useDashboardTranslations() {
  return useNextIntlTranslations("dashboard")
}

export function useErrorTranslations() {
  return useNextIntlTranslations("errors")
}

export function useSessionTranslations() {
  return useNextIntlTranslations("session")
}

export function useHomeTranslations() {
  return useNextIntlTranslations("home")
}

export function useFooterTranslations() {
  return useNextIntlTranslations("footer")
}