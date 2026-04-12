import { getTranslations } from "@/lib/get-translations";
import JobCardHeader from "./JobCardHeader";
import JobCardBadges from "./JobCardBadges";
import JobCardDetails from "./JobCardDetails";
import JobCardFooter from "./JobCardFooter";

interface JobCardProps {
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

export default async function JobCard({
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
}: JobCardProps) {
  const t = await getTranslations("home.recentJobs");

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
          experienceLabel={t("experience")}
          postedOnLabel={t("postedOn")}
        />
      </div>

      {/* Footer: Apply Button */}
      <JobCardFooter jobId={id} applyNowLabel={t("applyNow")} />
    </div>
  );
}
