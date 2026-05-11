'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Typography, ReusableBadge, ReusableButton } from '@/components/Reusable-Components';
import { useCompaniesTranslations } from '@/hooks/use-translations';
import ROUTES from '@/constants/routes';

interface CompanyDetailCardProps {
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

export default function CompanyDetailCard({
  id,
  name,
  logo,
  rating,
  reviewsCount,
  openJobs,
  location,
  companySize,
  description,
}: CompanyDetailCardProps) {
  const t = useCompaniesTranslations();

  const getCompanySizeText = () => {
    if (companySize.isPlus && companySize.min) {
      return `${companySize.min}${t('cardLabels.employeesPlus')}`;
    }
    if (companySize.min && companySize.max) {
      return `${companySize.min}-${companySize.max} ${t('cardLabels.employees')}`;
    }
    return `${companySize.min || 0} ${t('cardLabels.employees')}`;
  };

  return (
    <div className="auth-card p-6 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      {/* Header: Company Logo & Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted shrink-0">
          <Image
            src={logo}
            alt={name}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Typography
            variant="h3"
            className="text-foreground group-hover:text-primary transition-colors mb-2"
          >
            {name}
          </Typography>
          
          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`fa-solid fa-star text-sm ${
                    index < Math.floor(rating)
                      ? 'text-warning'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <Typography variant="small" className="text-muted-foreground">
              {rating.toFixed(1)} ({reviewsCount} {t('cardLabels.reviews')})
            </Typography>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="flex-1 space-y-3 mb-4">
        {/* Open Jobs Badge */}
        <div className="flex items-center gap-2">
          <ReusableBadge variant="success" size="md">
            <i className="fa-solid fa-briefcase mr-1" />
            {openJobs} {t('cardLabels.openJobs')}
          </ReusableBadge>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <i className="fa-solid fa-location-dot w-4" />
          <Typography variant="small">{location}</Typography>
        </div>

        {/* Company Size */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <i className="fa-solid fa-users w-4" />
          <Typography variant="small">
            {t('cardLabels.companySize')}: {getCompanySizeText()}
          </Typography>
        </div>

        {/* Description */}
        <Typography variant="small" className="text-muted-foreground line-clamp-3">
          {description}
        </Typography>
      </div>

      {/* Footer: View Company Button */}
      <Link href={`${ROUTES.COMPANIES.LIST}/${id}`} className="mt-auto">
        <ReusableButton
          variant="primary"
          className="w-full"
          size="large"
        >
          {t('cardLabels.viewCompany')}
          <i className="fa-solid fa-arrow-right ml-2" />
        </ReusableButton>
      </Link>
    </div>
  );
}
