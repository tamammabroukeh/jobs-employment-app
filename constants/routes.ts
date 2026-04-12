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
    LIST:"/jobs"
  },
  COMPANIES:{
    LIST:"/companies",
    DETAIL:"/companies/:id"
  },
  PROFILE:{
    VIEW:"/profile/:id",
    EDIT:"/profile/edit/:id"
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

export default ROUTES;
