'use client';

import { useState, useMemo } from 'react';
import CompanyDetailCard from './CompanyDetailCard';
import { Typography, ReusableButton } from '@/components/Reusable-Components';
import { useCompaniesTranslations } from '@/hooks/use-translations';

interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewsCount: number;
  openJobs: number;
  location: string;
  companySize: {
    min?: number;
    max?: number;
    isPlus?: boolean;
  };
  description: string;
}

interface CompaniesListProps {
  companies: Company[];
  searchQuery: string;
}

export default function CompaniesList({ companies, searchQuery }: CompaniesListProps) {
  const t = useCompaniesTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 9;

  // Filter companies based on search query
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;

    const searchLower = searchQuery.toLowerCase();
    return companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(searchLower) ||
        company.location.toLowerCase().includes(searchLower) ||
        company.description.toLowerCase().includes(searchLower)
      );
    });
  }, [companies, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;
  const endIndex = startIndex + companiesPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (filteredCompanies.length === 0) {
    return (
      <div className="text-center py-16">
        <i className="fa-solid fa-building text-6xl text-muted-foreground mb-4" />
        <Typography variant="h3" className="text-foreground mb-2">
          {t('noCompaniesFound')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {t('noCompaniesDescription')}
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
            end: Math.min(endIndex, filteredCompanies.length),
            total: filteredCompanies.length,
          })}
        </Typography>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {currentCompanies.map((company) => (
          <CompanyDetailCard
            key={company.id}
            id={company.id}
            name={company.name}
            logo={company.logo}
            rating={company.rating}
            reviewsCount={company.reviewsCount}
            openJobs={company.openJobs}
            location={company.location}
            companySize={company.companySize}
            description={company.description}
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
