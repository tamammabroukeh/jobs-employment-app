'use client';

import { useState, useCallback, useEffect } from 'react';
import MatchedJobsFilters, { MatchedJobsFiltersState } from './MatchedJobsFilters';
import MatchedJobsList from './MatchedJobsList';
import { jobSeekerRepository } from '@/apis/services/job-seeker';
import { MatchedJobsFilters as ApiFilters, MatchedJob } from '@/apis/services/job-seeker/interface';
import { Typography } from '@/components/Reusable-Components';

export default function MatchedJobsSection() {
  const [filters, setFilters] = useState<MatchedJobsFiltersState>({
    minScore: undefined,
  });

  const [jobs, setJobs] = useState<MatchedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10,
  });

  const fetchMatchedJobs = useCallback(async (searchFilters: MatchedJobsFiltersState, page: number = 1) => {
    setLoading(true);
    try {
      // Map frontend filters to API filters
      const apiFilters: ApiFilters = {};
      
      if (searchFilters.minScore !== undefined) apiFilters.min_score = searchFilters.minScore;
      apiFilters.page = page;

      const response = await jobSeekerRepository.getMatchedJobs(apiFilters);

      setJobs(response.data);
      setPagination({
        currentPage: response.current_page,
        totalPages: response.total_pages,
        total: response.total,
        perPage: response.per_page,
      });
      
    } catch (error) {
      console.error('Failed to fetch matched jobs:', error);
      setJobs([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        perPage: 10,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch - only once on mount
  useEffect(() => {
    fetchMatchedJobs(filters, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  const handleFiltersChange = useCallback((newFilters: MatchedJobsFiltersState) => {
    setFilters(newFilters);
    fetchMatchedJobs(newFilters, 1);
  }, [fetchMatchedJobs]);

  const handlePageChange = useCallback((page: number) => {
    fetchMatchedJobs(filters, page);
  }, [filters, fetchMatchedJobs]);

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <MatchedJobsFilters onFiltersChange={handleFiltersChange} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <Typography variant="p" className="mt-4 text-muted-foreground">
              Loading matched jobs...
            </Typography>
          </div>
        )}

        {/* Jobs List */}
        {!loading && (
          <MatchedJobsList 
            jobs={jobs} 
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}
