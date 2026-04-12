'use client';

import { ReusableCarousel } from '@/components/Reusable-Components';
import CompanyCard from './CompanyCard';

interface Company {
  id: string;
  name: string;
  logo: string;
  employees?: number;
  openPositions?: number;
}

interface TopCompaniesCarouselProps {
  companies: Company[];
}

export default function TopCompaniesCarousel({ 
  companies, 
}: TopCompaniesCarouselProps) {
  return (
    <ReusableCarousel showArrows={true}>
      {companies.map((company) => (
        <div key={company.id} className="px-3">
          <CompanyCard
            id={company.id}
            name={company.name}
            logo={company.logo}
          />
        </div>
      ))}
    </ReusableCarousel>
  );
}
