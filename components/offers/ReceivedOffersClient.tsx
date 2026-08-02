"use client";

import { useState, useEffect } from "react";
import { Typography, Flex, ReusableButton, ReusableDialog } from "@/components/Reusable-Components";
import { Tag, Spin, Empty } from "antd";
import { useOffersTranslations } from "@/hooks/use-translations";
import { jobSeekerRepository } from "@/apis/services/job-seeker";
import { IReceivedOffer } from "@/apis/services/job-seeker/interface";
import { acceptOfferAction, declineOfferAction } from "@/apis/services/job-seeker/actions";
import { toast } from "sonner";
import { CalendarOutlined, EnvironmentOutlined, DollarOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import ReusablePagination from "@/components/Reusable-Components/Reusable-Pagination";

export default function ReceivedOffersClient() {
  const t = useOffersTranslations();
  const router = useRouter();
  
  const [offers, setOffers] = useState<IReceivedOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  // Confirmation dialog states
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<IReceivedOffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOffers = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await jobSeekerRepository.getReceivedOffers({
        page,
        per_page: perPage,
      });
      
      setOffers(response.offers.data);
      setCurrentPage(response.offers.current_page);
      setTotalPages(response.offers.last_page);
      setTotal(response.offers.total);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAcceptClick = (offer: IReceivedOffer) => {
    setSelectedOffer(offer);
    setIsAcceptDialogOpen(true);
  };

  const handleDeclineClick = (offer: IReceivedOffer) => {
    setSelectedOffer(offer);
    setIsDeclineDialogOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedOffer) return;

    setIsProcessing(true);
    try {
      const result = await acceptOfferAction({ id: selectedOffer.id });
      
      if (result?.data?.success) {
        toast.success(result.data.message || t("messages.acceptSuccess"));
        setIsAcceptDialogOpen(false);
        setSelectedOffer(null);
        // Refresh offers list
        await fetchOffers(currentPage);
      } else {
        toast.error(t("messages.acceptError"));
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast.error(t("messages.acceptError"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDecline = async () => {
    if (!selectedOffer) return;

    setIsProcessing(true);
    try {
      const result = await declineOfferAction({ id: selectedOffer.id });
      
      if (result?.data?.success) {
        toast.success(result.data.message || t("messages.declineSuccess"));
        setIsDeclineDialogOpen(false);
        setSelectedOffer(null);
        // Refresh offers list
        await fetchOffers(currentPage);
      } else {
        toast.error(t("messages.declineError"));
      }
    } catch (error) {
      console.error("Error declining offer:", error);
      toast.error(t("messages.declineError"));
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "blue";
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Empty
            description={
              <div className="text-center">
                <Typography variant="h3" className="text-lg font-semibold mb-2">
                  {t("emptyState.title")}
                </Typography>
                <Typography variant="text" className="text-muted-foreground">
                  {t("emptyState.description")}
                </Typography>
              </div>
            }
          />
          <ReusableButton
            btnText={t("emptyState.action")}
            onClick={() => router.push(ROUTES.PROFILE.VIEW)}
            variant="primary"
            className="mt-6"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-3xl font-bold mb-2">
          {t("title")}
        </Typography>
        <Typography variant="text" className="text-muted-foreground">
          {t("description")}
        </Typography>
      </div>

      {/* Offers List */}
      <div className="space-y-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-card border border-card-border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <Flex classes="justify-between items-start mb-4">
              <div className="flex-1">
                <Typography variant="h3" className="text-xl font-semibold mb-2">
                  {offer.job_post_title}
                </Typography>
                <Flex classes="gap-4 flex-wrap text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <strong>{t("card.company")}:</strong> {offer.employer_company_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarOutlined />
                    {formatDate(offer.created_at)}
                  </span>
                </Flex>
              </div>
              <Tag color={getStatusColor(offer.status)}>
                {t(`status.${offer.status}`)}
              </Tag>
            </Flex>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-muted rounded-lg">
              <div>
                <Typography variant="text" className="text-sm text-muted-foreground">
                  {t("card.position")}
                </Typography>
                <Typography variant="text" className="font-medium">
                  {offer.job_post.job_level} • {offer.job_post.job_type}
                </Typography>
              </div>
              <div>
                <Typography variant="text" className="text-sm text-muted-foreground flex items-center gap-1">
                  <EnvironmentOutlined /> Location
                </Typography>
                <Typography variant="text" className="font-medium">
                  {offer.job_post.city} • {offer.job_post.work_mode}
                </Typography>
              </div>
              {offer.job_post.display_salary && (
                <div>
                  <Typography variant="text" className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarOutlined /> Salary
                  </Typography>
                  <Typography variant="text" className="font-medium">
                    {offer.job_post.salary_from} - {offer.job_post.salary_to} {offer.job_post.currency}
                  </Typography>
                </div>
              )}
            </div>

            {/* Employer Message */}
            {offer.message && (
              <div className="mb-4 p-4 bg-doc-section-bg border border-doc-section-border rounded-lg">
                <Typography variant="text" className="text-sm font-medium mb-2">
                  {t("card.message")}:
                </Typography>
                <Typography variant="text" className="text-foreground">
                  {offer.message}
                </Typography>
              </div>
            )}

            {/* Actions */}
            <Flex classes="gap-3 justify-end">
              <ReusableButton
                btnText={t("card.viewJob")}
                onClick={() => router.push(ROUTES.JOB.getDetail(offer.job_post_id))}
                variant="default"
              />
              {offer.status === "pending" && (
                <>
                  <ReusableButton
                    btnText={t("card.accept")}
                    variant="primary"
                    onClick={() => handleAcceptClick(offer)}
                  />
                  <ReusableButton
                    btnText={t("card.reject")}
                    danger
                    onClick={() => handleDeclineClick(offer)}
                  />
                </>
              )}
            </Flex>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <ReusablePagination
            currentPage={currentPage}
            totalItems={total}
            pageSize={perPage}
            onPageChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* Accept Confirmation Dialog */}
      <ReusableDialog
        isOpen={isAcceptDialogOpen}
        setIsOpen={setIsAcceptDialogOpen}
        dialogHeader={{
          title: t("confirmAccept.title"),
          description: t("confirmAccept.description"),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("confirmAccept.cancel")}
              onClick={() => setIsAcceptDialogOpen(false)}
              variant="default"
              disabled={isProcessing}
            />
            <ReusableButton
              btnText={t("confirmAccept.confirm")}
              onClick={handleConfirmAccept}
              variant="primary"
              isLoading={isProcessing}
              disabled={isProcessing}
            />
          </Flex>
        }
      />

      {/* Decline Confirmation Dialog */}
      <ReusableDialog
        isOpen={isDeclineDialogOpen}
        setIsOpen={setIsDeclineDialogOpen}
        dialogHeader={{
          title: t("confirmDecline.title"),
          description: t("confirmDecline.description"),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("confirmDecline.cancel")}
              onClick={() => setIsDeclineDialogOpen(false)}
              variant="default"
              disabled={isProcessing}
            />
            <ReusableButton
              btnText={t("confirmDecline.confirm")}
              onClick={handleConfirmDecline}
              danger
              isLoading={isProcessing}
              disabled={isProcessing}
            />
          </Flex>
        }
      />
    </div>
  );
}
