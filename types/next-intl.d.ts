// This file provides type definitions for next-intl
// Types are automatically inferred from JSON message files

import type { Messages } from "./i18n"

declare module "next-intl" {
  interface IntlConfig {
    messages: Messages
  }
}

// Global type declaration for IntlMessages
// This enables autocomplete for translation keys throughout the app
declare global {
  interface IntlMessages extends Messages {}
}
