'use client';

import { useState } from 'react';
import { Typography, ReusableButton, ReusableBadge } from '@/components/Reusable-Components';
import Image from 'next/image';
import Link from 'next/link';
import ApplyJobDialog from './ApplyJobDialog';
import ROUTES from '@/constants/routes';
import { redirect, useRouter } from 'next/navigation';
import { useJobDetailTranslations } from '@/hooks/use-translations';
import type { Job } from '@/apis/services/jobs/interfaces';
import { useAuth } from '@/hooks/useAuth';

interface JobDetailClientProps {
  job: Job;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth()
  const t = useJobDetailTranslations();

  // Format salary display
  const formatSalary = () => {
    if (!job.display_salary) return 'Not disclosed';
    if (job.salary_from && job.salary_to) {
      return `${job.currency} ${job.salary_from} - ${job.salary_to}`;
    }
    if (job.salary_from) {
      return `From ${job.currency} ${job.salary_from}`;
    }
    if (job.salary_to) {
      return `Up to ${job.currency} ${job.salary_to}`;
    }
    return 'Not disclosed';
  };

  // Format job type display
  const formatJobType = (type: string) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format work mode display
  const formatWorkMode = (mode: string) => {
    return mode.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company_name}`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleRoleClick = (role: string) => {
    router.push(`${ROUTES.JOB.LIST}?role=${encodeURIComponent(role)}`);
  };

  const companyLogo = job.company?.logo || job.company_logo || `https://logo.clearbit.com/${job.company_name.toLowerCase().replace(' ', '')}.com`;

