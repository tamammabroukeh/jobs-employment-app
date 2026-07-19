import { Metadata } from 'next';
import JobDetailClient from '@/components/jobs/detail/JobDetailClient';
import { getJobByIdAction } from '@/apis/services/jobs';
import { notFound } from 'next/navigation';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobByIdAction(id);

  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'The job you are looking for could not be found.',
    };
  }

  return {
    title: `${job.title} at ${job.company_name}`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  // Fetch job data from API
  const job = await getJobByIdAction(id);

  // Show 404 if job not found
  if (!job) {
    notFound();
  }

  return <JobDetailClient job={job} />;
}
