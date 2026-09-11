import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Code - Confirm Your Identity',
  description: 'Enter the verification code sent to you to confirm your identity.',
};

export default function VerifyCodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
