import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import ForsaForm from '@/components/employer/ForsaForm';

export default async function ForsaPage() {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an employer
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/forsa');
  }

  if (session.user.role !== 'employer') {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-background">
      <ForsaForm mode="create" />
    </div>
  );
}
