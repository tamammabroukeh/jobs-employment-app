'use client';

import CompanyCard from './CompanyCard';
import { Typography } from '@/components/Reusable-Components';
import { ICompany } from '@/apis/services/companies/interface';

interface CompaniesListProps {
  companies: ICompany[];
}

// Helper function to format company size
function formatCompanySize(companySize: string, sizeRange: { min: number; max?: number; isPlus: boolean }): string {
  if (sizeRange.isPlus) {
    return `${sizeRange.min}+ employees`;
  }
  if (sizeRange.max) {
    return `${sizeRange.min}-${sizeRange.max} employees`;
  }
  return companySize;
}

export default function CompaniesList({ companies }: CompaniesListProps) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <i className="fa-solid fa-building text-2xl text-muted-foreground" />
        </div>
        <Typography variant="h3" className="text-foreground mb-2">
          No companies found
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          Try adjusting your search or filters
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          id={company.id}
          name={company.name}
          logo={company.logo}
          rating={company.rating}
          reviewsCount={company.review_count}
          openJobs={company.open_positions}
          location={company.location}
          companySize={formatCompanySize(company.company_size, company.company_size_range)}
          description={company.description}
        />
      ))}
    </div>
  );
}
