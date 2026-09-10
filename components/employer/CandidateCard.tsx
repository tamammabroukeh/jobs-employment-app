"use client";

import { Typography, ReusableBadge } from '@/components/Reusable-Components';
import Image from 'next/image';
import type { Candidate } from '@/apis/services/employer/interface';
import Link from 'next/link';
import { useCandidatesTranslations } from '@/hooks/use-translations';
import ROUTES from '@/constants/routes';

interface CandidateCardProps {
  candidate: Candidate;
  /** Optional: skills matched against a job description (AI candidate matching). */
  matchedSkills?: string[];
  /** Optional: relevance score shown as a badge (AI candidate matching). */
  matchScore?: number;
}

export default function CandidateCard({ candidate, matchedSkills, matchScore }: CandidateCardProps) {
  const t = useCandidatesTranslations();
  
  // Calculate age from date of birth
  const calculateAge = (dob?: string): number | null => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format salary range
  const formatSalary = (from: number, to: number): string => {
    if (from === to) return `${from}$`;
    if (from && to) return t('card.salary.range', { from, to });
    if (from) return t('card.salary.from', { amount: from });
    if (to) return t('card.salary.to', { amount: to });
    return t('card.salary.confidential');
  };

  const age = calculateAge(candidate.date_of_birth);
  const salary = formatSalary(candidate.salary_range_from, candidate.salary_range_to);
  const displayName = candidate.full_name || candidate.first_name || '';
  // Build a location string from whatever location fields are present.
  const locationParts = [candidate.city, candidate.location].filter(Boolean);
  const locationText = locationParts.join(', ');

  return (
    <Link 
      href={`${ROUTES.EMPLOYER.CANDIDATES}/${candidate.user_id}`}
      className="relative block auth-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Match Score Badge (AI candidate matching) */}
      {matchScore !== undefined && (
        <div className="absolute top-4 end-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
          <i className="fa-solid fa-star text-xs" />
          {matchScore}
        </div>
      )}
      <div className="flex gap-6">
        {/* Profile Image */}
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted relative">
            {candidate.image ? (
              <Image
                src={candidate.image}
                alt={candidate.full_name}
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

        {/* Candidate Info */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <Typography variant="h3" className="text-foreground mb-3">
            {displayName}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {/* Address */}
            {locationText && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <i className="fa-solid fa-location-dot w-4" />
                <span className="truncate">{t('card.address')}: {locationText}</span>
              </div>
            )}

            {/* Education Level */}
            {candidate.education_level && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <i className="fa-solid fa-graduation-cap w-4" />
                <span className="truncate">
                  {t('card.educationLevel')}: {candidate.education_level.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Salary */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-solid fa-money-bill w-4" />
              <span className="truncate">{t('card.salary.label')}: {salary}</span>
            </div>

            {/* Age */}
            {age !== null && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <i className="fa-solid fa-calendar w-4" />
                <span>{t('card.age')}: {age}</span>
              </div>
            )}
          </div>

          {/* Job Roles */}
          {candidate.job_roles && candidate.job_roles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {candidate.job_roles.slice(0, 5).map((role, index) => (
                <ReusableBadge key={index} variant="default">
                  {role}
                </ReusableBadge>
              ))}
              {candidate.job_roles.length > 5 && (
                <ReusableBadge variant="default">
                  +{candidate.job_roles.length - 5} {t('card.more')}
                </ReusableBadge>
              )}
            </div>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {candidate.skills.slice(0, 4).map((skill, index) => (
                <ReusableBadge key={index} variant="primary">
                  {skill.name} - {skill.level}
                </ReusableBadge>
              ))}
              {candidate.skills.length > 4 && (
                <ReusableBadge variant="primary">
                  +{candidate.skills.length - 4} {t('card.skills')}
                </ReusableBadge>
              )}
            </div>
          )}

          {/* Matched Skills (AI candidate matching) */}
          {matchedSkills && matchedSkills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-success mb-1">
                <i className="fa-solid fa-circle-check mr-1" />
                {t('card.matchedSkills')}
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, index) => (
                  <ReusableBadge key={index} variant="success">
                    {skill}
                  </ReusableBadge>
                ))}
              </div>
            </div>
          )}

          {/* Experience Summary */}
          {candidate.experience_summary && (
            <div className="mt-4">
              <Typography variant="p" className="text-muted-foreground line-clamp-2">
                {candidate.experience_summary}
              </Typography>
            </div>
          )}

          {/* Social Links */}
          {candidate.social_links && (
            <div className="mt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {candidate.social_links.linkedin && (
                <a
                  href={candidate.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fa-brands fa-linkedin text-xl" />
                </a>
              )}
              {candidate.social_links.github && (
                <a
                  href={candidate.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-foreground/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fa-brands fa-github text-xl" />
                </a>
              )}
              {candidate.social_links.portfolio && (
                <a
                  href={candidate.social_links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info hover:text-info/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fa-solid fa-globe text-xl" />
                </a>
              )}
              {candidate.social_links.twitter && (
                <a
                  href={candidate.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info hover:text-info/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fa-brands fa-twitter text-xl" />
                </a>
              )}
            </div>
          )}

          {/* Status Badge */}
          <div className="mt-4">
            {candidate.is_actively_seeking && (
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
