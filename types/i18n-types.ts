import { Messages } from "./i18n"

declare global {
  interface IntlMessages extends Messages {}
}

export type MessageKeys = keyof IntlMessages

// Simplified flattening - manually define depth levels to avoid infinite recursion
type Flatten1<T> = {
  [K in keyof T]: K extends string
    ? T[K] extends Record<string, any>
      ? T[K] extends any[]
        ? K
        : K | `${K}.${keyof T[K] & string}`
      : K
    : never
}[keyof T]

type Flatten2<T> = {
  [K in keyof T]: K extends string
    ? T[K] extends Record<string, any>
      ? T[K] extends any[]
        ? K
        : K | {
            [K2 in keyof T[K]]: K2 extends string
              ? T[K][K2] extends Record<string, any>
                ? T[K][K2] extends any[]
                  ? `${K}.${K2}`
                  : `${K}.${K2}` | `${K}.${K2}.${keyof T[K][K2] & string}`
                : `${K}.${K2}`
              : never
          }[keyof T[K]]
      : K
    : never
}[keyof T]

// All possible translation keys with full autocomplete support
export type AllTranslationKeys = Flatten2<IntlMessages>

// Helper type to get keys for a specific namespace
export type NamespaceKeys<N extends keyof IntlMessages> = Flatten2<IntlMessages[N]>

// All possible namespace paths (including nested ones)
export type NamespacePath = MessageKeys | Extract<AllTranslationKeys, `${MessageKeys}.${string}`>

// Specific namespace key types for better autocomplete
export type AuthKeys = NamespaceKeys<'auth'>
export type ErrorKeys = NamespaceKeys<'errors'>
export type DashboardKeys = NamespaceKeys<'dashboard'>
export type SessionKeys = NamespaceKeys<'session'>
export type HomeKeys = NamespaceKeys<'home'>
export type FooterKeys = NamespaceKeys<'footer'>

// Helper type for translation function with values
export type TranslationValues = Record<string, string | number | boolean | Date>

// Extract keys after a namespace prefix
export type KeysAfterNamespace<
  Namespace extends string,
  AllKeys extends string
> = AllKeys extends `${Namespace}.${infer Rest}` ? Rest : never
