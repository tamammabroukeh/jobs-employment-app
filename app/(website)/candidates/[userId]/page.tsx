import { Metadata } from 'next';
import { employerRepository } from '@/apis/services/employer';
import { getCandidatesTranslations } from '@/lib/get-translations';
import { Typography } from '@/components/Reusable-Components';
import Link from 'next/link';
import ROUTES from '@/constants/routes';
import CandidateProfileView from '@/components/employer/CandidateProfileView';

interface CandidateProfilePageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: CandidateProfilePageProps): Promise<Metadata> {
  try {
    const { userId } = await params;
    const response = await employerRepository.getCandidateDetail(userId);
    
    if (response?.seeker?.profile) {
      return {
        title: `${response.seeker.profile.full_name} - Candidate Profile`,
        description: response.seeker.profile.experience_summary || 'View candidate profile',
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Candidate Profile',
    description: 'View candidate details and information',
  };
}

export default async function CandidateProfilePage({ params }: CandidateProfilePageProps) {
  const { userId } = await params;
  const t = await getCandidatesTranslations();

  let candidate = null;
  let error: string | null = null;

  try {
    const response = await employerRepository.getCandidateDetail(userId);
    candidate = response.seeker.profile;
  } catch (err) {
    console.error('Error fetching candidate:', err);
    error = 'Failed to load candidate profile';
  }

  if (error || !candidate) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="auth-card p-8 max-w-md text-center">
          <Typography variant="h2" className="text-error mb-4">
            {error || t('profile.notFound')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground mb-6">
            {t('profile.notFoundDescription')}
          </Typography>
          <Link
            href={ROUTES.EMPLOYER.CANDIDATES}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('profile.backToCandidates')}
          </Link>
        </div>
      </main>
    );
  }

  return <CandidateProfileView candidate={candidate} />;
}
