'use client';

import JobCardClient from './JobCardClient';
import { Typography } from '@/components/Reusable-Components';
import { useTypedTranslations } from '@/hooks/use-translations';
import ReusablePagination from '@/components/Reusable-Components/Reusable-Pagination';
import { MatchedJob } from '@/apis/services/job-seeker/interface';

interface Pagination {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}

interface MatchedJobsListProps {
  jobs: MatchedJob[];
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
}

export default function MatchedJobsList({ jobs, pagination, onPageChange }: MatchedJobsListProps) {
  const t = useTypedTranslations('jobs');

  // Get translation labels for job cards
  const experienceLabel = t('cardLabels.experience');
  const postedOnLabel = t('cardLabels.postedOn');
  const applyNowLabel = t('cardLabels.applyNow');

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

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.perPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.perPage, pagination.total) : jobs.length;
  const total = pagination?.total || jobs.length;

  return (
    <div>
      {/* Results Count */}
      <div className="mb-6">
        <Typography variant="p" className="text-muted-foreground">
          {t('showingResults', {
            start: startIndex,
            end: endIndex,
            total: total,
          })}
        </Typography>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {jobs.map((job) => (
          <div key={job.id} className="relative">
            {/* Match Score Badge */}
            <div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
              <i className="fa-solid fa-star text-xs" />
              {job.match_score}
            </div>
            
            <JobCardClient
              id={job.id}
              displayId={job.job_id}
              companyName={job.company_name}
              companyLogo={job.company_logo ?? ""}
              title={job.title}
              createdAt={job.created_at}
              roles={job.roles ? job.roles : []}
              types={job.job_type ? [job.job_type] : []}
              levels={job.experience_level ? [job.experience_level] : []}
              experience={job.experience_required ?? ""}
              location={job.location ?? ""}
              experienceLabel={experienceLabel}
              postedOnLabel={postedOnLabel}
              applyNowLabel={applyNowLabel}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <ReusablePagination
            currentPage={pagination.currentPage}
            totalItems={pagination.total}
            pageSize={pagination.perPage}
            onPageChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
