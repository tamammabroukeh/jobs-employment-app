import { getCompaniesTranslations } from '@/lib/get-translations';
import { Typography, ReusableTabs } from '@/components/Reusable-Components';
import Image from 'next/image';
import { Metadata } from 'next';
import CompanyOverview from '@/components/companies/detail/CompanyOverview';
import CompanyReviews from '@/components/companies/detail/CompanyReviews';
import CompanyJobs from '@/components/companies/detail/CompanyJobs';
import CompanyDirectApply from '@/components/companies/detail/CompanyDirectApply';

// Mock data - Replace with actual API call
const mockCompanyData = {
  id: '1',
  name: 'Google',
  logo: 'https://logo.clearbit.com/google.com',
  coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop',
  rating: 4.5,
  reviewsCount: 1250,
  description:
    'Google is a multinational technology company that specializes in Internet-related services and products, including search, cloud computing, and advertising technologies. Founded in 1998, Google has grown to become one of the most influential companies in the world, shaping how billions of people access and interact with information online.',
  founded: '1998',
  employeeCount: '100,000+ employees',
  location: 'Mountain View, CA',
  website: 'https://www.google.com',
  socialMedia: {
    linkedin: 'https://www.linkedin.com/company/google',
    twitter: 'https://twitter.com/Google',
    facebook: 'https://www.facebook.com/Google',
    instagram: 'https://www.instagram.com/google',
  },
  overallRating: 4.5,
  totalRatings: 1250,
  wouldRecommend: 85,
  ceoPerformance: 92,
  categoryRatings: {
    compensation: 4.2,
    culture: 4.6,
    workLife: 4.1,
    diversity: 4.4,
    management: 4.3,
  },
  reviews: [
    {
      id: '1',
      rating: 4,
      userName: 'John Doe',
      date: '27/01/2026',
      position: 'Former employee, last year at 2022',
      recommend: false,
      ceoApproval: true,
      subratings: {
        compensation: 4,
        culture: 4,
        workLife: 3,
        diversity: 5,
        management: 3,
      },
      agrees: 5,
      disagrees: 2,
    },
    {
      id: '2',
      rating: 5,
      userName: 'Jane Smith',
      date: '15/01/2026',
      position: 'Current employee, 3 years',
      recommend: true,
      ceoApproval: true,
      subratings: {
        compensation: 5,
        culture: 5,
        workLife: 4,
        diversity: 5,
        management: 5,
      },
      agrees: 12,
      disagrees: 1,
    },
  ],
  jobs: [
    {
      id: '1',
      displayId: 'JOB-001',
      companyName: 'Google',
      companyLogo: 'https://logo.clearbit.com/google.com',
      title: 'Senior Frontend Developer',
      createdAt: '2024-01-15',
      roles: ['Frontend', 'React'],
      types: ['Full-time', 'Remote'],
      levels: ['Senior'],
      experience: '5+ years',
      location: 'San Francisco, CA',
    },
    {
      id: '2',
      displayId: 'JOB-002',
      companyName: 'Google',
      companyLogo: 'https://logo.clearbit.com/google.com',
      title: 'Backend Engineer',
      createdAt: '2024-01-14',
      roles: ['Backend', 'Node.js'],
      types: ['Full-time', 'Hybrid'],
      levels: ['Mid-level'],
      experience: '3-5 years',
      location: 'Mountain View, CA',
    },
    {
      id: '3',
      displayId: 'JOB-003',
      companyName: 'Google',
      companyLogo: 'https://logo.clearbit.com/google.com',
      title: 'Product Manager',
      createdAt: '2024-01-13',
      roles: ['Product', 'Management'],
      types: ['Full-time', 'On-site'],
      levels: ['Senior'],
      experience: '5+ years',
      location: 'New York, NY',
    },
  ],
};

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CompanyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  // In real app, fetch company data based on id
  const company = mockCompanyData;

  return {
    title: `${company.name} - Company Profile`,
    description: company.description,
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const t = await getCompaniesTranslations();

  // In real app, fetch company data based on id
  const company = mockCompanyData;

  const tabItems = [
    {
      key: 'overview',
      label: t('detail.tabs.overview'),
      children: (
        <CompanyOverview
          description={company.description}
          founded={company.founded}
          employeeCount={company.employeeCount}
          location={company.location}
          website={company.website}
          socialMedia={company.socialMedia}
        />
      ),
    },
    {
      key: 'reviews',
      label: t('detail.tabs.reviews'),
      children: (
        <CompanyReviews
          companyId={id}
          overallRating={company.overallRating}
          totalRatings={company.totalRatings}
          wouldRecommend={company.wouldRecommend}
          ceoPerformance={company.ceoPerformance}
          categoryRatings={company.categoryRatings}
          reviews={company.reviews}
        />
      ),
    },
    {
      key: 'jobs',
      label: t('detail.tabs.jobs'),
      children: <CompanyJobs jobs={company.jobs} />,
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
      <div className="relative w-full h-64 md:h-80 bg-gradient-to-r from-primary/20 to-primary/5">
        <Image
          src={company.coverImage}
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
                  src={company.logo}
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
                    {company.rating.toFixed(1)} ({company.reviewsCount} reviews)
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
