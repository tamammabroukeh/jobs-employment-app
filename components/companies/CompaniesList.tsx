'use client';

import CompanyCard from './CompanyCard';
import { Typography } from '@/components/Reusable-Components';
import { ICompany } from '@/apis/services/companies/interface';

interface CompaniesListProps {
  companies: ICompany[];
}

// Helper function to format company size
function formatCompanySize(companySize: string): string {
  const sizeMap: Record<string, string> = {
    'less_than_10': '1-10 employees',
    '10-50': '10-50 employees',
    '51-200': '51-200 employees',
    '201-500': '201-500 employees',
    '501-1000': '501-1,000 employees',
    '1001-5000': '1,001-5,000 employees',
    '5001-10000': '5,001-10,000 employees',
    '10000+': '10,000+ employees',
    '100-500': '100-500 employees',
    '1000-5000': '1,000-5,000 employees',
    '5000-10000': '5,000-10,000 employees',
  };

  return sizeMap[companySize] || companySize;
}

// Helper function to format location
function formatLocation(city: string | null, country: string | null): string {
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return 'Location not specified';
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
          key={company._id}
          id={company._id}
          name={company.name}
          logo={company.logo}
          rating={company.rating || 0}
          reviewsCount={company.review_count || 0}
          openJobs={company.open_positions}
          location={formatLocation(company.city, company.country)}
          companySize={formatCompanySize(company.company_size)}
          description={company.description || 'No description available'}
        />
      ))}
    </div>
  );
}
