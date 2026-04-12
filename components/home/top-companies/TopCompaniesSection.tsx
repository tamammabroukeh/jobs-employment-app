import { getTranslations } from '@/lib/get-translations';
import TopCompaniesCarousel from './TopCompaniesCarousel';
import { ReusableButton, Typography } from '@/components/Reusable-Components';
import Link from 'next/link';

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

export default async function TopCompaniesSection() {
  const t = await getTranslations('home');
  
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography
            variant="h2" 
            className="text-foreground mb-4"
          >
            {t('topCompanies.title')}
          </Typography>
          <Typography 
            variant="p" 
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {t('topCompanies.description')}
          </Typography>
        </div>

        {/* Companies Carousel */}
        <div className="mb-12">
          <TopCompaniesCarousel companies={mockCompanies} />
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/companies">
            <ReusableButton
              variant="primary"
              size="large"
              className="px-8"
            >
              {t('topCompanies.viewAll')}
              <i className="fa-solid fa-arrow-right ml-2" />
            </ReusableButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
