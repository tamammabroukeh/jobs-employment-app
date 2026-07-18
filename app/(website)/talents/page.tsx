import TalentsClient from '@/components/talents/TalentsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Talents - Find Skilled Professionals',
  description: 'Search and discover talented professionals with the skills and experience you need.',
};

export default function TalentsPage() {
  return <TalentsClient />;
}
