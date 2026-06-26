'use client';

import { useState } from 'react';
import { Typography } from '@/components/Reusable-Components';
import type { CompanyProfile } from '@/apis/services/employer';
import CompanyInfoSection from './CompanyInfoSection';

interface EmployerProfileClientProps {
  initialData: CompanyProfile | null;
}

export default function EmployerProfileClient({ initialData }: EmployerProfileClientProps) {
  const [companyData, setCompanyData] = useState<CompanyProfile | null>(initialData);
  console.log('companyData', companyData)
  const handleUpdate = (updatedData: CompanyProfile) => {
    setCompanyData(updatedData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-foreground mb-2">
          Company Profile
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          Manage your company information and settings
        </Typography>
      </div>

      {/* Company Info Section */}
      <CompanyInfoSection 
        initialData={companyData} 
        onUpdate={handleUpdate}
      />

      {/* Statistics Section */}
      {companyData && (
        <div className="auth-card p-6 mt-6">
          <Typography variant="h2" className="text-foreground mb-6">
            Company Statistics
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {companyData.open_positions}
              </div>
              <Typography variant="small" className="text-muted-foreground">
                Open Positions
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {companyData.rating.toFixed(1)}
              </div>
              <Typography variant="small" className="text-muted-foreground">
                Average Rating
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {companyData.review_count}
              </div>
              <Typography variant="small" className="text-muted-foreground">
                Total Reviews
              </Typography>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {companyData.would_recommend}%
              </div>
              <Typography variant="small" className="text-muted-foreground">
                Would Recommend
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Category Ratings Section */}
      {companyData && companyData.review_count > 0 && (
        <div className="auth-card p-6 mt-6">
          <Typography variant="h2" className="text-foreground mb-6">
            Category Ratings
          </Typography>
          
          <div className="space-y-4">
            {Object.entries(companyData.category_ratings).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <Typography variant="p" className="text-foreground capitalize">
                    {key.replace('_', ' ')}
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
