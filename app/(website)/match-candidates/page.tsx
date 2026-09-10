import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import MatchCandidatesClient from '@/components/employer/MatchCandidatesClient';
import { getCandidatesTranslations } from '@/lib/get-translations';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getCandidatesTranslations();

  return {
    title: t('matchPage.pageTitle'),
    description: t('matchPage.pageDescription'),
  };
}

export default async function MatchCandidatesPage() {
  const session = await getServerSession(authOptions);

  // Only authenticated employers can access this page
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/match-candidates');
  }

  if (session.user.role !== 'employer') {
    redirect('/unauthorized');
  }

  return <MatchCandidatesClient />;
}
