"use client";

import { useState } from "react";
import { Card, Input } from "antd";
import { Typography, ReusableButton, ReusableDialog, Flex } from "@/components/Reusable-Components";
import { IJobSeekerDocuments, IAIAnalysisProfile } from "@/apis/services/job-seeker/interface";
import {
  uploadResumeAction,
  deleteResumeAction,
  updateCoverLetterAction,
  deleteCoverLetterAction,
  getResumeAnalysisStatusAction,
} from "@/apis/services/job-seeker/actions";
import { toast } from "sonner";
import { useProfileTranslations } from "@/hooks/use-profile";
import ResumeCard from "./documents/ResumeCard";
import CoverLetterCard from "./documents/CoverLetterCard";
import AIAnalysisDialog from "./documents/AIAnalysisDialog";

const { TextArea } = Input;

interface DocumentsSectionProps {
  documents: IJobSeekerDocuments;
}

export default function DocumentsSection({ documents: initialDocuments }: DocumentsSectionProps) {
  const t = useProfileTranslations();
  const [documents, setDocuments] = useState<IJobSeekerDocuments>(initialDocuments);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState(initialDocuments.default_cover_letter || "");
  const [isSavingCoverLetter, setIsSavingCoverLetter] = useState(false);
  const [isDeleteResumeDialogOpen, setIsDeleteResumeDialogOpen] = useState(false);
  const [isDeleteCoverLetterDialogOpen, setIsDeleteCoverLetterDialogOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<IAIAnalysisProfile | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  // Handle resume file selection
  const handleResumeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("documents.resume.fileSizeError"));
      return;
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error(t("documents.resume.fileTypeError"));
      return;
    }

    setIsUploadingResume(true);

    try {
      const result = await uploadResumeAction({ file });
      if (result?.data?.success) {
        toast.success(result.data.message || t("documents.resume.uploadSuccess"));
        setDocuments((prev) => ({
          ...prev,
          resume_url: result.data?.resume_url || null,
          cv_url: result.data?.resume_url || null,
        }));

        // Show AI analysis if available
        if (result.data.profile && result.data.analysis_status === 'completed') {
          setAnalysisData(result.data.profile);
          setIsAnalysisModalOpen(true);
        }
      } else {
        toast.error(t("documents.resume.uploadError"));
      }
    } catch (error) {
      console.error("Upload resume error:", error);
      toast.error(t("documents.resume.uploadError"));
    } finally {
      setIsUploadingResume(false);
    }
  };

  // Confirm resume delete
  const handleConfirmDeleteResume = async () => {
    try {
      const result = await deleteResumeAction({});

      if (result?.data?.success) {
        toast.success(result.data.message || t("documents.resume.deleteSuccess"));
        setDocuments((prev) => ({
          ...prev,
          resume_url: null,
          cv_url: null,
          cv_analyzed_at: null,
        }));
        setIsDeleteResumeDialogOpen(false);
      } else {
        toast.error(t("documents.resume.deleteError"));
      }
    } catch (error) {
      console.error("Delete resume error:", error);
      toast.error(t("documents.resume.deleteError"));
    }
  };

  // Handle cover letter save
  const handleSaveCoverLetter = async () => {
    if (!coverLetterText.trim()) {
      toast.error(t("documents.coverLetter.emptyError"));
      return;
    }

    if (coverLetterText.length > 2000) {
      toast.error(t("documents.coverLetter.lengthError"));
      return;
    }

    setIsSavingCoverLetter(true);

    try {
      const result = await updateCoverLetterAction({ cover_letter: coverLetterText });

      if (result?.data?.success) {
        toast.success(result.data.message || t("documents.coverLetter.updateSuccess"));
        setDocuments((prev) => ({
          ...prev,
          default_cover_letter: result.data?.cover_letter || coverLetterText,
        }));
        setIsCoverLetterModalOpen(false);
      } else {
        toast.error(t("documents.coverLetter.updateError"));
      }
    } catch (error) {
      console.error("Update cover letter error:", error);
      toast.error(t("documents.coverLetter.updateError"));
    } finally {
      setIsSavingCoverLetter(false);
    }
  };

  // Confirm cover letter delete
  const handleConfirmDeleteCoverLetter = async () => {
    try {
      const result = await deleteCoverLetterAction({});

      if (result?.data?.success) {
        toast.success(result.data.message || t("documents.coverLetter.deleteSuccess"));
        setDocuments((prev) => ({
          ...prev,
          default_cover_letter: null,
        }));
        setCoverLetterText("");
        setIsDeleteCoverLetterDialogOpen(false);
      } else {
        toast.error(t("documents.coverLetter.deleteError"));
      }
    } catch (error) {
      console.error("Delete cover letter error:", error);
      toast.error(t("documents.coverLetter.deleteError"));
    }
  };

  // Open cover letter modal
  const handleEditCoverLetter = () => {
    setCoverLetterText(documents.default_cover_letter || "");
    setIsCoverLetterModalOpen(true);
  };

  // Fetch and show AI analysis
  const handleViewAnalysis = async () => {
    setIsLoadingAnalysis(true);
    try {
      const result = await getResumeAnalysisStatusAction({});
      if (result?.data?.success && result.data.data.profile) {
        setAnalysisData(result.data.data.profile);
        setIsAnalysisModalOpen(true);
      } else {
        toast.error(t("documents.aiAnalysis.notAvailable"));
      }
    } catch (error) {
      console.error("Fetch analysis error:", error);
      toast.error(t("documents.aiAnalysis.fetchError"));
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h2" className="text-xl font-semibold text-foreground">
          {t("documents.title")}
        </Typography>
        {(documents.resume_url || documents.cv_url) && (
          <ReusableButton
            btnText={t("documents.aiAnalysis.viewAnalysis")}
            onClick={handleViewAnalysis}
            variant="default"
            isLoading={isLoadingAnalysis}
          />
        )}
      </div>

      <div className="space-y-6">
        {/* Resume Section */}
        <ResumeCard
          resumeUrl={documents.resume_url || documents.cv_url}
          isUploading={isUploadingResume}
          onFileChange={handleResumeChange}
          onDeleteClick={() => setIsDeleteResumeDialogOpen(true)}
        />

        {/* Cover Letter Section */}
        <CoverLetterCard
          coverLetter={documents.default_cover_letter}
          onEditClick={handleEditCoverLetter}
          onDeleteClick={() => setIsDeleteCoverLetterDialogOpen(true)}
        />
      </div>

      {/* Cover Letter Dialog */}
      <ReusableDialog
        isOpen={isCoverLetterModalOpen}
        setIsOpen={setIsCoverLetterModalOpen}
        dialogHeader={{
          title: documents.default_cover_letter ? t("documents.coverLetter.modalTitle") : t("documents.coverLetter.modalTitleAdd"),
          description: t("documents.coverLetter.modalDescription"),
        }}
        dialogBody={
          <TextArea
            value={coverLetterText}
            onChange={(e) => setCoverLetterText(e.target.value)}
            placeholder={t("documents.coverLetter.placeholder")}
            rows={12}
            maxLength={2000}
            showCount
          />
        }
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("documents.coverLetter.cancel")}
              onClick={() => setIsCoverLetterModalOpen(false)}
              variant="default"
            />
            <ReusableButton
              btnText={t("documents.coverLetter.save")}
              onClick={handleSaveCoverLetter}
              variant="primary"
              isLoading={isSavingCoverLetter}
            />
          </Flex>
        }
      />

      {/* Delete Resume Confirmation Dialog */}
      <ReusableDialog
        isOpen={isDeleteResumeDialogOpen}
        setIsOpen={setIsDeleteResumeDialogOpen}
        dialogHeader={{
          title: t("documents.resume.deleteConfirmTitle"),
          description: t("documents.resume.deleteConfirmMessage"),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("documents.aiAnalysis.cancel")}
              onClick={() => setIsDeleteResumeDialogOpen(false)}
              variant="default"
            />
            <ReusableButton
              btnText={t("documents.resume.delete")}
              onClick={handleConfirmDeleteResume}
              variant="primary"
            />
          </Flex>
        }
      />

      {/* Delete Cover Letter Confirmation Dialog */}
      <ReusableDialog
        isOpen={isDeleteCoverLetterDialogOpen}
        setIsOpen={setIsDeleteCoverLetterDialogOpen}
        dialogHeader={{
          title: t("documents.coverLetter.deleteConfirmTitle"),
          description: t("documents.coverLetter.deleteConfirmMessage"),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("documents.aiAnalysis.cancel")}
              onClick={() => setIsDeleteCoverLetterDialogOpen(false)}
              variant="default"
            />
            <ReusableButton
              btnText={t("documents.coverLetter.delete")}
              onClick={handleConfirmDeleteCoverLetter}
              variant="primary"
            />
          </Flex>
        }
      />

      {/* AI Analysis Results Dialog */}
      <AIAnalysisDialog
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        analysisData={analysisData}
      />
    </Card>
  );
}
