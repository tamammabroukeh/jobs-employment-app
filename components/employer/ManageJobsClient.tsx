'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Select } from 'antd';
import { 
  Typography, 
  ReusableButton, 
  ReusableDialog, 
  ReusableDropdown, 
  Flex,
  ReusableTabs,
  ReusablePagination 
} from '@/components/Reusable-Components';
import type { IDropdownMenuItem } from '@/components/Reusable-Components/Reusable-Dropdown';
import ROUTES from '@/constants/routes';
import type { Job, JobApplication } from '@/apis/services/employer';
import { 
  deleteJobAction, 
  activateJobAction, 
  deactivateJobAction,
  updateApplicationStatusAction
} from '@/apis/services/employer/actions';
import { employerRepository } from '@/apis/services/employer';
import { useEmployerTranslations } from '@/hooks/use-employer';

interface ManageJobsClientProps {
  initialJobs: Job[];
}

export default function ManageJobsClient({ initialJobs }: ManageJobsClientProps) {
  const t = useEmployerTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const filteredJobs = jobs?.filter((job) =>
    job?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSuccess = (jobId: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const handleStatusChange = (jobId: string, isActive: boolean) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, is_active: isActive } : job
      )
    );
  };

  const tabItems = [
    {
      key: 'current',
      label: (
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-briefcase" />
          {t('manageJobs.tabs.current')}
        </span>
      ),
      children: (
        <>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('manageJobs.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>
          </div>

          {/* Content */}
          {filteredJobs.length === 0 ? (
            <EmptyState />
          ) : (
            <JobsList 
              jobs={filteredJobs} 
              onDeleteSuccess={handleDeleteSuccess}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      ),
    },
    {
      key: 'applications',
      label: (
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-file-circle-check" />
          {t('manageJobs.tabs.applications')}
        </span>
      ),
      children: <ApplicationsTab jobs={jobs} />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-foreground mb-2">
          {t('manageJobs.title')}
        </Typography>
      </div>

      {/* Tabs */}
      <ReusableTabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabContentValues={tabItems.map((item) => ({
          value:item.key,
          children: item.children
        }))}
        tabTriggerValues={tabItems.map((item) => ({
              value: item.key,
              title: item.label,
            }))}
            //         tabTriggerValues={tabItems.map((item) => ({
            //   value: item.key,
            //   title: item.label,
            // }))}
            // tabContentValues={tabItems.map((item) => ({
            //   value: item.key,
            //   children: item.children,
            // }))}
        // className="manage-jobs-tabs"
      />
    </div>
  );
}

// Applications Tab Component
function ApplicationsTab({ jobs }: { jobs: Job[] }) {
  const t = useEmployerTranslations();
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [perPage] = useState(15);

  // Fetch applications when job selection changes or page changes
  useEffect(() => {
    if (!selectedJobId) return;

    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const response = await employerRepository.getJobApplications(
          selectedJobId,
          currentPage,
          perPage
        );
        setApplications(response.applications.data);
        setTotalApplications(response.applications.total);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error(t('manageJobs.applications.fetchError'));
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [selectedJobId, currentPage, perPage, t]);

  // Reset page when job changes
  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Typography variant="h3" className="text-foreground mb-2">
          {t('manageJobs.applications.noJobs')}
        </Typography>
        <Link href={ROUTES.EMPLOYER.CREATE_JOB}>
          <ReusableButton variant="primary" className="mt-4">
            {t('manageJobs.empty.button')}
          </ReusableButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Selector */}
      <div className="auth-card p-6">
        <Typography variant="h3" className="text-foreground mb-4">
          {t('manageJobs.applications.selectJob')}
        </Typography>
        <Select
          value={selectedJobId}
          onChange={handleJobChange}
          className="w-full"
          size="large"
          options={jobs.map(job => ({
            label: `${job.title} (${job.application_count} ${t('manageJobs.applications.applicationsCount')})`,
            value: job.id,
          }))}
        />
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <div className="auth-card p-12 text-center">
          <i className="fa-solid fa-inbox text-6xl text-muted-foreground mb-4" />
          <Typography variant="h3" className="text-foreground mb-2">
            {t('manageJobs.applications.noApplications')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground">
            {t('manageJobs.applications.noApplicationsDesc')}
          </Typography>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onStatusUpdate={(id, status) => {
                  setApplications(prev =>
                    prev.map(app =>
                      app.id === id ? { ...app, status: status as JobApplication['status'] } : app
                    )
                  );
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalApplications > perPage && (
            <ReusablePagination
              currentPage={currentPage}
              totalItems={totalApplications}
              pageSize={perPage}
              onPageChange={handlePageChange}
              showSizeChanger={false}
            />
          )}
        </>
      )}
    </div>
  );
}

// Application Card Component
function ApplicationCard({
  application,
  onStatusUpdate,
}: {
  application: JobApplication;
  onStatusUpdate: (id: string, status: string) => void;
}) {
  const t = useEmployerTranslations();
  const router = useRouter();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(application.status);
  const [feedback, setFeedback] = useState<string>(application.feedback || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await updateApplicationStatusAction({
        id: application.id,
        status: selectedStatus as 'pending' | 'reviewed' | 'accepted' | 'rejected',
        feedback: feedback || undefined,
      });

      if (result?.data?.success) {
        toast.success(t('manageJobs.applications.statusUpdateSuccess'));
        onStatusUpdate(application.id, selectedStatus);
        setIsStatusDialogOpen(false);
      } else {
        toast.error(t('manageJobs.applications.statusUpdateError'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('manageJobs.applications.statusUpdateError'));
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'fa-clock';
      case 'reviewed':
        return 'fa-eye';
      case 'accepted':
        return 'fa-check-circle';
      case 'rejected':
        return 'fa-times-circle';
      default:
        return 'fa-circle';
    }
  };

  return (
    <>
      <div
        className="auth-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => router.push(ROUTES.CANDIDATES.getDetail(application.user_id))}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <Typography variant="h3" className="text-foreground mb-1">
              {application.applicant_name}
            </Typography>
            <Typography variant="p" className="text-muted-foreground text-sm">
              {application.user.email}
            </Typography>
          </div>

          <div className="flex items-center gap-3">
            {/* ATS Score Badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
              <i className="fa-solid fa-chart-line text-primary text-sm" />
              <Typography variant="small" className="text-primary font-semibold">
                {application.ats_score}% Match
              </Typography>
            </div>

            {/* Status Badge */}
            <span
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                application.status
              )}`}
            >
              <i className={`fa-solid ${getStatusIcon(application.status)}`} />
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Application Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <Typography variant="small" className="text-muted-foreground mb-1">
              {t('manageJobs.applications.education')}
            </Typography>
            <Typography variant="p" className="text-foreground text-sm">
              {application.education}
            </Typography>
          </div>

          <div>
            <Typography variant="small" className="text-muted-foreground mb-1">
              {t('manageJobs.applications.lastWork')}
            </Typography>
            <Typography variant="p" className="text-foreground text-sm">
              {application.last_work}
            </Typography>
          </div>

          <div>
            <Typography variant="small" className="text-muted-foreground mb-1">
              {t('manageJobs.applications.experience')}
            </Typography>
            <Typography variant="p" className="text-foreground text-sm">
              {application.years_of_experience} {t('manageJobs.applications.years')}
            </Typography>
          </div>

          <div>
            <Typography variant="small" className="text-muted-foreground mb-1">
              {t('manageJobs.applications.expectedSalary')}
            </Typography>
            <Typography variant="p" className="text-foreground text-sm">
              {application.expected_salary}
            </Typography>
          </div>

          <div>
            <Typography variant="small" className="text-muted-foreground mb-1">
              {t('manageJobs.applications.noticePeriod')}
            </Typography>
            <Typography variant="p" className="text-foreground text-sm">
              {application.notice_period}
            </Typography>
          </div>

          <div>
            <Typography variant="small" className="text-muted-foreground mb-1">
              {t('manageJobs.applications.appliedAt')}
            </Typography>
            <Typography variant="p" className="text-foreground text-sm">
              {new Date(application.applied_at).toLocaleDateString()}
            </Typography>
          </div>
        </div>

        {/* Resume Link */}
        {application.resume && (
          <div className="mb-4">
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fa-solid fa-file-pdf" />
              <Typography variant="small">{t('manageJobs.applications.viewResume')}</Typography>
            </a>
          </div>
        )}

        {/* Cover Letter */}
        {application.cover_letter && (
          <div className="mb-4 p-4 bg-muted/30 rounded-lg">
            <Typography variant="small" className="text-muted-foreground mb-2 font-semibold">
              {t('manageJobs.applications.coverLetter')}
            </Typography>
            <Typography variant="p" className="text-foreground text-sm">
              {application.cover_letter}
            </Typography>
          </div>
        )}

        {/* Feedback */}
        {application.feedback && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Typography variant="small" className="text-blue-700 dark:text-blue-400 mb-2 font-semibold">
              {t('manageJobs.applications.feedback')}
            </Typography>
            <Typography variant="p" className="text-blue-900 dark:text-blue-300 text-sm">
              {application.feedback}
            </Typography>
          </div>
        )}

        {/* Update Status Button */}
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <ReusableButton
            btnText={t('manageJobs.applications.updateStatus')}
            variant="default"
            onClick={() => setIsStatusDialogOpen(true)}
            icon={<i className="fa-solid fa-edit" />}
          />
        </div>
      </div>

      {/* Update Status Dialog */}
      <ReusableDialog
        isOpen={isStatusDialogOpen}
        setIsOpen={setIsStatusDialogOpen}
        dialogHeader={{
          title: t('manageJobs.applications.updateStatusTitle'),
          description: t('manageJobs.applications.updateStatusDesc'),
        }}
        dialogBody={
          <div className="space-y-4">
            <div>
              <Typography variant="small" className="text-foreground mb-2 font-semibold">
                {t('manageJobs.applications.status')}
              </Typography>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                className="w-full"
                size="large"
                options={[
                  { label: t('manageJobs.applications.statusPending'), value: 'pending' },
                  { label: t('manageJobs.applications.statusReviewed'), value: 'reviewed' },
                  { label: t('manageJobs.applications.statusAccepted'), value: 'accepted' },
                  { label: t('manageJobs.applications.statusRejected'), value: 'rejected' },
                ]}
              />
            </div>

            <div>
              <Typography variant="small" className="text-foreground mb-2 font-semibold">
                {t('manageJobs.applications.feedbackLabel')} ({t('manageJobs.applications.optional')})
              </Typography>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t('manageJobs.applications.feedbackPlaceholder')}
                maxLength={2000}
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
              />
              <Typography variant="small" className="text-muted-foreground mt-1">
                {feedback.length} / 2000 {t('manageJobs.applications.characters')}
              </Typography>
            </div>
          </div>
        }
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t('manageJobs.applications.cancel')}
              onClick={() => setIsStatusDialogOpen(false)}
              variant="default"
              disabled={isUpdating}
            />
            <ReusableButton
              btnText={t('manageJobs.applications.save')}
              onClick={handleStatusUpdate}
              variant="primary"
              isLoading={isUpdating}
            />
          </Flex>
        }
      />
    </>
  );
}

function EmptyState() {
  const t = useEmployerTranslations();
  
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
        {t('manageJobs.empty.title')}
      </Typography>
      <Link href={ROUTES.EMPLOYER.CREATE_JOB}>
        <ReusableButton variant="primary" className="mt-4">
          {t('manageJobs.empty.button')}
        </ReusableButton>
      </Link>
    </div>
  );
}

function JobsList({ 
  jobs, 
  onDeleteSuccess,
  onStatusChange 
}: { 
  jobs: Job[]; 
  onDeleteSuccess: (jobId: string) => void;
  onStatusChange: (jobId: string, isActive: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {jobs?.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onDeleteSuccess={onDeleteSuccess}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

function JobCard({ 
  job, 
  onDeleteSuccess,
  onStatusChange 
}: { 
  job: Job; 
  onDeleteSuccess: (jobId: string) => void;
  onStatusChange: (jobId: string, isActive: boolean) => void;
}) {
  const t = useEmployerTranslations();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteJobAction({ id: job.id });
      
      if (result?.data) {
        toast.success(t('manageJobs.messages.deleteSuccess'));
        onDeleteSuccess(job.id);
        setIsDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(t('manageJobs.messages.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(t('manageJobs.messages.deleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    setIsLoading(true);
    try {
      const result = await activateJobAction({ id: job.id });
      
      if (result?.data) {
        toast.success(t('manageJobs.messages.activateSuccess'));
        onStatusChange(job.id, true);
        setIsActivateDialogOpen(false);
        router.refresh();
      } else {
        toast.error(t('manageJobs.messages.activateError'));
      }
    } catch (error) {
      console.error('Error activating job:', error);
      toast.error(t('manageJobs.messages.activateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setIsLoading(true);
    try {
      const result = await deactivateJobAction({ id: job.id });
      
      if (result?.data) {
        toast.success(t('manageJobs.messages.deactivateSuccess'));
        onStatusChange(job.id, false);
        setIsDeactivateDialogOpen(false);
        router.refresh();
      } else {
        toast.error(t('manageJobs.messages.deactivateError'));
      }
    } catch (error) {
      console.error('Error deactivating job:', error);
      toast.error(t('manageJobs.messages.deactivateError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Build dropdown menu items
  const dropdownItems: IDropdownMenuItem[] = [
    {
      key: 'edit',
      label: t('manageJobs.actions.edit'),
      icon: <i className="fa-solid fa-edit" />,
      onClick: () => router.push(ROUTES.EMPLOYER.getEditJob(job.id)),
    },
    ...(job.is_active
      ? [
          {
            key: 'deactivate',
            label: t('manageJobs.actions.deactivate'),
            icon: <i className="fa-solid fa-ban" />,
            onClick: () => setIsDeactivateDialogOpen(true),
          },
        ]
      : [
          {
            key: 'activate',
            label: t('manageJobs.actions.activate'),
            icon: <i className="fa-solid fa-check-circle" />,
            onClick: () => setIsActivateDialogOpen(true),
          },
        ]),
    {
      key: 'delete',
      label: t('manageJobs.actions.delete'),
      icon: <i className="fa-solid fa-trash" />,
      danger: true,
      onClick: () => setIsDeleteDialogOpen(true),
    },
  ];

  return (
    <>
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
              
              {/* Dropdown Menu */}
              <ReusableDropdown items={dropdownItems} />
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

      {/* Delete Confirmation Dialog */}
      <ReusableDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        dialogHeader={{
          title: t('manageJobs.confirmDelete.title'),
          description: t('manageJobs.confirmDelete.message', { title: job.title }),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t('manageJobs.confirmDelete.cancel')}
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="default"
              disabled={isLoading}
            />
            <ReusableButton
              btnText={t('manageJobs.confirmDelete.confirm')}
              onClick={handleDelete}
              variant="primary"
              danger
              isLoading={isLoading}
            />
          </Flex>
        }
      />

      {/* Activate Confirmation Dialog */}
      <ReusableDialog
        isOpen={isActivateDialogOpen}
        setIsOpen={setIsActivateDialogOpen}
        dialogHeader={{
          title: t('manageJobs.confirmActivate.title'),
          description: t('manageJobs.confirmActivate.message', { title: job.title }),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t('manageJobs.confirmActivate.cancel')}
              onClick={() => setIsActivateDialogOpen(false)}
              variant="default"
              disabled={isLoading}
            />
            <ReusableButton
              btnText={t('manageJobs.confirmActivate.confirm')}
              onClick={handleActivate}
              variant="primary"
              isLoading={isLoading}
            />
          </Flex>
        }
      />

      {/* Deactivate Confirmation Dialog */}
      <ReusableDialog
        isOpen={isDeactivateDialogOpen}
        setIsOpen={setIsDeactivateDialogOpen}
        dialogHeader={{
          title: t('manageJobs.confirmDeactivate.title'),
          description: t('manageJobs.confirmDeactivate.message', { title: job.title }),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t('manageJobs.confirmDeactivate.cancel')}
              onClick={() => setIsDeactivateDialogOpen(false)}
              variant="default"
              disabled={isLoading}
            />
            <ReusableButton
              btnText={t('manageJobs.confirmDeactivate.confirm')}
              onClick={handleDeactivate}
              variant="primary"
              isLoading={isLoading}
            />
          </Flex>
        }
      />
    </>
  );
}
