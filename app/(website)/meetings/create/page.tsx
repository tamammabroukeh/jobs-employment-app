import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import CreateMeetingPageClient from '@/components/meetings/CreateMeetingPageClient';

export const metadata: Metadata = {
  title: 'Schedule Meeting',
  description: 'Create a new meeting invitation',
};

export default async function CreateMeetingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  return <CreateMeetingPageClient userRole={session.user.role} />;
}
