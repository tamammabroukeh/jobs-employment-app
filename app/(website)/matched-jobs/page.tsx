import MatchedJobsSection from '@/components/jobs/MatchedJobsSection';
import { Typography } from '@/components/Reusable-Components';
import { getJobsTranslations } from '@/lib/get-translations';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getJobsTranslations();

  return {
    title: t('matchedJobs.pageTitle'),
    description: t('matchedJobs.pageDescription'),
  };
}

export default async function MatchedJobsPage() {
  const t = await getJobsTranslations();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary/10 via-primary/5 to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <i className="fa-solid fa-bullseye text-3xl text-primary" />
            </div>
            <Typography variant="h1" className="text-foreground mb-4">
              {t('matchedJobs.heroTitle')}
            </Typography>
            <Typography variant="p" className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('matchedJobs.heroDescription')}
            </Typography>
          </div>
        </div>
      </section>

      {/* Matched Jobs Section */}
      <MatchedJobsSection />
    </div>
  );
}