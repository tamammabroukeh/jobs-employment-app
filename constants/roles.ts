// User roles enum
export enum UserRole {
  GUEST = 'guest',
  EMPLOYEE = 'employee',
  COMPANY = 'company',
  ADMIN = 'admin',
}

// Role-based route permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.GUEST]: ['/login', '/register', '/forgot-password', '/verify-code', '/'],
  [UserRole.EMPLOYEE]: ['/dashboard', '/profile', '/jobs', '/applications', '/'],
  [UserRole.COMPANY]: ['/dashboard', '/profile', '/jobs', '/candidates', '/post-job', '/'],
  [UserRole.ADMIN]: ['*'], // Admin has access to all routes
};

// Routes that require specific roles
export const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/dashboard': [UserRole.EMPLOYEE, UserRole.COMPANY, UserRole.ADMIN],
  '/post-job': [UserRole.COMPANY, UserRole.ADMIN],
  '/candidates': [UserRole.COMPANY, UserRole.ADMIN],
  '/applications': [UserRole.EMPLOYEE, UserRole.ADMIN],
  '/admin': [UserRole.ADMIN],
};

// Check if user has access to a route
export function hasRouteAccess(userRole: UserRole | undefined, route: string): boolean {
  if (!userRole) return false;
  if (userRole === UserRole.ADMIN) return true;

  const allowedRoles = PROTECTED_ROUTES[route];
  if (!allowedRoles) return true; // Public route

  return allowedRoles.includes(userRole);
}

// Get dashboard route based on role
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case UserRole.COMPANY:
      return '/dashboard/company';
    case UserRole.EMPLOYEE:
      return '/dashboard/employee';
    case UserRole.ADMIN:
      return '/dashboard/admin';
    default:
      return '/';
  }
}