  const handleApplyNow = () => {
    if(isAuthenticated){
      setApplyDialogOpen(true)
    }
    else {
      redirect(ROUTES.AUTH.LOGIN)
    }
  }
  return (
    <main className="min-h-screen bg-background">
      {/* Header with gradient background */}
      <div className="relative w-full h-80 md:h-96 bg-linear-to-r from-primary/20 to-primary/5">
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
            <Typography variant="h1" className="text-white mb-2">
              {job.title}
            </Typography>
            <Typography variant="p" className="text-white/80 mb-6">
              {job.company_name} • {job.city} • {formatJobType(job.job_type)} • {formatWorkMode(job.work_mode)}
            </Typography>

            <div className="flex flex-wrap gap-4">
              <ReusableButton
                variant="primary"
                size="large"
                onClick={handleApplyNow}
              >
                <i className="fa-solid fa-paper-plane mr-2" />
                {t('applyNow')}
              </ReusableButton>

              <ReusableButton variant="default" size="large" onClick={handleShare}>
                <i className="fa-solid fa-share-nodes mr-2" />
                {t('shareJob')}
              </ReusableButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Details Section */}
            <div className="auth-card p-6">
              <Typography variant="h3" className="text-foreground mb-6">
                {t('jobDetails.title')}
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience */}
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-briefcase text-primary text-xl" />
                  <div>
                    <Typography variant="small" className="text-muted-foreground">
                      {t('jobDetails.experience')}
                    </Typography>
                    <Typography variant="h5" className="text-foreground">
                      {job.experience_years} {job.experience_years === 1 ? 'year' : 'years'}
                    </Typography>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-location-dot text-warning text-xl" />
                  <div>
                    <Typography variant="small" className="text-muted-foreground">
                      {t('jobDetails.location')}
                    </Typography>
                    <Typography variant="h5" className="text-foreground">
                      {job.city}
                    </Typography>
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-money-bill text-success text-xl" />
                  <div>
                    <Typography variant="small" className="text-muted-foreground">
                      {t('jobDetails.salary')}
                    </Typography>
                    <Typography variant="h5" className="text-foreground">
                      {formatSalary()}
                    </Typography>
                  </div>
                </div>

                {/* Job ID */}
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-hashtag text-info text-xl" />
                  <div>
                    <Typography variant="small" className="text-muted-foreground">
                      {t('jobDetails.jobId')}
                    </Typography>
                    <Typography variant="h5" className="text-foreground">
                      {job.job_id}
                    </Typography>
                  </div>
                </div>

                {/* Vacancies */}
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-users text-primary text-xl" />
                  <div>
                    <Typography variant="small" className="text-muted-foreground">
                      {t('jobDetails.vacancies')}
                    </Typography>
                    <Typography variant="h5" className="text-foreground">
                      {job.vacancies} {job.vacancies === 1 ? 'position' : 'positions'}
                    </Typography>
                  </div>
                </div>

                {/* Expires */}
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-calendar text-danger text-xl" />
                  <div>
                    <Typography variant="small" className="text-muted-foreground">
                      {t('jobDetails.expiresOn')}
                    </Typography>
                    <Typography variant="h5" className="text-foreground">
                      {new Date(job.expires_at).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Job Type & Work Mode */}
              <div className="mt-6">
                <Typography variant="small" className="text-muted-foreground mb-3">
                  {t('jobDetails.jobType')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  <ReusableBadge variant="info" size="md">
                    {formatJobType(job.job_type)}
                  </ReusableBadge>
                  <ReusableBadge variant="info" size="md">
                    {formatWorkMode(job.work_mode)}
                  </ReusableBadge>
                </div>
              </div>

              {/* Job Level */}
              <div className="mt-4">
                <Typography variant="small" className="text-muted-foreground mb-3">
                  {t('jobDetails.jobLevel')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  <ReusableBadge variant="success" size="md">
                    {formatJobType(job.job_level)}
                  </ReusableBadge>
                </div>
              </div>

              {/* Category */}
              <div className="mt-4">
                <Typography variant="small" className="text-muted-foreground mb-3">
                  {t('jobDetails.category')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  <ReusableBadge variant="primary" size="md">
                    {job.category}
                  </ReusableBadge>
                </div>
              </div>
            </div>

            {/* Job Description Section */}
            <div className="auth-card p-6">
              <Typography variant="h3" className="text-foreground mb-4">
                {t('jobDescription.title')}
              </Typography>
              <Typography variant="p" className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-wrap">
                {job.description}
              </Typography>

              {/* Requirements */}
              {job.requirements && (
                <div className="mt-6">
                  <Typography variant="h4" className="text-foreground mb-3">
                    {t('jobDescription.requirements')}
                  </Typography>
                  <Typography variant="p" className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {job.requirements}
                  </Typography>
                </div>
              )}

              {/* Job Roles */}
              {job.roles && job.roles.length > 0 && (
                <div className="mt-6">
                  <Typography variant="h5" className="text-foreground mb-3">
                    {t('jobDescription.roles')}
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {job.roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleClick(role)}
                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="mt-6">
                  <Typography variant="h5" className="text-foreground mb-3">
                    {t('jobDescription.tags')}
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <ReusableBadge key={tag} variant="default" size="md">
                        #{tag}
                      </ReusableBadge>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {job.languages && job.languages.length > 0 && (
                <div className="mt-6">
                  <Typography variant="h5" className="text-foreground mb-3">
                    {t('jobDescription.languagesRequired')}
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {job.languages.map((lang) => (
                      <ReusableBadge key={lang} variant="success" size="md">
                        {lang}
                      </ReusableBadge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Company Info */}
          <div className="lg:col-span-1">
            <div className="auth-card p-6 sticky top-20">
              <Typography variant="h4" className="text-foreground mb-6">
                {t('companyInfo.title')}
              </Typography>

              {/* Company Logo & Name */}
              {job.company ? (
                <Link href={ROUTES.COMPANIES.getDetail(job.company._id)} className="block mb-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted shrink-0">
                      {companyLogo && (
                        <Image
                          src={companyLogo}
                          alt={job.company_name}
                          fill
                          className="object-contain p-2"
                        />
                      )}
                    </div>
                    <Typography variant="h4" className="text-foreground group-hover:text-primary transition-colors">
                      {job.company_name}
                    </Typography>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted shrink-0">
                    {companyLogo && (
                      <Image
                        src={companyLogo}
                        alt={job.company_name}
                        fill
                        className="object-contain p-2"
                      />
                    )}
                  </div>
                  <Typography variant="h4" className="text-foreground">
                    {job.company_name}
                  </Typography>
                </div>
              )}

              {/* Company Description */}
              {job.company?.description && (
                <Typography variant="small" className="text-muted-foreground mb-6 line-clamp-4">
                  {job.company.description}
                </Typography>
              )}

              {/* Company Location */}
              {job.company && (
                <div className="flex items-center gap-2 mb-6">
                  <i className="fa-solid fa-location-dot text-primary" />
                  <Typography variant="small" className="text-foreground">
                    {job.company.city}, {job.company.country}
                  </Typography>
                </div>
              )}

              {/* Social Media */}
              {job.company?.social_media && (
                <div className="mb-6">
                  <Typography variant="small" className="text-muted-foreground mb-3">
                    {t('companyInfo.socialMedia')}
                  </Typography>
                  <div className="flex items-center gap-3">
                    {job.company.social_media.linkedin && (
                      <Link
                        href={job.company.social_media.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <i className="fa-brands fa-linkedin text-primary" />
                      </Link>
                    )}
                    {job.company.social_media.twitter && (
                      <Link
                        href={job.company.social_media.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-info/10 hover:bg-info/20 flex items-center justify-center transition-colors"
                      >
                        <i className="fa-brands fa-twitter text-info" />
                      </Link>
                    )}
                    {job.company.social_media.facebook && (
                      <Link
                        href={job.company.social_media.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <i className="fa-brands fa-facebook text-primary" />
                      </Link>
                    )}
                    {job.company.social_media.website && (
                      <Link
                        href={job.company.social_media.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-warning/10 hover:bg-warning/20 flex items-center justify-center transition-colors"
                      >
                        <i className="fa-solid fa-globe text-warning" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* View Company Button */}
              {job.company && (
                <Link href={ROUTES.COMPANIES.getDetail(job.company._id)} className="block">
                  <ReusableButton variant="primary" className="w-full">
                    {t('companyInfo.viewCompany')}
                    <i className="fa-solid fa-arrow-right ml-2" />
                  </ReusableButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <ApplyJobDialog
        jobId={job.id}
        jobTitle={job.title}
        open={applyDialogOpen}
        onClose={() => setApplyDialogOpen(false)}
      />
    </main>
  );
}
