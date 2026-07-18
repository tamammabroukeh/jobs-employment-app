"use client";

import { Typography } from "@/components/Reusable-Components";
import { useCompaniesTranslations } from "@/hooks/use-translations";
import Link from "next/link";
import type { ICompany } from "@/apis/services/companies/interface";

interface CompanyOverviewProps {
  company: ICompany;
}

export default function CompanyOverview({ company }: CompanyOverviewProps) {
  const t = useCompaniesTranslations();

  // Format location from city and country
  const location = [company.city, company.country].filter(Boolean).join(', ') || 'N/A';

  // Format company size for display
  const companySizeMap: Record<string, string> = {
    'less_than_10': 'Less than 10',
    '10_to_50': '10-50',
    '51_to_200': '51-200',
    '201_to_500': '201-500',
    '501_to_1000': '501-1000',
    'more_than_1000': 'More than 1000',
  };
  const formattedCompanySize = companySizeMap[company.company_size] || company.company_size;

  return (
    <div className="space-y-8">
      {/* About Section */}
      <div>
        <Typography variant="h3" className="text-foreground mb-4">
          {t("detail.overview.about")}
        </Typography>
        <Typography
          variant="p"
          className="text-muted-foreground leading-relaxed"
        >
          {company.description}
        </Typography>
      </div>

      {/* Company Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Founded */}
        {company.founded && (
          <div className="auth-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-calendar text-primary text-xl" />
              <Typography variant="h5" className="text-muted-foreground">
                {t("detail.overview.founded")}
              </Typography>
            </div>
            <Typography variant="h4" className="text-foreground">
              {company.founded}
            </Typography>
          </div>
        )}

        {/* Employees / Company Size */}
        <div className="auth-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-users text-success text-xl" />
            <Typography variant="h5" className="text-muted-foreground">
              {t("detail.overview.employees")}
            </Typography>
          </div>
          <Typography variant="h4" className="text-foreground">
            {company.employee_count || formattedCompanySize}
          </Typography>
        </div>

        {/* Location */}
        <div className="auth-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-location-dot text-warning text-xl" />
            <Typography variant="h5" className="text-muted-foreground">
              {t("detail.overview.location")}
            </Typography>
          </div>
          <Typography variant="h4" className="text-foreground">
            {location}
          </Typography>
        </div>

        {/* Website */}
        {company.website && (
          <div className="auth-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-globe text-info text-xl" />
              <Typography variant="h5" className="text-muted-foreground">
                {t("detail.overview.website")}
              </Typography>
            </div>
            <Link
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <Typography variant="h5">
                {t("detail.overview.visitWebsite")}
              </Typography>
            </Link>
          </div>
        )}

        {/* Email */}
        {company.email && (
          <div className="auth-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-envelope text-info text-xl" />
              <Typography variant="h5" className="text-muted-foreground">
                Email
              </Typography>
            </div>
            <Typography variant="h5" className="text-foreground break-all">
              {company.email}
            </Typography>
          </div>
        )}

        {/* Industry */}
        {company.industry && (
          <div className="auth-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-industry text-primary text-xl" />
              <Typography variant="h5" className="text-muted-foreground">
                {t("detail.overview.industry")}
              </Typography>
            </div>
            <Typography variant="h4" className="text-foreground">
              {company.industry}
            </Typography>
          </div>
        )}

        {/* Open Positions */}
        {company.open_positions !== undefined && company.open_positions > 0 && (
          <div className="auth-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-briefcase text-warning text-xl" />
              <Typography variant="h5" className="text-muted-foreground">
                {t("detail.overview.openPositions") || "Open Positions"}
              </Typography>
            </div>
            <Typography variant="h4" className="text-foreground">
              {company.open_positions}
            </Typography>
          </div>
        )}
      </div>

      {/* Social Media */}
      {company.social_media && (company.social_media.linkedin ||
        company.social_media.twitter ||
        company.social_media.facebook ||
        company.social_media.instagram) && (
        <div className="auth-card p-6">
          <Typography variant="h4" className="text-foreground mb-4">
            {t("detail.overview.socialMedia")}
          </Typography>
          <div className="flex items-center gap-4">
            {company.social_media.linkedin && (
              <Link
                href={company.social_media.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-linkedin text-primary text-xl" />
              </Link>
            )}
            {company.social_media.twitter && (
              <Link
                href={company.social_media.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-info/10 hover:bg-info/20 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-twitter text-info text-xl" />
              </Link>
            )}
            {company.social_media.facebook && (
              <Link
                href={company.social_media.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-facebook text-primary text-xl" />
              </Link>
            )}
            {company.social_media.instagram && (
              <Link
                href={company.social_media.instagram}
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
