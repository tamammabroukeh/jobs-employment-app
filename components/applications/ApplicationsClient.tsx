"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, ReusableButton, ReusableCard, ReusableDialog, Flex } from "@/components/Reusable-Components";
import ReusablePagination from "@/components/Reusable-Components/Reusable-Pagination";
import { useApplicationsTranslations } from "@/hooks/use-translations";
import type { IJobApplicationsResponse, IJobApplication } from "@/apis/services/job-seeker/interface";
import { withdrawApplicationAction } from "@/apis/services/job-seeker/actions";
import { formatDistanceToNow } from "date-fns";
import { Tag } from "antd";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";

interface ApplicationsClientProps {
  initialData: IJobApplicationsResponse | null;
  initialPage: number;
}

export default function ApplicationsClient({ initialData, initialPage }: ApplicationsClientProps) {
  const t = useApplicationsTranslations();
  const router = useRouter();
  const [currentPage] = useState(initialPage);
  const [applications, setApplications] = useState(initialData?.applications.data ?? []);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<IJobApplication | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const openWithdrawDialog = (application: IJobApplication) => {
    setSelectedApplication(application);
    setIsWithdrawOpen(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedApplication) return;
    setIsWithdrawing(true);
    try {
      const result = await withdrawApplicationAction({ id: selectedApplication.id });
      if (result?.data?.success) {
        toast.success(result.data.message || t("withdraw.success"));
        setApplications((prev) => prev.filter((a) => a.id !== selectedApplication.id));
        setIsWithdrawOpen(false);
        setSelectedApplication(null);
      } else {
        toast.error(t("withdraw.error"));
      }
    } catch {
      toast.error(t("withdraw.error"));
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      accepted: "green",
      rejected: "red",
      reviewing: "blue",
      pending: "orange",
    };
    return statusMap[status] ?? "orange";
  };

  const getStatusLabel = (status: IJobApplication["status"]) => {
    const map: Record<IJobApplication["status"], string> = {
      pending: t("status.pending"),
      reviewing: t("status.reviewing"),
      accepted: t("status.accepted"),
      rejected: t("status.rejected"),
    };
    return map[status] ?? status;
  };

  const formatJobType = (type: string) => type.replace(/_/g, " ");

  // Empty state
  if (!initialData || applications.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Typography variant="h1" className="text-3xl font-bold">
            {t("title")}
          </Typography>
          <Typography variant="text" className="text-muted-foreground mt-2">
            {t("description")}
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-48 h-48 mb-8 flex items-center justify-center rounded-full bg-muted/30">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 text-muted-foreground/40"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <Typography variant="h2" className="text-2xl font-semibold mb-3">
            {t("empty.title")}
          </Typography>
          <Typography variant="text" className="text-muted-foreground mb-8 max-w-md">
            {t("empty.description")}
          </Typography>
          <ReusableButton
            btnText={t("empty.action")}
            onClick={() => router.push(ROUTES.JOB.LIST)}
            variant="primary"
          />
        </div>
      </div>
    );
  }

  const paginationData = initialData.applications;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-3xl font-bold">
          {t("title")}
        </Typography>
        <Typography variant="text" className="text-muted-foreground mt-2">
          {t("description")}
        </Typography>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.map((application) => (
          <ReusableCard key={application.id} styleForCard="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-4">
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <Link
                    href={ROUTES.JOB.getDetail(application.job_post_id)}
                    className="hover:text-primary transition-colors"
                  >
                    <Typography variant="h3" className="text-xl font-semibold mb-2">
                      {application.job_post.title}
                    </Typography>
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {/* Company */}
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {application.job_post.company_name}
                    </span>
                    {/* City */}
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {application.job_post.city}
                    </span>
                    {/* Time ago */}
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <Tag color={getStatusColor(application.status)} className="px-3 py-1 self-start">
                  {getStatusLabel(application.status)}
                </Tag>
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <Typography variant="p" className="text-xs text-muted-foreground block mb-1">
                    {t("card.education")}
                  </Typography>
                  <Typography variant="text" className="text-sm font-medium">
                    {application.education}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-xs text-muted-foreground block mb-1">
                    {t("card.lastWork")}
                  </Typography>
                  <Typography variant="text" className="text-sm font-medium">
                    {application.last_work}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-xs text-muted-foreground block mb-1">
                    {t("card.experience")}
                  </Typography>
                  <Typography variant="text" className="text-sm font-medium">
                    {application.years_of_experience} yrs
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-xs text-muted-foreground block mb-1">
                    {t("card.expectedSalary")}
                  </Typography>
                  <Typography variant="text" className="text-sm font-medium">
                    {application.expected_salary}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-xs text-muted-foreground block mb-1">
                    {t("card.noticePeriod")}
                  </Typography>
                  <Typography variant="text" className="text-sm font-medium">
                    {application.notice_period}
                  </Typography>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2">
                  <Link href={ROUTES.JOB.getDetail(application.job_post_id)}>
                    <ReusableButton
                      btnText={t("card.viewJob")}
                      variant="default"
                    />
                  </Link>
                  {application.status === "pending" && (
                    <ReusableButton
                      btnText={t("card.withdraw")}
                      variant="default"
                      danger
                      onClick={() => openWithdrawDialog(application)}
                    />
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Tag color="blue">{formatJobType(application.job_post.job_type)}</Tag>
                <Tag color="purple">{formatJobType(application.job_post.work_mode)}</Tag>
                {application.job_post.roles.slice(0, 3).map((role, i) => (
                  <Tag key={i} color="default">{role}</Tag>
                ))}
                {application.job_post.roles.length > 3 && (
                  <Tag color="default">+{application.job_post.roles.length - 3} more</Tag>
                )}
              </div>
            </div>
          </ReusableCard>
        ))}
      </div>

      {/* Pagination */}
      {paginationData.total > paginationData.per_page && (
        <ReusablePagination
          currentPage={currentPage}
          totalItems={paginationData.total}
          pageSize={paginationData.per_page}
          showSizeChanger={false}
        />
      )}

      {/* Withdraw Confirmation Dialog */}
      <ReusableDialog
        isOpen={isWithdrawOpen}
        setIsOpen={setIsWithdrawOpen}
        dialogHeader={{
          title: t("withdraw.confirmTitle"),
          description: t("withdraw.confirmMessage").replace(
            "{jobTitle}",
            selectedApplication?.job_post.title ?? ""
          ),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("withdraw.cancel")}
              onClick={() => setIsWithdrawOpen(false)}
              variant="default"
              disabled={isWithdrawing}
            />
            <ReusableButton
              btnText={t("withdraw.confirm")}
              onClick={handleConfirmWithdraw}
              variant="primary"
              danger
              isLoading={isWithdrawing}
            />
          </Flex>
        }
      />
    </div>
  );
}
