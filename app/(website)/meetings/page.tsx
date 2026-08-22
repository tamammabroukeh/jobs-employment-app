import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import MeetingsClient from '@/components/meetings/MeetingsClient';

export const metadata: Metadata = {
  title: 'My Meetings',
  description: 'View and manage your meeting invitations',
};

export default async function MeetingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  return <MeetingsClient userId={session.user.id} />;
}
