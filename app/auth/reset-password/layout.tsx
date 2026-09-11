import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Set a New Password',
  description: 'Set a new password for your account to securely regain access.',
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
