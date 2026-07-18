import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

const locales = ["en", "ar"] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  let locale = cookieStore.get("locale")?.value || "en"

  if (!locales.includes(locale as Locale)) {
    locale = "en"
  }

  // Load all message files for the locale
  const [auth, errors, dashboard, session, home, footer, jobs, companies, jobDetail, profile, employer, candidates, talents] = await Promise.all([
    import(`../messages/${locale}/auth.json`).then((m) => m.default),
    import(`../messages/${locale}/errors.json`).then((m) => m.default),
    import(`../messages/${locale}/dashboard.json`).then((m) => m.default),
    import(`../messages/${locale}/session.json`).then((m) => m.default),
    import(`../messages/${locale}/home.json`).then((m) => m.default),
    import(`../messages/${locale}/footer.json`).then((m) => m.default),
    import(`../messages/${locale}/jobs.json`).then((m) => m.default),
    import(`../messages/${locale}/companies.json`).then((m) => m.default),
    import(`../messages/${locale}/job-detail.json`).then((m) => m.default),
    import(`../messages/${locale}/profile.json`).then((m) => m.default),
    import(`../messages/${locale}/employer.json`).then((m) => m.default),
    import(`../messages/${locale}/candidates.json`).then((m) => m.default),
    import(`../messages/${locale}/talents.json`).then((m) => m.default),
  ])

  return {
    locale,
    messages: {
      auth,
      errors,
      dashboard,
      session,
      home,
      footer,
      jobs,
      companies,
      jobDetail,
      profile,
      employer,
      candidates,
      talents
    },
  }
})

export function isRTL(locale: string): boolean {
  return locale === "ar"
}

export type { AllTranslationKeys } from "@/types/i18n-types"
