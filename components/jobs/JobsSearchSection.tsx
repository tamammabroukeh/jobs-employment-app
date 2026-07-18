'use client';

import { useState, useCallback, useEffect } from 'react';
import JobFilters, { JobFiltersState } from './JobFilters';
import JobsList from './JobsList';
import { jobSeekerRepository } from '@/apis/services/job-seeker';
import { JobSearchFilters } from '@/apis/services/job-seeker/interface';
import { Typography } from '@/components/Reusable-Components';
import { Job } from '@/apis/services/jobs';
import { useSearchParams } from '@/hooks/useSearchParams';


export default function JobsSearchSection() {
  const { getParam } = useSearchParams()
  const searchParam = getParam("search")
  const [filters, setFilters] = useState<JobFiltersState>({
    search: searchParam ?? '',
    jobType: '',
    location: '',
    category: '',
    minSalary: undefined,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 15,
  });

  const fetchJobs = useCallback(async (searchFilters: JobFiltersState, page: number = 1) => {
    setLoading(true);
    try {
      // Map frontend filters to API filters
      const apiFilters: JobSearchFilters = {};
      
      if (searchFilters.search) apiFilters.keyword = searchFilters.search;
      if (searchFilters.location) apiFilters.location = searchFilters.location;
      if (searchFilters.jobType) apiFilters.job_type = searchFilters.jobType;
      if (searchFilters.category) apiFilters.category = searchFilters.category;
      if (searchFilters.minSalary) apiFilters.min_salary = searchFilters.minSalary;
      apiFilters.page = page;

      const response = await jobSeekerRepository.searchJobs(apiFilters);
      console.log('response', response)

      setJobs(response.jobs.data);
      setPagination({
        currentPage: response.jobs.current_page,
        totalPages: response.jobs.last_page,
        total: response.jobs.total,
        perPage: response.jobs.per_page,
      });
      
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        perPage: 15,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch - only once on mount
  useEffect(() => {
    fetchJobs(filters, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  const handleFiltersChange = useCallback((newFilters: JobFiltersState) => {
    setFilters(newFilters);
    fetchJobs(newFilters, 1);
  }, [fetchJobs]);

  const handlePageChange = useCallback((page: number) => {
    fetchJobs(filters, page);
  }, [filters, fetchJobs]);

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <JobFilters onFiltersChange={handleFiltersChange} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <Typography variant="p" className="mt-4 text-muted-foreground">
              Loading jobs...
            </Typography>
          </div>
        )}

        {/* Jobs List */}
        {!loading && (
          <JobsList 
            jobs={jobs} 
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}
