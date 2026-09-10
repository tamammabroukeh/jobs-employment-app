
import JobCardHeader from "@/components/home/recent-jobs/JobCardHeader";
import JobCardBadges from "@/components/home/recent-jobs/JobCardBadges";
import JobCardDetails from "@/components/home/recent-jobs/JobCardDetails";
import JobCardFooter from "@/components/home/recent-jobs/JobCardFooter";

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
  tags: string[];
  experience: string;
  location: string;
  experienceLabel: string;
  postedOnLabel: string;
  applyNowLabel: string;
  /** Optional: skills from the seeker's resume that matched this job. */
  matchedSkills?: string[];
  /** Optional: label shown above matched skills (e.g. "Matched Skills"). */
  matchedSkillsLabel?: string;
  /** Optional: whether the seeker already applied to this job. */
  hasApplied?: boolean;
  /** Optional: label shown on the footer button when already applied. */
  appliedLabel?: string;
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
  experienceLabel,
  postedOnLabel,
  applyNowLabel,
  tags,
  matchedSkills,
  matchedSkillsLabel,
  hasApplied,
  appliedLabel,
}: JobCardClientProps) {

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
        <JobCardBadges
          tags={tags}
          roles={roles}
          types={types}
          levels={levels}
          matchedSkills={matchedSkills}
          matchedSkillsLabel={matchedSkillsLabel}
        />

        {/* Experience, Location, Posted Date */}
        <JobCardDetails
          experience={experience}
          location={location}
          createdAt={createdAt}
          experienceLabel={experienceLabel}
          postedOnLabel={postedOnLabel}
        />
      </div>

      {/* Footer: Apply Button */}
      <JobCardFooter
        jobId={id}
        applyNowLabel={applyNowLabel}
        hasApplied={hasApplied}
        appliedLabel={appliedLabel}
      />
    </div>
  );
}
