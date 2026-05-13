'use client';

import { Typography } from '@/components/Reusable-Components';
import { useCompaniesTranslations } from '@/hooks/use-translations';
import Link from 'next/link';

interface CompanyOverviewProps {
  description: string;
  founded: string;
  employeeCount: string;
  location: string;
  website: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export default function CompanyOverview({
  description,
  founded,
  employeeCount,
  location,
  website,
  socialMedia,
}: CompanyOverviewProps) {
  const t = useCompaniesTranslations();

  return (
    <div className="space-y-8">
      {/* About Section */}
      <div>
        <Typography variant="h3" className="text-foreground mb-4">
          {t('detail.overview.about')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground leading-relaxed">
          {description}
        </Typography>
      </div>

      {/* Company Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Founded */}
        <div className="auth-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-calendar text-primary text-xl" />
            <Typography variant="h5" className="text-muted-foreground">
              {t('detail.overview.founded')}
            </Typography>
          </div>
          <Typography variant="h4" className="text-foreground">
            {founded}
          </Typography>
        </div>

        {/* Employees */}
        <div className="auth-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-users text-success text-xl" />
            <Typography variant="h5" className="text-muted-foreground">
              {t('detail.overview.employees')}
            </Typography>
          </div>
          <Typography variant="h4" className="text-foreground">
            {employeeCount}
          </Typography>
        </div>

        {/* Location */}
        <div className="auth-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-location-dot text-warning text-xl" />
            <Typography variant="h5" className="text-muted-foreground">
              {t('detail.overview.location')}
            </Typography>
          </div>
          <Typography variant="h4" className="text-foreground">
            {location}
          </Typography>
        </div>

        {/* Website */}
        <div className="auth-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-globe text-info text-xl" />
            <Typography variant="h5" className="text-muted-foreground">
              {t('detail.overview.website')}
            </Typography>
          </div>
          <Link
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            <Typography variant="h5">{t('detail.overview.visitWebsite')}</Typography>
          </Link>
        </div>
      </div>

      {/* Social Media */}
      {(socialMedia.linkedin || socialMedia.twitter || socialMedia.facebook || socialMedia.instagram) && (
        <div className="auth-card p-6">
          <Typography variant="h4" className="text-foreground mb-4">
            {t('detail.overview.socialMedia')}
          </Typography>
          <div className="flex items-center gap-4">
            {socialMedia.linkedin && (
              <Link
                href={socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-linkedin text-primary text-xl" />
              </Link>
            )}
            {socialMedia.twitter && (
              <Link
                href={socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-info/10 hover:bg-info/20 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-twitter text-info text-xl" />
              </Link>
            )}
            {socialMedia.facebook && (
              <Link
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-facebook text-primary text-xl" />
              </Link>
            )}
            {socialMedia.instagram && (
              <Link
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-warning/10 hover:bg-warning/20 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-instagram text-warning text-xl" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
