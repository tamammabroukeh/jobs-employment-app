"use client";

import { Typography, ReusableBadge } from '@/components/Reusable-Components';
import Image from 'next/image';
import type { Talent } from '@/apis/services/search/interface';
import Link from 'next/link';
import { useTypedTranslations } from '@/hooks/use-translations';
import ROUTES from '@/constants/routes';

interface TalentCardProps {
  talent: Talent;
}

export default function TalentCard({ talent }: TalentCardProps) {
  const t = useTypedTranslations('talents');
  
  // Format salary range
  const formatSalary = (): string => {
    if (!talent.salary_range_from && !talent.salary_range_to) {
      return t('card.salary.notSpecified');
    }
    if (talent.salary_range_from === talent.salary_range_to) {
      return `$${talent.salary_range_from}`;
    }
    if (talent.salary_range_from && talent.salary_range_to) {
      return `$${talent.salary_range_from} - $${talent.salary_range_to}`;
    }
    if (talent.salary_range_from) {
      return t('card.salary.from', { amount: talent.salary_range_from });
    }
    if (talent.salary_range_to) {
      return t('card.salary.to', { amount: talent.salary_range_to });
    }
    return t('card.salary.notSpecified');
  };

  const salary = formatSalary();

  return (
    <Link 
      href={ROUTES.TALENTS.getDetail(talent.user_id)}
      className="block auth-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex gap-6">
        {/* Profile Image */}
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted relative">
            {talent.image ? (
              <Image
                src={talent.image}
                alt={talent.full_name || talent.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <i className="fa-solid fa-user text-4xl text-primary/50" />
              </div>
            )}
          </div>
        </div>

        {/* Talent Info */}
        <div className="flex-1 min-w-0">
          {/* Name & Title */}
          <div className="mb-3">
            <Typography variant="h3" className="text-foreground mb-1">
              {talent.full_name || talent.name}
            </Typography>
            {talent.current_job_title && (
              <Typography variant="p" className="text-muted-foreground">
                {talent.current_job_title}
              </Typography>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
            {/* Location */}
            {(talent.city || talent.location) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <i className="fa-solid fa-location-dot w-4" />
                <span className="truncate">
                  {talent.city && talent.location 
                    ? `${talent.city}, ${talent.location}` 
                    : talent.city || talent.location}
                </span>
              </div>
            )}

            {/* Experience */}
            {talent.years_of_experience !== undefined && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <i className="fa-solid fa-briefcase w-4" />
                <span>
                  {talent.years_of_experience} {t('card.yearsExperience')}
                </span>
              </div>
            )}

            {/* Education Level */}
            {talent.education_level && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <i className="fa-solid fa-graduation-cap w-4" />
                <span className="truncate capitalize">
                  {talent.education_level.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Salary */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-solid fa-money-bill w-4" />
              <span className="truncate">{salary}</span>
            </div>
          </div>

          {/* Job Roles */}
          {talent.job_roles && talent.job_roles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {talent.job_roles.slice(0, 5).map((role, index) => (
                <ReusableBadge key={index} variant="default">
                  {role}
                </ReusableBadge>
              ))}
              {talent.job_roles.length > 5 && (
                <ReusableBadge variant="default">
                  +{talent.job_roles.length - 5} {t('card.more')}
                </ReusableBadge>
              )}
            </div>
          )}

          {/* Skills */}
          {talent.skills && talent.skills.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {talent.skills.slice(0, 4).map((skill, index) => (
                <ReusableBadge key={index} variant="primary">
                  {skill.name}
                </ReusableBadge>
              ))}
              {talent.skills.length > 4 && (
                <ReusableBadge variant="primary">
                  +{talent.skills.length - 4} {t('card.moreSkills')}
                </ReusableBadge>
              )}
            </div>
          )}

          {/* Experience Summary */}
          {talent.experience_summary && (
            <div className="mb-3">
              <Typography variant="p" className="text-muted-foreground line-clamp-2">
                {talent.experience_summary}
              </Typography>
            </div>
          )}

          {/* Social Links & Status */}
          <div className="flex items-center justify-between">
            {/* Social Links */}
            {talent.social_links && (
              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                {talent.social_links.linkedin && (
                  <a
                    href={talent.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fa-brands fa-linkedin text-xl" />
                  </a>
                )}
                {talent.social_links.github && (
                  <a
                    href={talent.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-foreground/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fa-brands fa-github text-xl" />
                  </a>
                )}
                {talent.social_links.portfolio && (
                  <a
                    href={talent.social_links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-info hover:text-info/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fa-solid fa-globe text-xl" />
                  </a>
                )}
              </div>
            )}

            {/* Status Badge */}
            {talent.is_actively_seeking && (
              <ReusableBadge variant="success">
                <i className="fa-solid fa-circle-check mr-1" />
                {t('card.activelySeeking')}
              </ReusableBadge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
