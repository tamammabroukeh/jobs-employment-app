import JobCardClient from './JobCardClient';
import { Typography } from '@/components/Reusable-Components';
import { MatchedJob } from '@/apis/services/job-seeker/interface';
import { getJobsTranslations } from '@/lib/get-translations';

interface MatchedJobsListProps {
  jobs: MatchedJob[];
}

export default async function MatchedJobsList({ jobs }: MatchedJobsListProps) {
  const t = await getJobsTranslations();

  // Get translation labels for job cards
  const experienceLabel = t('cardLabels.experience');
  const postedOnLabel = t('cardLabels.postedOn');
  const applyNowLabel = t('cardLabels.applyNow');
  const appliedLabel = t('cardLabels.applied');
  const matchedSkillsLabel = t('matchedJobs.matchedSkills');

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <i className="fa-solid fa-bullseye text-6xl text-muted-foreground mb-4" />
        <Typography variant="h3" className="text-foreground mb-2">
          {t('matchedJobs.noMatchesFound')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {t('matchedJobs.noMatchesDescription')}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-6">
        <Typography variant="p" className="text-muted-foreground">
          {t('matchedJobs.matchesFound', { count: jobs.length })}
        </Typography>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {jobs.map((job) => {
          const experience =
            job.experience_years !== undefined && job.experience_years !== null
              ? String(job.experience_years)
              : '';

          return (
            <div key={job.id} className="relative">
              {/* Match Score Badge */}
              <div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                <i className="fa-solid fa-star text-xs" />
                {job.matched_skills_score}
              </div>

              <JobCardClient
                id={job.id}
                displayId={job.job_id ?? job.id}
                tags={job.tags ?? []}
                companyName={job.company?.name ?? job.company_name}
                companyLogo={job.company?.logo ?? job.company_logo ?? ''}
                title={job.title}
                createdAt={job.created_at}
                roles={job.roles ?? []}
                types={job.job_type ? [job.job_type] : []}
                levels={job.job_level ? [job.job_level] : []}
                experience={experience}
                location={job.city ?? job.address ?? ''}
                experienceLabel={experienceLabel}
                postedOnLabel={postedOnLabel}
                applyNowLabel={applyNowLabel}
                matchedSkills={job.matched_skills ?? []}
                matchedSkillsLabel={matchedSkillsLabel}
                hasApplied={job.has_applied}
                appliedLabel={appliedLabel}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
