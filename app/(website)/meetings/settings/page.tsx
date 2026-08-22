import { Metadata } from 'next';
import MeetingSettingsClient from '@/components/meetings/MeetingSettingsClient';

export const metadata: Metadata = {
  title: 'Meeting Settings',
  description: 'Manage your meeting preferences and integrations',
};

export default function MeetingSettingsPage() {
  return <MeetingSettingsClient />;
}
