import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import ManageJobsClient from '@/components/employer/ManageJobsClient';
import { employerRepository } from '@/apis/services/employer';
import type { Job } from '@/apis/services/employer';

export default async function ManageJobsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  
  console.log("session", session);
  
  // Check if user is authenticated and is an employer
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/manage-jobs');
  }

  if (session.user.role !== 'employer') {
    redirect('/unauthorized');
  }

  const page = Number(searchParams.page) || 1;

  let jobsData: Job[] = [];
  try {
    jobsData = await employerRepository.getJobs(page, 10);
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    jobsData = [];
  }
  
  console.log('jobsData', jobsData);
  
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <ManageJobsClient initialJobs={jobsData} />
      </Suspense>
    </div>
  );
}
