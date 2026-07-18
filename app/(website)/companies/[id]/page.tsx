import { getCompaniesTranslations } from '@/lib/get-translations';
import { Typography, ReusableTabs } from '@/components/Reusable-Components';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import CompanyOverview from '@/components/companies/detail/CompanyOverview';
import CompanyReviews from '@/components/companies/detail/CompanyReviews';
import CompanyJobs from '@/components/companies/detail/CompanyJobs';
import CompanyDirectApply from '@/components/companies/detail/CompanyDirectApply';
import type { ICompany } from '@/apis/services/companies/interface';
import { companiesRepository } from '@/apis/services/companies';

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const result = await companiesRepository.getCompanyById(id);
    if (result) {
      return {
        title: `${result.name} - Company Profile`,
        description: result.description,
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Company Profile',
    description: 'View company details, reviews, and available jobs',
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const t = await getCompaniesTranslations();

  // Fetch company data from API
  let company: ICompany | null = null;
  let error: string | null = null;
  
  try {
    const result = await companiesRepository.getCompanyById(id);
    if (result) {
      company = result;
    } else {
      error = 'Failed to fetch company details';
    }
  } catch (err) {
    console.error('Error fetching company details:', err);
    error = 'Failed to load company details. Please try again later.';
  }

  // If there's an error, show error UI
  if (error || !company) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="auth-card p-8 max-w-md text-center">
          <Typography variant="h2" className="text-error mb-4">
            {error || 'Company not found'}
          </Typography>
          <Typography variant="p" className="text-muted-foreground mb-6">
            Unable to load company details. The company may not exist or there may be a network issue.
          </Typography>
          <Link
            href="/companies"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Companies
          </Link>
        </div>
      </main>
    );
  }

  // Map company jobs to the format expected by CompanyJobs component
  const mappedJobs = company.jobs.map((job) => ({
    id: job.id,
    displayId: job.job_id,
    companyName: company.name,
    companyLogo: company.logo || '/default-company-logo.png',
    title: job.title,
    createdAt: job.created_at,
    roles: job.roles,
    types: [job.job_type],
    levels: [job.job_level],
    experience: `${job.experience_years} years`,
    location: job.city,
  }));

  const tabItems = [
    {
      key: 'overview',
      label: t('detail.tabs.overview'),
      children: <CompanyOverview company={company} />,
    },
    {
      key: 'reviews',
      label: t('detail.tabs.reviews'),
      children: (
        <CompanyReviews
          companyId={id}
          overallRating={company.rating}
          totalRatings={company.review_count}
          wouldRecommend={company.would_recommend}
          ceoPerformance={company.ceo_performance}
          categoryRatings={{
            compensation: company.category_ratings.compensation,
            culture: company.category_ratings.culture,
            workLife: company.category_ratings.work_life,
            diversity: company.category_ratings.diversity,
            management: company.category_ratings.management,
          }}
          reviews={company.reviews}
        />
      ),
    },
    {
      key: 'jobs',
      label: t('detail.tabs.jobs'),
      children: <CompanyJobs jobs={mappedJobs} />,
    },
    {
      key: 'directApply',
      label: t('detail.tabs.directApply'),
      children: <CompanyDirectApply companyId={id} companyName={company.name} />,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-80 bg-linear-to-r from-primary/20 to-primary/5">
        <Image
          src={company.cover_image || '/default-cover-image.png'}
          alt={`${company.name} cover`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Company Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-8">
          <div className="auth-card p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Company Logo */}
              <div className="w-32 h-32 relative rounded-xl overflow-hidden bg-card border-4 border-background shadow-lg shrink-0">
                <Image
                  src={company.logo || '/default-company-logo.png'}
                  alt={company.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <Typography variant="h1" className="text-foreground mb-2">
                  {company.name}
                </Typography>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={`fa-solid fa-star text-lg ${
                          index < Math.floor(company.rating)
                            ? 'text-warning'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <Typography variant="h5" className="text-muted-foreground">
                    {company.rating?.toFixed(1) || '0.0'} ({company.review_count || 0} reviews)
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pb-12">
          <ReusableTabs
            defaultValue="overview"
            tabTriggerValues={tabItems.map((item) => ({
              value: item.key,
              title: item.label,
            }))}
            tabContentValues={tabItems.map((item) => ({
              value: item.key,
              children: item.children,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
