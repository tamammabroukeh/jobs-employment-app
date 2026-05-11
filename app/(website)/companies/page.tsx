import { getCompaniesTranslations } from '@/lib/get-translations';
import { Typography } from '@/components/Reusable-Components';
import TopCompaniesSection from '@/components/home/top-companies/TopCompaniesSection';
import CompaniesSearchSection from '@/components/companies/CompaniesSearchSection';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getCompaniesTranslations();
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function CompaniesPage() {
  const t = await getCompaniesTranslations();

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography variant="h1" className="text-foreground mb-4">
            {t('pageTitle')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t('pageDescription')}
          </Typography>
        </div>
      </section>

      {/* Top Companies Carousel */}
      <TopCompaniesSection />

      {/* Companies Search & List */}
      <CompaniesSearchSection />
    </main>
  );
}
