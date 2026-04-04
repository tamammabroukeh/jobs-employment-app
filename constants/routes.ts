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
  }
};

export default ROUTES;
