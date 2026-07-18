"use client";

import { useState, useEffect } from 'react';
import { Typography, ReusablePagination } from '@/components/Reusable-Components';
import { employerRepository } from '@/apis/services/employer';
import type { Candidate, CandidatesQueryParams } from '@/apis/services/employer/interface';
import { toast } from 'sonner';
import CandidatesFilters from './CandidatesFilters';
import CandidateCard from './CandidateCard';

export default function CandidatesClient() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10,
  });

  const [filters, setFilters] = useState<CandidatesQueryParams>({
    page: 1,
    per_page: 10,
  });

  const fetchCandidates = async (params: CandidatesQueryParams) => {
    try {
      setLoading(true);
      const response = await employerRepository.getCandidates(params);
      
      setCandidates(response.seekers.data);
      setPagination({
        currentPage: response.seekers.current_page,
        totalPages: response.seekers.last_page,
        total: response.seekers.total,
        perPage: response.seekers.per_page,
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<CandidatesQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Typography variant="h1" className="text-foreground mb-2">
            DISCOVER TOP TALENT
          </Typography>
          <Typography variant="p" className="text-muted-foreground">
            Browse and connect with qualified candidates for your open positions
          </Typography>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-64 shrink-0">
            <CandidatesFilters
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </aside>

          {/* Candidates List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-16">
                <i className="fa-solid fa-users text-6xl text-muted-foreground mb-4" />
                <Typography variant="h3" className="text-foreground mb-2">
                  No candidates found
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  Try adjusting your filters to see more results
                </Typography>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="mb-6">
                  <Typography variant="p" className="text-muted-foreground">
                    Showing {candidates.length} of {pagination.total} candidates
                  </Typography>
                </div>

                {/* Candidates Grid */}
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <ReusablePagination
                      currentPage={pagination.currentPage}
                      totalItems={pagination.total}
                      pageSize={pagination.perPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
