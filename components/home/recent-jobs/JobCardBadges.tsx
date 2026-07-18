import { ReusableBadge } from "@/components/Reusable-Components";

interface JobCardBadgesProps {
  roles: string[];
  types: string[];
  levels: string[];
}

export default function JobCardBadges({ roles, types, levels }: JobCardBadgesProps) {
  console.log('roles', roles)
  console.log('types', roles)
  console.log('levels', levels)
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
      </div>
    </div>
  );
}
