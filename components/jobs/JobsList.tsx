'use client';

import { useState, useMemo } from 'react';
import JobCardClient from './JobCardClient';
import { Typography, ReusableButton } from '@/components/Reusable-Components';
import { useTypedTranslations } from '@/hooks/use-translations';
import type { JobFiltersState } from './JobFilters';

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

interface JobsListProps {
  jobs: Job[];
  filters: JobFiltersState;
}

export default function JobsList({ jobs, filters }: JobsListProps) {
  const t = useTypedTranslations('jobs');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Filter jobs based on filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(searchLower) ||
          job.companyName.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          job.roles.some((role) => role.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Job types filter
      if (filters.types.length > 0) {
        const hasMatchingType = job.types.some((type) =>
          filters.types.includes(type)
        );
        if (!hasMatchingType) return false;
      }

      // Cities filter
      if (filters.cities.length > 0) {
        const hasMatchingCity = filters.cities.includes(job.location);
        if (!hasMatchingCity) return false;
      }

      // Job roles filter
      if (filters.roles.length > 0) {
        const hasMatchingRole = job.roles.some((role) =>
          filters.roles.includes(role)
        );
        if (!hasMatchingRole) return false;
      }

      // Job levels filter
      if (filters.levels.length > 0) {
        const hasMatchingLevel = job.levels.some((level) =>
          filters.levels.includes(level)
        );
        if (!hasMatchingLevel) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (filteredJobs.length === 0) {
    return (
      <div className="text-center py-16">
        <i className="fa-solid fa-briefcase text-6xl text-muted-foreground mb-4" />
        <Typography variant="h3" className="text-foreground mb-2">
          {t('noJobsFound')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {t('noJobsDescription')}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-6">
        <Typography variant="p" className="text-muted-foreground">
          {t('showingResults', {
            start: startIndex + 1,
            end: Math.min(endIndex, filteredJobs.length),
            total: filteredJobs.length,
          })}
        </Typography>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {currentJobs.map((job) => (
          <JobCardClient
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <ReusableButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="default"
            iconOnly
            icon={<i className="fa-solid fa-chevron-left" />}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <ReusableButton
              key={page}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? 'primary' : 'default'}
            >
              {page}
            </ReusableButton>
          ))}

          <ReusableButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="default"
            iconOnly
            icon={<i className="fa-solid fa-chevron-right" />}
          />
        </div>
      )}
    </div>
  );
}
