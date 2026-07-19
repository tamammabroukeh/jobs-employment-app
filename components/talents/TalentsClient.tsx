"use client";

import { useState, useEffect } from 'react';
import { Typography, ReusablePagination } from '@/components/Reusable-Components';
import { searchRepository } from '@/apis/services/search';
import type { Talent, TalentSearchFilters } from '@/apis/services/search/interface';
import { toast } from 'sonner';
import TalentsFilters from './TalentsFilters';
import TalentCard from './TalentCard';
import { useTypedTranslations } from '@/hooks/use-translations';

export default function TalentsClient() {
  const t = useTypedTranslations('talents');
  
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 15,
  });

  const [filters, setFilters] = useState<TalentSearchFilters>({
    page: 1,
    per_page: 15,
  });

  const fetchTalents = async (params: TalentSearchFilters) => {
    try {
      setLoading(true);
      const response = await searchRepository.searchTalents(params);
      console.log('response', response)
      setTalents(response.data);
      setPagination({
        currentPage: response.current_page,
        totalPages: response.total_pages,
        total: response.total,
        perPage: response.per_page,
      });
    } catch (error) {
      console.error('Error fetching talents:', error);
      toast.error(t('errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: TalentSearchFilters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
      per_page: 15,
    });
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
            {t('pageTitle')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground">
            {t('pageDescription')}
          </Typography>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-64 shrink-0">
            <TalentsFilters
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </aside>

          {/* Talents List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : talents.length === 0 ? (
              <div className="text-center py-16">
                <i className="fa-solid fa-users text-6xl text-muted-foreground mb-4" />
                <Typography variant="h3" className="text-foreground mb-2">
                  {t('noResults.title')}
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  {t('noResults.description')}
                </Typography>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="mb-6">
                  <Typography variant="p" className="text-muted-foreground">
                    {t('resultsCount', {
                      count: talents.length,
                      total: pagination.total,
                    })}
                  </Typography>
                </div>

                {/* Talents Grid */}
                <div className="space-y-4">
                  {talents.map((talent) => (
                    <TalentCard key={talent.id} talent={talent} />
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
