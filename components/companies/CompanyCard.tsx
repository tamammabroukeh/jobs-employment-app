'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Typography, ReusableButton } from '@/components/Reusable-Components';
import { useCompaniesTranslations } from '@/hooks/use-translations';

interface CompanyCardProps {
  id: string;
  name: string;
  logo: string | null;
  rating: number;
  reviewsCount: number;
  openJobs: number;
  location: string;
  companySize: string;
  description: string;
}

export default function CompanyCard({
  id,
  name,
  logo,
  rating,
  reviewsCount,
  openJobs,
  location,
  companySize,
  description,
}: CompanyCardProps) {
  const t = useCompaniesTranslations();

  return (
    <div className="auth-card p-6 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      {/* Company Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-background shrink-0">
          {logo && <Image
            src={logo}
            alt={name}
            width={80}
            height={80}
            className="object-contain"
          />}
        </div>
        <div className="flex-1 min-w-0">
          <Typography variant="h3" className="text-foreground group-hover:text-primary transition-colors mb-1">
            {name}
          </Typography>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`fa-solid fa-star text-sm ${
                    index < Math.floor(rating) ? 'text-warning' : 'text-muted-foreground/30'
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
        {/* Description */}
        <Typography variant="p" className="text-muted-foreground line-clamp-2">
          {description}
        </Typography>

        {/* Info Grid */}
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-sm text-primary" />
            <Typography variant="small" className="text-foreground">
              {location}
            </Typography>
          </div>

          {/* Company Size */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-users text-sm text-success" />
            <Typography variant="small" className="text-foreground">
              {companySize}
            </Typography>
          </div>

          {/* Open Jobs */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-briefcase text-sm text-warning" />
            <Typography variant="small" className="text-foreground">
              {openJobs} {t('cardLabels.openJobs')}
            </Typography>
          </div>
        </div>
      </div>

      {/* Footer: View Company Button */}
      <div className="pt-4 border-t border-border">
        <Link href={`/companies/${id}`} className="block">
          <ReusableButton variant="primary" className="w-full">
            {t('cardLabels.viewCompany')}
            <i className="fa-solid fa-arrow-right ml-2" />
          </ReusableButton>
        </Link>
      </div>
    </div>
  );
}
