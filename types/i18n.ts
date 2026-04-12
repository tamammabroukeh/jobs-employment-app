export type Messages = {
  auth: typeof import("../messages/en/auth.json")
  errors: typeof import("../messages/en/errors.json")
  dashboard: typeof import("../messages/en/dashboard.json")
  session: typeof import("../messages/en/session.json")
  home: typeof import("../messages/en/home.json")
}

export type IntlKeys =
  | keyof Messages
  | `auth.signin.${keyof Messages["auth"]["signin"]}`
  | `auth.signup.${keyof Messages["auth"]["signup"]}`
  | `auth.signup.roles.${keyof Messages["auth"]["signup"]["roles"]}`
  | `auth.validation.${keyof Messages["auth"]["validation"]}`
  | `dashboard.admin.${keyof Messages["dashboard"]["admin"]}`
  | `dashboard.employee.${keyof Messages["dashboard"]["employee"]}`
  | `errors.unauthorized.${keyof Messages["errors"]["unauthorized"]}`
  | `session.${keyof Messages["session"]}`
  | "errors.noPermission"
  | "errors.noPermissionAction"
  | "errors.signInRequired"

// Recursive type to extract all nested keys
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationKeys = NestedKeyOf<Messages>
