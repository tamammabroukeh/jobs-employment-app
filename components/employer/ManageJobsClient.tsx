'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography, ReusableButton } from '@/components/Reusable-Components';
import ROUTES from '@/constants/routes';
import type { Job } from '@/apis/services/employer';

interface ManageJobsClientProps {
  initialJobs: Job[];
}

export default function ManageJobsClient({ initialJobs }: ManageJobsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'archived'>('current');

  const filteredJobs = initialJobs?.filter((job) =>
    job?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-foreground mb-2">
          Manage Jobs
        </Typography>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'current'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fa-solid fa-circle-info text-sm" />
          <Typography variant="p" className={activeTab === 'current' ? 'text-primary' : ''}>
            Current Jobs
          </Typography>
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'archived'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fa-solid fa-box-archive text-sm" />
          <Typography variant="p" className={activeTab === 'archived' ? 'text-primary' : ''}>
            Archived Jobs
          </Typography>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Recruiter name</option>
        </select>
      </div>

      {/* Content */}
      {filteredJobs.length === 0 ? (
        <EmptyState />
      ) : (
        <JobsList jobs={filteredJobs} />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-64 h-64 mb-6">
        <Image
          src="/images/no-jobs.svg"
          alt="No jobs posted"
          fill
          className="object-contain"
          priority
        />
      </div>
      <Typography variant="h3" className="text-foreground mb-2">
        You haven&apos;t posted any posts yet
      </Typography>
      <Link href={ROUTES.EMPLOYER.CREATE_JOB}>
        <ReusableButton variant="primary" className="mt-4">
          Add New Job
        </ReusableButton>
      </Link>
    </div>
  );
}

function JobsList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="space-y-4">
      {jobs?.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="auth-card p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        {job?.company_logo && (
          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted shrink-0">
            <Image
              src={job.company_logo}
              alt={job.company_name}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Typography variant="h3" className="text-foreground">
                  {job?.title}
                </Typography>
                {!job?.is_active && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    Inactive
                  </span>
                )}
              </div>
              <Typography variant="p" className="text-muted-foreground text-sm mb-1">
                {job?.company_name}
              </Typography>
            </div>
            <div className="flex gap-2">
              <Link href={ROUTES.EMPLOYER.getEditJob(job?.id)}>
                <ReusableButton variant="default" className="text-sm">
                  <i className="fa-solid fa-edit mr-2" />
                  Edit
                </ReusableButton>
              </Link>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-briefcase text-sm text-primary" />
              <Typography variant="small" className="text-muted-foreground">
                {job?.job_type?.replace('_', ' ')}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-sm text-primary" />
              <Typography variant="small" className="text-muted-foreground">
                {job?.city}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-laptop text-sm text-primary" />
              <Typography variant="small" className="text-muted-foreground">
                {job?.work_mode?.replace('_', ' ')}
              </Typography>
            </div>
            {job?.display_salary && (
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-dollar-sign text-sm text-success" />
                <Typography variant="small" className="text-muted-foreground">
                  {job?.currency} {job?.salary_from} - {job?.salary_to}
                </Typography>
              </div>
            )}
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-users text-sm text-primary" />
              <Typography variant="small" className="text-muted-foreground">
                {job?.vacancies} {job?.vacancies === 1 ? 'position' : 'positions'}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-file-circle-check text-sm text-primary" />
              <Typography variant="small" className="text-muted-foreground">
                {job?.application_count} {job?.application_count === 1 ? 'application' : 'applications'}
              </Typography>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <Typography variant="small" className="text-muted-foreground mb-1">
                Experience Required
              </Typography>
              <Typography variant="p" className="text-foreground text-sm">
                {job?.experience_years} {job?.experience_years === 1 ? 'year' : 'years'} • {job?.job_level}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-muted-foreground mb-1">
                Education
              </Typography>
              <Typography variant="p" className="text-foreground text-sm capitalize">
                {job?.education_level?.replace('_', ' ')}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-muted-foreground mb-1">
                Languages
              </Typography>
              <Typography variant="p" className="text-foreground text-sm">
                {job?.languages?.join(', ')}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-muted-foreground mb-1">
                Expires At
              </Typography>
              <Typography variant="p" className="text-foreground text-sm">
                {new Date(job?.expires_at).toLocaleDateString()}
              </Typography>
            </div>
          </div>

          {/* Requirements */}
          {(job?.portfolio_required || job?.cover_letter_required) && (
            <div className="flex gap-2 mt-3">
              {job?.portfolio_required && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Portfolio Required
                </span>
              )}
              {job?.cover_letter_required && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Cover Letter Required
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          {job?.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
