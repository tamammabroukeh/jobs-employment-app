"use client";

import { Typography, ReusableBadge } from '@/components/Reusable-Components';
import Image from 'next/image';
import type { Candidate } from '@/apis/services/employer/interface';
import Link from 'next/link';
import { useCandidatesTranslations } from '@/hooks/use-translations';
import ROUTES from '@/constants/routes';

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const t = useCandidatesTranslations();
  
  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
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

  return (
    <Link 
      href={`${ROUTES.EMPLOYER.CANDIDATES}/${candidate.user_id}`}
      className="block auth-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
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
            {candidate.full_name}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {/* Address */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-solid fa-location-dot w-4" />
              <span className="truncate">{t('card.address')}: {candidate.city}, {candidate.location}</span>
            </div>

            {/* Education Level */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-solid fa-graduation-cap w-4" />
              <span className="truncate">
                {t('card.educationLevel')}: {candidate.education_level.replace('_', ' ')}
              </span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-solid fa-money-bill w-4" />
              <span className="truncate">{t('card.salary.label')}: {salary}</span>
            </div>

            {/* Age */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-solid fa-calendar w-4" />
              <span>{t('card.age')}: {age}</span>
            </div>
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
