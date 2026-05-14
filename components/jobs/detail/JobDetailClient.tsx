'use client';

import { useState } from 'react';
import { Typography, ReusableButton, ReusableBadge } from '@/components/Reusable-Components';
import Image from 'next/image';
import Link from 'next/link';
import ApplyJobDialog from './ApplyJobDialog';
import ROUTES from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { useJobDetailTranslations } from '@/hooks/use-translations';

interface Job {
  id: string;
  displayId: string;
  title: string;
  coverImage: string;
  description: string;
  roles: string[];
  types: string[];
  levels: string[];
  experience: string;
  location: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logo: string;
    description: string;
    location: string;
    socialMedia: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
  };
}

interface JobDetailClientProps {
  job: Job;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const router = useRouter();
  const t = useJobDetailTranslations();

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company.name}`,
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

  return (
    <main className="min-h-screen bg-background">
      {/* Cover Image with Title and Actions */}
      <div className="relative w-full h-80 md:h-96 bg-gradient-to-r from-primary/20 to-primary/5">
        <Image src={job.coverImage} alt={job.title} fill className="object-cover" priority />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
            <Typography variant="h1" className="text-white mb-6">
              {job.title}
            </Typography>

            <div className="flex flex-wrap gap-4">
              <ReusableButton
                variant="primary"
                size="large"
                onClick={() => setApplyDialogOpen(true)}
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
                      {job.experience}
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
                      {job.location}
                    </Typography>
                  </div>
                </div>

                {/* Posted Date */}
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-calendar text-success text-xl" />
                  <div>
                    <Typography variant="small" className="text-muted-foreground">
                      {t('jobDetails.postedOn')}
                    </Typography>
                    <Typography variant="h5" className="text-foreground">
                      {job.createdAt}
                    </Typography>
                  </div>
                </div>

                {/* Job ID */}
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-hashtag text-info text-xl" />
                  <div>
                    <Typography variant="small" className="text-muted-foreground">
                      Job ID
                    </Typography>
                    <Typography variant="h5" className="text-foreground">
                      {job.displayId}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Job Types */}
              <div className="mt-6">
                <Typography variant="small" className="text-muted-foreground mb-3">
                  {t('jobDetails.jobType')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {job.types.map((type) => (
                    <ReusableBadge key={type} variant="info" size="md">
                      {type}
                    </ReusableBadge>
                  ))}
                </div>
              </div>

              {/* Job Levels */}
              <div className="mt-4">
                <Typography variant="small" className="text-muted-foreground mb-3">
                  {t('jobDetails.jobLevel')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {job.levels.map((level) => (
                    <ReusableBadge key={level} variant="success" size="md">
                      {level}
                    </ReusableBadge>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Description Section */}
            <div className="auth-card p-6">
              <Typography variant="h3" className="text-foreground mb-4">
                {t('jobDescription.title')}
              </Typography>
              <Typography variant="p" className="text-muted-foreground leading-relaxed mb-6">
                {job.description}
              </Typography>

              {/* Job Roles */}
              <div>
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
            </div>
          </div>

          {/* Sidebar - Company Info */}
          <div className="lg:col-span-1">
            <div className="auth-card p-6 sticky top-20">
              <Typography variant="h4" className="text-foreground mb-6">
                {t('companyInfo.title')}
              </Typography>

              {/* Company Logo & Name */}
              <Link href={ROUTES.COMPANIES.getDetail(job.company.id)} className="block mb-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={job.company.logo}
                      alt={job.company.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <Typography variant="h4" className="text-foreground group-hover:text-primary transition-colors">
                    {job.company.name}
                  </Typography>
                </div>
              </Link>

              {/* Company Description */}
              <Typography variant="small" className="text-muted-foreground mb-6 line-clamp-4">
                {job.company.description}
              </Typography>

              {/* Company Location */}
              <div className="flex items-center gap-2 mb-6">
                <i className="fa-solid fa-location-dot text-primary" />
                <Typography variant="small" className="text-foreground">
                  {job.company.location}
                </Typography>
              </div>

              {/* Social Media */}
              {(job.company.socialMedia.linkedin ||
                job.company.socialMedia.twitter ||
                job.company.socialMedia.facebook ||
                job.company.socialMedia.instagram) && (
                <div className="mb-6">
                  <Typography variant="small" className="text-muted-foreground mb-3">
                    {t('companyInfo.socialMedia')}
                  </Typography>
                  <div className="flex items-center gap-3">
                    {job.company.socialMedia.linkedin && (
                      <Link
                        href={job.company.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <i className="fa-brands fa-linkedin text-primary" />
                      </Link>
                    )}
                    {job.company.socialMedia.twitter && (
                      <Link
                        href={job.company.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-info/10 hover:bg-info/20 flex items-center justify-center transition-colors"
                      >
                        <i className="fa-brands fa-twitter text-info" />
                      </Link>
                    )}
                    {job.company.socialMedia.facebook && (
                      <Link
                        href={job.company.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <i className="fa-brands fa-facebook text-primary" />
                      </Link>
                    )}
                    {job.company.socialMedia.instagram && (
                      <Link
                        href={job.company.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-warning/10 hover:bg-warning/20 flex items-center justify-center transition-colors"
                      >
                        <i className="fa-brands fa-instagram text-warning" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* View Company Button */}
              <Link href={ROUTES.COMPANIES.getDetail(job.company.id)} className="block">
                <ReusableButton variant="primary" className="w-full">
                  {t('companyInfo.viewCompany')}
                  <i className="fa-solid fa-arrow-right ml-2" />
                </ReusableButton>
              </Link>
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
