import TopCompaniesCarousel from '@/components/home/top-companies/TopCompaniesCarousel';
import JobsSearchSection from '@/components/jobs/JobsSearchSection';
import { Typography } from '@/components/Reusable-Components';
import { getJobsTranslations } from '@/lib/get-translations';

// Mock data - Replace with actual API call
const mockCompanies = [
  {
    id: '1',
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
  },
  {
    id: '2',
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
  },
  {
    id: '3',
    name: 'Apple',
    logo: 'https://logo.clearbit.com/apple.com',
  },
  {
    id: '4',
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
  },
  {
    id: '5',
    name: 'Meta',
    logo: 'https://logo.clearbit.com/meta.com',
  },
  {
    id: '6',
    name: 'Netflix',
    logo: 'https://logo.clearbit.com/netflix.com',
  },
  {
    id: '7',
    name: 'Tesla',
    logo: 'https://logo.clearbit.com/tesla.com',
  },
  {
    id: '8',
    name: 'Spotify',
    logo: 'https://logo.clearbit.com/spotify.com',
  },
];

export default async function JobsPage() {
  const t = await getJobsTranslations();

  return (
    <>
      {/* Top Companies Section */}
      <section className="py-16 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-foreground mb-4">
              {t('topCompanies.title')}
            </Typography>
            <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto">
              {t('topCompanies.description')}
            </Typography>
          </div>
          <TopCompaniesCarousel companies={mockCompanies} />
        </div>
      </section>

      {/* Jobs Search Section */}
      <JobsSearchSection />
    </>
  );
}
