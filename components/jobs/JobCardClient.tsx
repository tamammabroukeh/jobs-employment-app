'use client';

import JobCardHeader from "@/components/home/recent-jobs/JobCardHeader";
import JobCardBadges from "@/components/home/recent-jobs/JobCardBadges";
import JobCardDetails from "@/components/home/recent-jobs/JobCardDetails";
import JobCardFooter from "@/components/home/recent-jobs/JobCardFooter";
import { useJobsTranslations } from "@/hooks/use-translations";

interface JobCardClientProps {
  id: string;
  displayId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  createdAt: string;
  roles: string[];
  types: string[];
  levels: string[];
  experience: string;
  location: string;
}

export default function JobCardClient({
  id,
  companyName,
  companyLogo,
  title,
  createdAt,
  roles,
  types,
  levels,
  experience,
  location,
  displayId,
}: JobCardClientProps) {
  const t = useJobsTranslations();

  return (
    <div className="auth-card p-6 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      {/* Header: Company Logo & Info */}
      <JobCardHeader
        companyName={companyName}
        companyLogo={companyLogo}
        title={title}
        displayId={displayId}
      />

      {/* Job Details */}
      <div className="flex-1 space-y-3 mb-4">
        {/* Badges: Roles, Types, Levels */}
        <JobCardBadges roles={roles} types={types} levels={levels} />

        {/* Experience, Location, Posted Date */}
        <JobCardDetails
          experience={experience}
          location={location}
          createdAt={createdAt}
          experienceLabel={t("cardLabels.experience")}
          postedOnLabel={t("cardLabels.postedOn")}
        />
      </div>

      {/* Footer: Apply Button */}
      <JobCardFooter jobId={id} applyNowLabel={t("cardLabels.applyNow")} />
    </div>
  );
}
