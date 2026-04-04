import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ReusableCard from '@/components/Reusable-Components/Reusable-Card';
import LogoutButton from '@/components/LogoutButton';
import { UserRole } from '@/constants/roles';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userRole = session.user.role as UserRole;
  const userName = session.user.first_name || session.user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-briefcase text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">JobsPortal</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <LocaleSwitcher />
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here is what is happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="auth-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-user text-primary text-xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-lg font-semibold text-foreground capitalize">{userRole}</p>
              </div>
            </div>
          </div>

          <div className="auth-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-envelope text-success text-xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-semibold text-foreground truncate max-w-[150px]">{session.user.email}</p>
              </div>
            </div>
          </div>

          <div className="auth-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-shield-halved text-warning text-xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold text-success">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <ReusableCard title="Profile Information" description="Your account details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="text-foreground font-medium">
                  {session.user.first_name} {session.user.last_name || ''}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email Address</label>
                <p className="text-foreground font-medium">{session.user.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Account Type</label>
                <p className="text-foreground font-medium capitalize">{userRole}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Member Since</label>
                <p className="text-foreground font-medium">December 2024</p>
              </div>
            </div>
          </div>
        </ReusableCard>
      </main>
    </div>
  );
}
