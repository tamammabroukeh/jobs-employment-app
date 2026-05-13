import { Typography } from '@/components/Reusable-Components';
import JobCard from '@/components/home/recent-jobs/JobCard';
import { getTranslations } from '@/lib/get-translations';

interface Job {
  id: string;
  displayId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  createdAt: string;
  roles: string[];
  types: string[];
  levels: string[];
  experience: string;
  location: string;
}

interface CompanyJobsProps {
  jobs: Job[];
}

export default async function CompanyJobs({ jobs }: CompanyJobsProps) {
  const t = await getTranslations("companies");

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <i className="fa-solid fa-briefcase text-6xl text-muted-foreground mb-4" />
        <Typography variant="h3" className="text-foreground mb-2">
          {t('detail.jobs.noJobs')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {t('detail.jobs.noJobsDescription')}
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <Typography variant="h3" className="text-foreground mb-2">
          {t('detail.jobs.title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {t('detail.jobs.description')}
        </Typography>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            displayId={job.displayId}
            companyName={job.companyName}
            companyLogo={job.companyLogo}
            title={job.title}
            createdAt={job.createdAt}
            roles={job.roles}
            types={job.types}
            levels={job.levels}
            experience={job.experience}
            location={job.location}
          />
        ))}
      </div>
    </div>
  );
}
