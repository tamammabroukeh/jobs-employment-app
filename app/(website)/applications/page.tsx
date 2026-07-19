import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import ApplicationsClient from '@/components/applications/ApplicationsClient';
import { jobSeekerRepository } from '@/apis/services/job-seeker';
import type { IJobApplicationsResponse } from '@/apis/services/job-seeker/interface';

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is an employee
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/applications');
  }

  if (session.user.role !== 'employee') {
    redirect('/unauthorized');
  }

  const page = Number(searchParams.page) || 1;
  const per_page = 10;

  let applicationsData: IJobApplicationsResponse | null = null;
  try {
    applicationsData = await jobSeekerRepository.getApplications({ page, per_page });
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <ApplicationsClient 
          initialData={applicationsData} 
          initialPage={page}
        />
      </Suspense>
    </div>
  );
}
