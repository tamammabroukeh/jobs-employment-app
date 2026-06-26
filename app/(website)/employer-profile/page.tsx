import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import ROUTES from '@/constants/routes';
import { getCompanyProfileAction } from '@/apis/services/employer/actions';
import EmployerProfileClient from '@/components/employer/EmployerProfileClient';

export default async function EmployerProfilePage() {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has employer role
  if (!session || session.user.role !== 'employer') {
    redirect(ROUTES.AUTH.LOGIN);
  }

  try {
    // Fetch company profile
    const result = await getCompanyProfileAction();
    console.log('result', result)
    if (!result.success || !result.data) {
      throw new Error('Failed to fetch company profile');
    }

    return <EmployerProfileClient initialData={result.data} />;
  } catch (error) {
    console.error('Error fetching company profile:', error);
    
    // If profile doesn't exist, pass null to show empty state
    return <EmployerProfileClient initialData={null} />;
  }
}
