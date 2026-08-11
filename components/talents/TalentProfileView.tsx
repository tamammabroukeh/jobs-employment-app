import { Typography, ReusableBadge } from '@/components/Reusable-Components';
import Image from 'next/image';
import type { TalentDetailResponse } from '@/apis/services/talents/interface';
import { getCandidatesTranslations } from '@/lib/get-translations';
import Link from 'next/link';
import ROUTES from '@/constants/routes';

interface TalentProfileViewProps {
  talentData: TalentDetailResponse;
}

export default async function TalentProfileView({ talentData }: TalentProfileViewProps) {
  const t = await getCandidatesTranslations();
  const { user } = talentData;
  const { profile } = user;

  const formattedDate = new Date(user.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href={ROUTES.TALENTS.LIST}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <i className="fa-solid fa-arrow-left" />
          <span>{t('profile.backToCandidates')}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="auth-card p-6 sticky top-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted relative mb-4">
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <i className="fa-solid fa-user text-5xl text-primary/50" />
                  </div>
                </div>
                
                <Typography variant="h2" className="text-foreground text-center mb-1">
                  {profile.ai_full_name || user.name}
                </Typography>
                {profile.ai_summary && (
                  <Typography variant="p" className="text-muted-foreground text-center text-sm">
                    {profile.ai_summary}
                  </Typography>
                )}
              </div>

              {/* Last Updated */}
              <div className="text-center mb-6">
                <Typography variant="p" className="text-xs text-muted-foreground">
                  {t('profile.lastUpdated')}: {formattedDate}
                </Typography>
              </div>

              {/* ATS Score */}
              {profile.ats_score && (
                <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Typography variant="p" className="text-foreground font-semibold">
                      ATS Score
                    </Typography>
                    <Typography variant="h3" className="text-primary">
                      {profile.ats_score}%
                    </Typography>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4 border-t pt-6">
                <Typography variant="h4" className="text-foreground font-semibold">
                  {t('profile.contact')}
                </Typography>

                <div className="space-y-3 text-sm">
                  {profile.ai_email && (
                    <div className="flex items-start gap-2">
                      <i className="fa-solid fa-envelope w-4 text-muted-foreground mt-1" />
                      <div>
                        <Typography variant="p" className="text-foreground break-all">
                          {profile.ai_email}
                        </Typography>
                      </div>
                    </div>
                  )}

                  {profile.ai_phone && (
                    <div className="flex items-start gap-2">
                      <i className="fa-solid fa-phone w-4 text-muted-foreground mt-1" />
                      <div>
                        <Typography variant="p" className="text-foreground">
                          {profile.ai_phone}
                        </Typography>
                      </div>
                    </div>
                  )}

                  {profile.ai_location && (
                    <div className="flex items-start gap-2">
                      <i className="fa-solid fa-location-dot w-4 text-muted-foreground mt-1" />
                      <div>
                        <Typography variant="p" className="text-foreground">
                          {profile.ai_location}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Download */}
              {profile.resume && (
                <div className="border-t pt-6 mt-6">
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <i className="fa-solid fa-download" />
                    <span>Download Resume</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Overall Evaluation */}
            {profile.ai_overall_evaluation && (
              <div className="auth-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <i className="fa-solid fa-star text-warning text-2xl" />
                  <Typography variant="h3" className="text-foreground">
                    AI Profile Evaluation
                  </Typography>
                </div>
                <Typography variant="p" className="text-foreground whitespace-pre-wrap">
                  {profile.ai_overall_evaluation}
                </Typography>
              </div>
            )}

            {/* Skills */}
            {profile.ai_skills && profile.ai_skills.length > 0 && (
              <div className="auth-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fa-solid fa-code text-warning text-2xl" />
                  <Typography variant="h3" className="text-foreground">
                    {t('profile.skills')}
                  </Typography>
                </div>
                <Typography variant="p" className="text-muted-foreground mb-4">
                  {t('profile.toolsAndExpertise')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {profile.ai_skills.map((skill, index) => (
                    <ReusableBadge key={index} variant="primary" size="lg">
                      {skill}
                    </ReusableBadge>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.ai_education_history && profile.ai_education_history.length > 0 && (
              <div className="auth-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fa-solid fa-graduation-cap text-primary text-2xl" />
                  <Typography variant="h3" className="text-foreground">
                    {t('profile.education')}
                  </Typography>
                </div>

                <div className="space-y-6">
                  {profile.ai_education_history.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <Typography variant="h4" className="text-foreground mb-1">
                        {edu.degree}
                      </Typography>
                      <Typography variant="p" className="text-muted-foreground mb-2">
                        {edu.institution}
                      </Typography>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {profile.ai_work_history && profile.ai_work_history.length > 0 && (
              <div className="auth-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fa-solid fa-briefcase text-success text-2xl" />
                  <Typography variant="h3" className="text-foreground">
                    {t('profile.experience')}
                  </Typography>
                </div>

                <div className="space-y-6">
                  {profile.ai_work_history.map((exp, index) => (
                    <div key={index} className="border-l-2 border-success pl-4">
                      <Typography variant="h4" className="text-foreground mb-1">
                        {exp.role} {t('profile.at')} {exp.company}
                      </Typography>
                      <Typography variant="p" className="text-muted-foreground mb-3">
                        {exp.duration}
                      </Typography>
                      <Typography variant="p" className="text-foreground">
                        {exp.description}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.ai_languages && profile.ai_languages.length > 0 && (
              <div className="auth-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fa-solid fa-language text-info text-2xl" />
                  <Typography variant="h3" className="text-foreground">
                    {t('profile.languages')}
                  </Typography>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {profile.ai_languages.map((language, index) => (
                    <ReusableBadge key={index} variant="default" size="lg">
                      {language}
                    </ReusableBadge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
