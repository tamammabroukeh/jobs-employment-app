import { ReusableBadge } from "@/components/Reusable-Components";

interface JobCardBadgesProps {
  roles: string[];
  types: string[];
  levels: string[];
  tags: string[];
  /** Optional: skills from the seeker's resume that matched this job. */
  matchedSkills?: string[];
  /** Optional: label rendered above the matched skills. */
  matchedSkillsLabel?: string;
}

export default function JobCardBadges({ roles, types, levels, tags, matchedSkills, matchedSkillsLabel }: JobCardBadgesProps) {
  return (
    <div className="space-y-3">
      {/* Roles */}
      {roles?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {roles.map((role, index) => (
            <ReusableBadge key={index} variant="primary">
              {role}
            </ReusableBadge>
          ))}
        </div>
      )}

      {/* Matched Skills (from resume) */}
      {matchedSkills && matchedSkills.length > 0 && (
        <div className="space-y-1">
          {matchedSkillsLabel && (
            <p className="text-xs font-medium text-success">
              <i className="fa-solid fa-circle-check mr-1" />
              {matchedSkillsLabel}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <ReusableBadge key={index} variant="success">
                {skill}
              </ReusableBadge>
            ))}
          </div>
        </div>
      )}

      {/* Types & Levels */}
      <div className="flex flex-wrap gap-2">
        {types?.length > 0 && types.map((type, index) => (
          <ReusableBadge key={index} variant="success">
            {type.replace(/_/g, ' ')}
          </ReusableBadge>
        ))}
        {levels?.length > 0 && levels.map((level, index) => (
          <ReusableBadge key={index} variant="warning">
            {level?.replace(/_/g, ' ')}
          </ReusableBadge>
        ))}
        {tags?.length > 0 && tags.map((tag, index) => (
          <ReusableBadge key={index} variant="danger">
            {tag?.replace(/_/g, ' ')}
          </ReusableBadge>
        ))}
      </div>
    </div>
  );
}
