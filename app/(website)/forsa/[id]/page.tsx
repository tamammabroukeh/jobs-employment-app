import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import ForsaForm from '@/components/employer/ForsaForm';
import { employerRepository } from '@/apis/services/employer';

export default async function EditForsaPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an employer
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/forsa/' + params.id);
  }

  if (session.user.role !== 'employer') {
    redirect('/unauthorized');
  }

  let job;
  try {
    const response = await employerRepository.getJob(params.id);
    job = response.data.job;
  } catch (error) {
    console.error('Error fetching job:', error);
    redirect('/manage-jobs');
  }

  return (
    <div className="min-h-screen bg-background">
      <ForsaForm mode="edit" initialData={job} jobId={params.id} />
    </div>
  );
}
