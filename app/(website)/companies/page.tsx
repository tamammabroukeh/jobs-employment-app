import { getCompaniesTranslations } from '@/lib/get-translations';
import { Typography, ReusablePagination } from '@/components/Reusable-Components';
import CompaniesList from '@/components/companies/CompaniesList';
import CompanySearch from '@/components/companies/CompanySearch';
import { companiesRepository } from '@/apis/services/companies';
import { Metadata } from 'next';
import { parseCompaniesSearchParams } from '@/apis/services/companies/helpers';
import TopCompaniesSection from '@/components/home/top-companies/TopCompaniesSection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getCompaniesTranslations();
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

interface CompaniesPageProps {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
    search?: string;
    industry?: string;
    location?: string;
    company_size?: string;
    sort_by?: string;
    sort_order?: string;
  }>;
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const t = await getCompaniesTranslations();
  const params = await searchParams;
  
  // Parse query parameters using shared utility
  const parsedParams = parseCompaniesSearchParams(params);
  const { page: currentPage, per_page: pageSize, search: searchQuery } = parsedParams;

  // Fetch companies from API
  let companiesData;
  let error = null;

  try {
    companiesData = await companiesRepository.getCompanies(parsedParams);
  } catch (err) {
    console.error('Failed to fetch companies:', err);
    error = 'Failed to load companies. Please try again later.';
    companiesData = {
      data: [],
      current_page: 1,
      per_page: pageSize,
      total: 0,
      total_pages: 0,
      next_page: null,
      prev_page: null,
    };
  }

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 bg-linear-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography variant="h1" className="text-foreground mb-4">
            {t('pageTitle')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t('pageDescription')}
          </Typography>
        </div>
      </section>
    <TopCompaniesSection showHeader={false} showViewAllCompanies={false} />
      {/* Companies Search & List */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Input */}
          <div className="mb-8">
            <CompanySearch value={searchQuery} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Typography variant="p" className="text-destructive">
                {error}
              </Typography>
            </div>
          )}

          {/* Results Count */}
          {!error && companiesData.total > 0 && (
            <div className="mb-6">
              <Typography variant="p" className="text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, companiesData.total)} of {companiesData.total} companies
              </Typography>
            </div>
          )}

          {/* Companies List */}
          <CompaniesList companies={companiesData.data} />

          {/* Pagination */}
            <ReusablePagination
              currentPage={currentPage}
              totalItems={companiesData.total}
              pageSize={pageSize}
            />
        </div>
      </section>
    </main>
  );
}
