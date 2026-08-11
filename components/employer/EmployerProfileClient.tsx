'use client';

import { useState } from 'react';
import { Typography } from '@/components/Reusable-Components';
import type { CompanyProfile } from '@/apis/services/employer';
import CompanyImagesSection from './CompanyImagesSection';
import CompanyPublicInfoSection from './CompanyPublicInfoSection';
import CompanyPrivateInfoSection from './CompanyPrivateInfoSection';
import { useEmployerProfileTranslations } from '@/hooks/use-translations';

interface EmployerProfileClientProps {
  initialData: CompanyProfile | null;
}

export default function EmployerProfileClient({ initialData }: EmployerProfileClientProps) {
  const [companyData, setCompanyData] = useState<CompanyProfile | null>(initialData);
  const t = useEmployerProfileTranslations();

  const handleUpdate = (updatedData: CompanyProfile) => {
    setCompanyData(updatedData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-foreground mb-2">
          {t('header.title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {t('header.description')}
        </Typography>
      </div>

      {/* Company Images Section */}
      <CompanyImagesSection 
        logo={companyData?.logo}
        coverImage={companyData?.cover_image}
      />

      {/* Company Public Info Section */}
      <CompanyPublicInfoSection 
        initialData={companyData} 
        onUpdate={handleUpdate}
      />

      {/* Company Private Info Section */}
      <CompanyPrivateInfoSection 
        initialData={companyData} 
        onUpdate={handleUpdate}
      />

      {/* Statistics Section */}
      {companyData && (
        <div className="auth-card p-6 mt-6">
          <Typography variant="h2" className="text-foreground mb-6">
            {t('statistics.title')}
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {companyData.open_positions}
              </div>
              <Typography variant="small" className="text-muted-foreground">
                {t('statistics.openPositions')}
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {companyData.rating.toFixed(1)}
              </div>
              <Typography variant="small" className="text-muted-foreground">
                {t('statistics.averageRating')}
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {companyData.review_count}
              </div>
              <Typography variant="small" className="text-muted-foreground">
                {t('statistics.totalReviews')}
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {companyData.would_recommend}%
              </div>
              <Typography variant="small" className="text-muted-foreground">
                {t('statistics.wouldRecommend')}
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Category Ratings Section */}
      {companyData && companyData.review_count > 0 && (
        <div className="auth-card p-6 mt-6">
          <Typography variant="h2" className="text-foreground mb-6">
            {t('categoryRatings.title')}
          </Typography>
          
          <div className="space-y-4">
            {Object.entries(companyData.category_ratings).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <Typography variant="p" className="text-foreground capitalize">
                    {t(`categoryRatings.${key}` as any)}
                  </Typography>
                  <Typography variant="p" className="text-primary font-semibold">
                    {value.toFixed(1)}/5
                  </Typography>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${(value / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
