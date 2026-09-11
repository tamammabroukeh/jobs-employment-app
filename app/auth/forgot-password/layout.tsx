import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Reset Your Password',
  description: 'Request a password reset link to regain access to your account.',
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
