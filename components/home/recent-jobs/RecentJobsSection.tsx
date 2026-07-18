import { Typography, ReusableButton } from '@/components/Reusable-Components';
import Link from 'next/link';
import JobCard from './JobCard';
import ROUTES from '@/constants/routes';
import { getHomeTranslations } from '@/lib/get-translations';
import { Job, jobsRepository } from '@/apis/services/jobs';

export default async function RecentJobsSection() {
  const t = await getHomeTranslations();
  
  // Fetch recent jobs from API (limit to 9 jobs for homepage)
  let jobs:Job[] = [];
  try {
    const response = await jobsRepository.getJobs({ page: 1, per_page: 9 });
    console.log('response', response)
    jobs = response.data;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    // Show empty state or fallback UI if needed
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography variant="h2" className="text-foreground mb-4">
            {t('recentJobs.title')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground max-w-2xl mx-auto">
            {t('recentJobs.description')}
          </Typography>
        </div>
        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                displayId={job.job_id}
                companyName={job.company_name}
                companyLogo={job.company_logo}
                title={job.title}
                createdAt={job.created_at}
                roles={job.roles}
                types={job.job_type ? [job.job_type] : []}
                levels={job.job_level ? [job.job_level] : []}
                experience={job.experience_years ? `${job.experience_years}+ years` : 'fresh'}
                location={job.city}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Typography variant="p" className="text-muted-foreground">
                {t('recentJobs.noJobs')}
              </Typography>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href={`${ROUTES.JOB.LIST}`}>
            <ReusableButton
              variant="primary"
              size="large"
              className="px-8"
            >
              {t('recentJobs.viewAll')}
              <i className="fa-solid fa-arrow-right ml-2" />
            </ReusableButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
