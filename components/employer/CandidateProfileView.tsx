import { Typography, ReusableBadge } from '@/components/Reusable-Components';
import Image from 'next/image';
import type { Candidate } from '@/apis/services/employer/interface';
import { getCandidatesTranslations } from '@/lib/get-translations';
import Link from 'next/link';
import ROUTES from '@/constants/routes';

interface CandidateProfileViewProps {
  candidate: Candidate;
}

export default async function CandidateProfileView({ candidate }: CandidateProfileViewProps) {
  const t = await getCandidatesTranslations();
  console.log('candidate', candidate)
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

  const age = calculateAge(candidate.date_of_birth);
  const formattedDate = new Date(candidate.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href={ROUTES.EMPLOYER.CANDIDATES}
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
                  {candidate.image ? (
                    <Image
                      src={candidate.image}
                      alt={candidate.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <i className="fa-solid fa-user text-5xl text-primary/50" />
                    </div>
                  )}
                </div>
                
                <Typography variant="h2" className="text-foreground text-center mb-1">
                  {candidate.full_name}
                </Typography>
                <Typography variant="p" className="text-muted-foreground text-center">
                  {candidate.current_job_title}
                </Typography>
              </div>

              {/* Last Updated */}
              <div className="text-center mb-6">
                <Typography variant="p" className="text-xs text-muted-foreground">
                  {t('profile.lastUpdated')}: {formattedDate}
                </Typography>
              </div>

              {/* Buy This CV Button */}
              <button className="w-full bg-warning hover:bg-warning/90 text-white font-medium py-3 rounded-lg transition-colors mb-6 flex items-center justify-center gap-2">
                <i className="fa-solid fa-download" />
                {t('profile.buyThisCV')}
              </button>

              {/* Personal Information */}
              <div className="space-y-4 mb-6">
                <Typography variant="h4" className="text-foreground font-semibold">
                  {t('profile.personalInfo')}
                </Typography>

                <div className="space-y-3 text-sm">
                  <div className='flex items-center justify-between'>
                    <Typography variant="p" className="text-muted-foreground">
                      {t('profile.age')}
                    </Typography>
                    <Typography variant="p" className="text-foreground">
                      {age} {t('profile.years')}
                    </Typography>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Typography variant="p" className="text-muted-foreground">
                      {t('profile.nationality')}
                    </Typography>
                    <Typography variant="p" className="text-foreground">
                      {candidate.nationality}
                    </Typography>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Typography variant="p" className="text-muted-foreground">
                      {t('profile.gender')}
                    </Typography>
                    <Typography variant="p" className="text-foreground capitalize">
                      {candidate.gender}
                    </Typography>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Typography variant="p" className="text-muted-foreground">
                      {t('profile.maritalStatus')}
                    </Typography>
                    <Typography variant="p" className="text-foreground capitalize">
                      {candidate.marital_status}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Career Information */}
              <div className="space-y-4 mb-6 border-t pt-6">
                <Typography variant="h4" className="text-foreground font-semibold">
                  {t('profile.careerInfo')}
                </Typography>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <Typography variant="p" className="text-muted-foreground">
                      {t('profile.experience')}
                    </Typography>
                    <Typography variant="p" className="text-foreground">
                      {candidate.years_of_experience} {t('profile.years')}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between">
                    <Typography variant="p" className="text-muted-foreground">
                      {t('profile.jobLevel')}
                    </Typography>
                    <Typography variant="p" className="text-foreground capitalize">
                      {candidate.job_level}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between">
                    <Typography variant="p" className="text-muted-foreground">
                      {t('profile.education')}
                    </Typography>
                    <Typography variant="p" className="text-foreground capitalize">
                      {candidate?.education_level?.replace('_', ' ')}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Availability & Expectations */}
              <div className="space-y-4 border-t pt-6">
                <Typography variant="h4" className="text-foreground font-semibold">
                  {t('profile.availability')}
                </Typography>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <Typography variant="p" className="text-muted-foreground">
                      {t('profile.currentStatus')}
                    </Typography>
                    <Typography variant="p" className="text-foreground capitalize">
                      {candidate?.current_job_status?.replaceAll('_', ' ')}
                    </Typography>
                  </div>

                  {candidate.is_actively_seeking && (
                    <ReusableBadge variant="success" className="w-full justify-center">
                      <i className="fa-solid fa-circle-check mr-2" />
                      {t('profile.notWorking')}
                    </ReusableBadge>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 border-t pt-6 mt-6">
                <Typography variant="h4" className="text-foreground font-semibold">
                  {t('profile.contact')}
                </Typography>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-phone w-4 text-muted-foreground mt-1" />
                    <div>
                      <Typography variant="p" className="text-foreground">
                        {candidate.phone || t('profile.notProvided')}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-envelope w-4 text-muted-foreground mt-1" />
                    <div>
                      <Typography variant="p" className="text-foreground break-all">
                        {candidate.email || t('profile.notProvided')}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Education */}
            {candidate.education_history && candidate.education_history.length > 0 && (
              <div className="auth-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fa-solid fa-graduation-cap text-primary text-2xl" />
                  <Typography variant="h3" className="text-foreground">
                    {t('profile.education')}
                  </Typography>
                </div>

                <div className="space-y-6">
                  {candidate.education_history.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <Typography variant="h4" className="text-foreground mb-1">
                        {edu.major_name}
                      </Typography>
                      <Typography variant="p" className="text-muted-foreground mb-2">
                        {t('profile.softwareEngineering')} {t('profile.at')} {edu.faculty}, {edu.university}
                      </Typography>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{t('profile.grade')}: {edu.grade}</span>
                        <span>
                          {t('profile.startDate')}: {new Date(edu.from_date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
                        </span>
                        <span>
                          {t('profile.awardedDate')}: {new Date(edu.awarded_date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Courses - Placeholder for future */}
            <div className="auth-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-certificate text-info text-2xl" />
                <Typography variant="h3" className="text-foreground">
                  {t('profile.trainingCourses')}
                </Typography>
              </div>
              <Typography variant="p" className="text-muted-foreground text-center py-8">
                {t('profile.noTrainingCourses')}
              </Typography>
            </div>

            {/* Your Experience */}
            {candidate.work_experience && candidate.work_experience.length > 0 && (
              <div className="auth-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <i className="fa-solid fa-briefcase text-success text-2xl" />
                  <Typography variant="h3" className="text-foreground">
                    {t('profile.experience')}
                  </Typography>
                </div>

                <div className="space-y-6">
                  {candidate.work_experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-success pl-4">
                      <Typography variant="h4" className="text-foreground mb-1">
                        {exp.job_title} {t('profile.at')} {exp.company_name}
                      </Typography>
                      <Typography variant="p" className="text-muted-foreground mb-3">
                        {t('profile.from')} {new Date(exp.from_date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })} {t('profile.to')} {exp.is_currently_working ? t('profile.present') : new Date(exp.to_date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
                      </Typography>
                      <Typography variant="p" className="text-foreground mb-3">
                        {exp.description}
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {exp.job_roles.map((role, roleIndex) => (
                          <ReusableBadge key={roleIndex} variant="default">
                            {role}
                          </ReusableBadge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
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
                  {candidate.skills.map((skill, index) => (
                    <ReusableBadge key={index} variant="primary" size="lg">
                      {skill.name} - {skill.level}
                    </ReusableBadge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            <div className="auth-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-language text-info text-2xl" />
                <Typography variant="h3" className="text-foreground">
                  {t('profile.languages')}
                </Typography>
              </div>
              
              {/* Placeholder for language proficiency - you can enhance this based on actual data */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="p" className="text-foreground">
                      Arabic
                    </Typography>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-warning" />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="p" className="text-foreground">
                      English
                    </Typography>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-warning" />
                      ))}
                      <i className="fa-solid fa-star text-muted-foreground/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* References - Placeholder */}
            <div className="auth-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-user-check text-primary text-2xl" />
                <Typography variant="h3" className="text-foreground">
                  {t('profile.references')}
                </Typography>
              </div>
              <Typography variant="p" className="text-muted-foreground text-center py-8">
                {t('profile.noReferences')}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
