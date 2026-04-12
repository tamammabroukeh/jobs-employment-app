import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/home/hero/HeroSection';
import CategoriesSection from '@/components/home/categories/CategoriesSection';
import TopCompaniesSection from '@/components/home/top-companies/TopCompaniesSection';
import RecentJobsSection from '@/components/home/recent-jobs/RecentJobsSection';
import { getTranslations } from '@/lib/get-translations';
import { Typography } from '@/components/Reusable-Components';

export default async function Home() {
  const t = await getTranslations('home');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />


      {/* Top Companies Section */}
      <TopCompaniesSection />

      {/* Recent Jobs Section */}
      <RecentJobsSection />

      {/* Categories Section */}
      <CategoriesSection />
      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-foreground mb-4">
              {t('features.title')}
            </Typography>
            <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto">
              {t('features.description')}
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="auth-card p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-magnifying-glass text-2xl text-primary" />
              </div>
              <Typography variant="h3" className="text-foreground mb-2">
                {t('features.easySearch.title')}
              </Typography>
              <Typography variant="p" className="text-muted-foreground">
                {t('features.easySearch.description')}
              </Typography>
            </div>

            {/* Feature 2 */}
            <div className="auth-card p-6 text-center">
              <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-building text-2xl text-success" />
              </div>
              <Typography variant="h3" className="text-foreground mb-2">
                {t('features.topCompanies.title')}
              </Typography>
              <Typography variant="p" className="text-muted-foreground">
                {t('features.topCompanies.description')}
              </Typography>
            </div>

            {/* Feature 3 */}
            <div className="auth-card p-6 text-center">
              <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-rocket text-2xl text-warning" />
              </div>
              <Typography variant="h3" className="text-foreground mb-2">
                {t('features.fastApply.title')}
              </Typography>
              <Typography variant="p" className="text-muted-foreground">
                {t('features.fastApply.description')}
              </Typography>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-briefcase text-white text-sm" />
              </div>
              <Typography variant="text" weight="semibold" className="text-foreground">
                {t('footer.brand')}
              </Typography>
            </div>
            <Typography variant="small" className="text-muted-foreground">
              {t('footer.copyright')}
            </Typography>
          </div>
        </div>
      </footer>
    </div>
  );
}
