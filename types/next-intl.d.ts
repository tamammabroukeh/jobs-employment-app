declare module "next-intl" {
  interface IntlConfig {
    messages: IntlMessages
  }
}

declare global {
  interface IntlMessages {
    auth: {
      signin: {
        title: string
        description: string
        email: string
        password: string
        submit: string
        forgotPassword: string
        noAccount: string
        signup: string
        invalidCredentials: string
        unexpectedError: string
      }
      signup: {
        title: string
        description: string
        name: string
        email: string
        role: string
        password: string
        confirmPassword: string
        submit: string
        hasAccount: string
        signin: string
        success: string
        redirecting: string
        roles: {
          employee: string
          company: string
          owner: string
          admin: string
        }
      }
      validation: {
        nameRequired: string
        emailInvalid: string
        passwordMinLength: string
        passwordRequired: string
        passwordsNoMatch: string
      }
    }
    dashboard: {
      admin: {
        title: string
        description: string
        totalUsers: string
        companies: string
        systemHealth: string
        settings: string
        uptime: string
        operational: string
      }
      employee: {
        title: string
        description: string
        profile: string
        hoursToday: string
        tasks: string
        nextMeeting: string
        profileComplete: string
        hoursRemaining: string
        tasksRemaining: string
        teamStandup: string
      }
    }
    errors: {
      unauthorized: {
        title: string
        description: string
        contact: string
        goToDashboard: string
        signIn: string
      }
      noPermission: string
      noPermissionAction: string
      signInRequired: string
    }
    session: {
      expired: string
      expiredDescription: string
      expiringSoon: string
      expiringSoonDescription: string
    }
  }
}
