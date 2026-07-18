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
  const { id } = await params;
  console.log('id', id)
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an employer
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/forsa/' + id);
  }

  if (session.user.role !== 'employer') {
    redirect('/unauthorized');
  }

  let job;
  try {
    console.log('id', id)
    const response = await employerRepository.getJob(id);
    console.log('response', response)
    job = response;
  } catch (error) {
    console.error('Error fetching job:', error);
    // redirect('/manage-jobs');
  }

  return (
    <div className="min-h-screen bg-background">
      <ForsaForm mode="edit" initialData={job} jobId={id} />
    </div>
  );
}
