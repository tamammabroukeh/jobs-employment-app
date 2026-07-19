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
  }
};

export const NAVBAR_LINKS = [
  {
    label: "Home",
    href: ROUTES.HOME,
    showInNavbar: true,
    authRequired: false, // Public - always visible
    roles: ["employee"], // Empty means all roles can access
  },
  {
    label: "Jobs",
    href: ROUTES.JOB.LIST,
    showInNavbar: true,
    authRequired: false, // Public - always visible
    roles: ["employee"],
  },
  {
    label: "Matched Jobs",
    href: ROUTES.JOB.MATCHED,
    showInNavbar: true,
    authRequired: true, // Protected - only visible when logged in
    roles: ["employee"], // Only for job seekers
  },
  {
    label: "Companies",
    href: ROUTES.COMPANIES.LIST,
    showInNavbar: true,
    authRequired: false, // Public - always visible
    roles: ["employee"],
  },
  {
    label: "Talents",
    href: ROUTES.TALENTS.LIST,
    showInNavbar: true,
    authRequired: false, // Public - always visible
    roles: ["employee"],
  },
  {
    label: "Profile",
    href: ROUTES.PROFILE.VIEW,
    showInNavbar: true,
    authRequired: true, // Protected - only visible when logged in
    roles: ["employee"], // Only for job seekers
  },
  {
    label: "Applications",
    href: ROUTES.APPLICATIONS,
    showInNavbar: true,
    authRequired: true,
    roles: ["employee"], // Only for job seekers
  },
  {
    label: "Manage Jobs",
    href: ROUTES.EMPLOYER.MANAGE_JOBS,
    showInNavbar: true,
    authRequired: true,
    roles: ["employer"], // Only for employers
  },
  {
    label: "Candidates",
    href: ROUTES.EMPLOYER.CANDIDATES,
    showInNavbar: true,
    authRequired: true,
    roles: ["employer"], // Only for employers
  },
  {
    label: "Profile",
    href: ROUTES.EMPLOYER.PROFILE,
    showInNavbar: true,
    authRequired: true,
    roles: ["employer"], // Only for employers
  }
];

export default ROUTES;
