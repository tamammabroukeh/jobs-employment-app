const ROUTES = {
  HOME: "/",
  AUTH:{
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ACTIVE_ACCOUNT: "/auth/active-account",
    VERIFY_OTP: "/auth/verify-otp",
  },
  USERS: {
    ROOT: "/user-management",
    TRAINERS: "/user-management/trainers",
    TECH_LEADERS: "/user-management/tech-leaders",
  },
  JOB:{
    LIST:"/jobs",
    DETAIL:"/jobs/:id",
    getDetail: (id: string) => `/jobs/${id}`,
    MATCHED: "/matched-jobs",
  },
  OFFERS: "/offers",
  COMPANIES:{
    LIST:"/companies",
    DETAIL:"/companies/:id",
    getDetail: (id: string) => `/companies/${id}`,
    RATE: "/companies/rate",
  },
  PROFILE:{
    VIEW:"/profile",
    DETAIL:"/profile/:id",
    EDIT:"/profile/edit/:id",
    getDetail: (id: string) => `/profile/${id}`,
  },
  APPLICATIONS: "/applications",
  CANDIDATES: {
    LIST: "/candidates",
    DETAIL: "/candidates/:userId",
    getDetail: (userId: string) => `/candidates/${userId}`,
  },
  TALENTS:{
    LIST:"/talents",
    DETAIL:"/talents/:id",
    getDetail: (id: string) => `/talents/${id}`,
  },
  DASHBOARD:{
    ROOT:"/dashboard",
    ANALYTICS:"/dashboard/analytics",
    JOBS:"/dashboard/jobs",
    BOOKMARKS:"/dashboard/bookmarks",
    ACTIVITIES:"/dashboard/activities",
    SETTINGS:"/dashboard/settings",
    NOTIFICATIONS:"/dashboard/notifications",
    HELP:"/dashboard/help",
  },
  EMPLOYER:{
    MANAGE_JOBS: "/manage-jobs",
    CREATE_JOB: "/forsa",
    EDIT_JOB: "/forsa/:id",
    getEditJob: (id: string) => `/forsa/${id}`,
    PROFILE: "/employer-profile",
    CANDIDATES: "/candidates",
  },
  MEETINGS: {
    LIST: "/meetings",
    CREATE: "/meetings/create",
    DETAIL: "/meetings/:id",
    getDetail: (id: string) => `/meetings/${id}`,
  },
  COACH: {
    ROOT: "/resume-coach",
  }
};

export const NAVBAR_LINKS = [
  {
    labelKey: "links.home",
    href: ROUTES.HOME,
    showInNavbar: true,
    authRequired: false, // Public - always visible
    roles: ["employee"], // Empty means all roles can access
  },
  {
    labelKey: "links.jobs",
    href: ROUTES.JOB.LIST,
    showInNavbar: true,
    authRequired: false, // Public - always visible
    roles: ["employee"],
  },
  {
    labelKey: "links.matchedJobs",
    href: ROUTES.JOB.MATCHED,
    showInNavbar: true,
    authRequired: true, // Protected - only visible when logged in
    roles: ["employee"], // Only for job seekers
  },
  {
    labelKey: "links.companies",
    href: ROUTES.COMPANIES.LIST,
    showInNavbar: true,
    authRequired: false, // Public - always visible
    roles: ["employee"],
  },
  {
    labelKey: "links.talents",
    href: ROUTES.TALENTS.LIST,
    showInNavbar: true,
    authRequired: false, // Public - always visible
    roles: ["employee"],
  },
  {
    labelKey: "links.profile",
    href: ROUTES.PROFILE.VIEW,
    showInNavbar: true,
    authRequired: true, // Protected - only visible when logged in
    roles: ["employee"], // Only for job seekers
  },
  {
    labelKey: "links.applications",
    href: ROUTES.APPLICATIONS,
    showInNavbar: true,
    authRequired: true,
    roles: ["employee"], // Only for job seekers
  },
  {
    labelKey: "links.offers",
    href: ROUTES.OFFERS,
    showInNavbar: true,
    authRequired: true,
    roles: ["employee"], // Only for job seekers
  },
  {
    labelKey: "links.manageJobs",
    href: ROUTES.EMPLOYER.MANAGE_JOBS,
    showInNavbar: true,
    authRequired: true,
    roles: ["employer"], // Only for employers
  },
  {
    labelKey: "links.candidates",
    href: ROUTES.EMPLOYER.CANDIDATES,
    showInNavbar: true,
    authRequired: true,
    roles: ["employer"], // Only for employers
  },
  {
    labelKey: "links.profile",
    href: ROUTES.EMPLOYER.PROFILE,
    showInNavbar: true,
    authRequired: true,
    roles: ["employer"], // Only for employers
  },
  {
    labelKey: "links.meetings",
    href: ROUTES.MEETINGS.LIST,
    showInNavbar: true,
    authRequired: true,
    roles: ["employee", "employer"], // Both roles can access meetings
  },
  {
    labelKey: "links.aiResumeCoach",
    href: ROUTES.COACH.ROOT,
    showInNavbar: true,
    authRequired: true,
    roles: ["employee"], // Only for job seekers
  }
];

export default ROUTES;
