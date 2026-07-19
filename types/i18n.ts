export type Messages = {
  auth: typeof import("../messages/en/auth.json")
  errors: typeof import("../messages/en/errors.json")
  dashboard: typeof import("../messages/en/dashboard.json")
  session: typeof import("../messages/en/session.json")
  home: typeof import("../messages/en/home.json")
  footer: typeof import("../messages/en/footer.json")
  jobs: typeof import("../messages/en/jobs.json")
  companies: typeof import("../messages/en/companies.json")
  jobDetail: typeof import("../messages/en/job-detail.json")
  profile: typeof import("../messages/en/profile.json")
  talents: typeof import("../messages/en/talents.json")
  candidates: typeof import("../messages/en/candidates.json")
  employer: typeof import("../messages/en/employer.json")
  applications: typeof import("../messages/en/applications.json")
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
  | `footer.${keyof Messages["footer"]}`
  | `profile.documents.${keyof Messages["profile"]["documents"]}`
  | `profile.documents.resume.${keyof Messages["profile"]["documents"]["resume"]}`
  | `profile.documents.coverLetter.${keyof Messages["profile"]["documents"]["coverLetter"]}`
  | `profile.documents.aiAnalysis.${keyof Messages["profile"]["documents"]["aiAnalysis"]}`
  | `talents.${keyof Messages["talents"]}`
  | `talents.filters.${keyof Messages["talents"]["filters"]}`
  | `talents.card.${keyof Messages["talents"]["card"]}`
  | `talents.card.salary.${keyof Messages["talents"]["card"]["salary"]}`
  | `talents.noResults.${keyof Messages["talents"]["noResults"]}`
  | `talents.errors.${keyof Messages["talents"]["errors"]}`
  | `candidates.${keyof Messages["candidates"]}`
  | `employer.${keyof Messages["employer"]}`
  | `applications.${keyof Messages["applications"]}`
  | `applications.status.${keyof Messages["applications"]["status"]}`
  | `applications.card.${keyof Messages["applications"]["card"]}`
  | `applications.job.${keyof Messages["applications"]["job"]}`
  | `applications.empty.${keyof Messages["applications"]["empty"]}`
  | `applications.pagination.${keyof Messages["applications"]["pagination"]}`
  | `applications.filters.${keyof Messages["applications"]["filters"]}`
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
