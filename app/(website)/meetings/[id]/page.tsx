import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { meetingsRepository } from '@/apis/services/meetings';
import MeetingDetailClient from '@/components/meetings/MeetingDetailClient';

export const metadata: Metadata = {
  title: 'Meeting Details',
  description: 'View meeting details and manage your meeting',
};

interface MeetingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }
  
  // Await params to get the actual id
  const { id } = await params;
  console.log('Meeting ID:', id);
  
  let meeting;
  try {
    meeting = await meetingsRepository.getMeeting(id);
  } catch (error) {
    console.error('Failed to fetch meeting:', error);
    notFound();
  } 
  console.log('session.user.id', session.user.id)
  // Check if user is participant
  const isParticipant = 
    meeting.meeting.organizer_id === session.user.id || 
    meeting.meeting.invitee_id === session.user.id;
    console.log('meeting.meeting.invitee_id === session.user.id', meeting.meeting.invitee_id +'==='+ session.user.id)
  console.log('meeting', meeting)
  console.log('isParticipant', isParticipant)
  if (!isParticipant) {
    redirect('/unauthorized');
  }

  return <MeetingDetailClient meeting={meeting.meeting} userId={session.user.id} />;
}
