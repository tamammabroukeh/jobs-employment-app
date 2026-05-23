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
  DASHBOARD:{
    ROOT:"/dashboard",
    ANALYTICS:"/dashboard/analytics",
    JOBS:"/dashboard/jobs",
    BOOKMARKS:"/dashboard/bookmarks",
    ACTIVITIES:"/dashboard/activities",
    SETTINGS:"/dashboard/settings",
    NOTIFICATIONS:"/dashboard/notifications",
    HELP:"/dashboard/help",
  }
};

export const NAVBAR_LINKS = [
  {
    label: "Home",
    href: ROUTES.HOME,
    showInNavbar: true,
    authRequired: false, // Public - always visible
  },
  {
    label: "Jobs",
    href: ROUTES.JOB.LIST,
    showInNavbar: true,
    authRequired: false, // Public - always visible
  },
  {
    label: "Companies",
    href: ROUTES.COMPANIES.LIST,
    showInNavbar: true,
    authRequired: false, // Public - always visible
  },
  {
    label: "Profile",
    href: ROUTES.PROFILE.VIEW,
    showInNavbar: true,
    authRequired: true, // Protected - only visible when logged in
  },
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD.ROOT,
    showInNavbar: true,
    authRequired: true, // Protected - only visible when logged in
  },
];

export default ROUTES;
