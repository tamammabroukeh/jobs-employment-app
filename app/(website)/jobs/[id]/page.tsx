import { getJobDetailTranslations } from '@/lib/get-translations';
import { Typography, ReusableButton, ReusableBadge } from '@/components/Reusable-Components';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import ApplyJobDialog from '@/components/jobs/detail/ApplyJobDialog';
import JobDetailClient from '@/components/jobs/detail/JobDetailClient';
import ROUTES from '@/constants/routes';

// Mock data - Replace with actual API call
const mockJobData = {
  id: '1',
  displayId: 'JOB-001',
  title: 'Senior Frontend Developer',
  coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
  description:
    'We are looking for an experienced Senior Frontend Developer to join our dynamic team. You will be responsible for building and maintaining high-quality web applications using modern technologies. The ideal candidate should have strong expertise in React, TypeScript, and modern frontend development practices.',
  roles: ['Frontend', 'React', 'TypeScript', 'UI/UX'],
  types: ['Full-time', 'Remote'],
  levels: ['Senior'],
  experience: '5+ years',
  location: 'San Francisco, CA',
  createdAt: '2024-01-15',
  company: {
    id: '1',
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    description:
      'Google is a multinational technology company that specializes in Internet-related services and products, including search, cloud computing, and advertising technologies.',
    location: 'Mountain View, CA',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/google',
      twitter: 'https://twitter.com/Google',
      facebook: 'https://www.facebook.com/Google',
      instagram: 'https://www.instagram.com/google',
    },
  },
};

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  // In real app, fetch job data based on id
  const job = mockJobData;

  return {
    title: `${job.title} at ${job.company.name}`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  // In real app, fetch job data based on id
  const job = mockJobData;

  return <JobDetailClient job={job} />;
}
