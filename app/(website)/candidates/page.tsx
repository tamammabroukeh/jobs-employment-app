import CandidatesClient from '@/components/employer/CandidatesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Candidates - Discover Top Talent',
  description: 'Browse and discover qualified candidates for your open positions',
};

export default function CandidatesPage() {
  return <CandidatesClient />;
}
