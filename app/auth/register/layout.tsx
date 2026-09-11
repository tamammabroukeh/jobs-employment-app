import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Create Your Account',
  description: 'Create a new account to search for jobs, hire talent, and grow your career.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
