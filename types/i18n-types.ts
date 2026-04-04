import { Messages } from "./i18n"

declare global {
  interface IntlMessages extends Messages {}
}

export type MessageKeys = keyof IntlMessages

// Helper type to get nested translation keys with dot notation
export type FlattenKeys<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends Record<string, Record<string, any>>
      ? K | `${K}.${FlattenKeys<T[K]>}`
      : K | `${K}.${keyof T[K] & string}`
    : K
  : never

export type AllTranslationKeys = FlattenKeys<IntlMessages>
