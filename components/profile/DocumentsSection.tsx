"use client";

import { useState, useRef } from "react";
import { Card, Input, Progress, Tag } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Typography, ReusableButton, ReusableDialog, Flex } from "@/components/Reusable-Components";
import { IJobSeekerDocuments, IAIAnalysisProfile } from "@/apis/services/job-seeker/interface";
import {
  uploadResumeAction,
  deleteResumeAction,
  updateCoverLetterAction,
  deleteCoverLetterAction,
} from "@/apis/services/job-seeker/actions";
import { toast } from "sonner";
import { useProfileTranslations } from "@/hooks/use-profile";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Send file directly to server action
      const result = await uploadResumeAction({ file });
      console.log('result', result)
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle resume delete - open confirmation dialog
  const handleDeleteResumeClick = () => {
    setIsDeleteResumeDialogOpen(true);
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

  // Handle cover letter delete - open confirmation dialog
  const handleDeleteCoverLetterClick = () => {
    setIsDeleteCoverLetterDialogOpen(true);
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

  return (
    <Card className="shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h2" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t("documents.title")}
        </Typography>
      </div>

      <div className="space-y-6">
        {/* Resume Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <FilePdfOutlined className="text-2xl text-red-500 dark:text-red-400 mt-1" />
              <div className="flex-1">
                <Typography variant="h3" className="text-base font-medium mb-1 text-gray-900 dark:text-gray-100">
                  {t("documents.resume.title")}
                </Typography>
                {documents.resume_url || documents.cv_url ? (
                  <>
                    <Typography variant="text" className="text-gray-600 dark:text-gray-400 mb-2">
                      {t("documents.resume.uploaded")}
                    </Typography>
                    <a
                      href={documents.resume_url || documents.cv_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {t("documents.resume.viewResume")}
                    </a>
                  </>
                ) : (
                  <Typography variant="text" className="text-gray-600 dark:text-gray-400">
                    {t("documents.resume.uploadPrompt")}
                  </Typography>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {documents.resume_url || documents.cv_url ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                    className="hidden"
                    disabled={isUploadingResume}
                  />
                  <ReusableButton
                    variant="text"
                    icon={<EditOutlined />}
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isUploadingResume}
                  >
                    {t("documents.resume.update")}
                  </ReusableButton>
                  <ReusableButton
                    variant="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteResumeClick}
                  >
                    {t("documents.resume.delete")}
                  </ReusableButton>
                </>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                    className="hidden"
                    disabled={isUploadingResume}
                  />
                  <ReusableButton
                    variant="primary"
                    icon={<UploadOutlined />}
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isUploadingResume}
                  >
                    {t("documents.resume.upload")}
                  </ReusableButton>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cover Letter Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <FileTextOutlined className="text-2xl text-blue-500 dark:text-blue-400 mt-1" />
              <div className="flex-1">
                <Typography variant="h3" className="text-base font-medium mb-1 text-gray-900 dark:text-gray-100">
                  {t("documents.coverLetter.title")}
                </Typography>
                {documents.default_cover_letter ? (
                  <>
                    <Typography variant="text" className="text-gray-600 dark:text-gray-400 mb-2">
                      {t("documents.coverLetter.saved")}
                    </Typography>
                    <Typography variant="text" className="text-gray-500 dark:text-gray-500 text-sm line-clamp-2">
                      {documents.default_cover_letter}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="text" className="text-gray-600 dark:text-gray-400">
                    {t("documents.coverLetter.uploadPrompt")}
                  </Typography>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {documents.default_cover_letter ? (
                <>
                  <ReusableButton
                    variant="text"
                    icon={<EditOutlined />}
                    onClick={handleEditCoverLetter}
                  >
                    {t("documents.coverLetter.edit")}
                  </ReusableButton>
                  <ReusableButton
                    variant="primary"
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteCoverLetterClick}
                  >
                    {t("documents.coverLetter.delete")}
                  </ReusableButton>
                </>
              ) : (
                <ReusableButton
                  variant="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditCoverLetter}
                >
                  {t("documents.coverLetter.add")}
                </ReusableButton>
              )}
            </div>
          </div>
        </div>
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
      <ReusableDialog
        isOpen={isAnalysisModalOpen}
        setIsOpen={setIsAnalysisModalOpen}
        contentClassName="w-[800px]"
        dialogHeader={{
          title: (
            <div className="flex items-center gap-2">
              <TrophyOutlined className="text-yellow-500 dark:text-yellow-400" />
              <span>{t("documents.aiAnalysis.title")}</span>
            </div>
          ) as unknown as string,
        }}
        dialogBody={
          analysisData ? (
            <div className="py-4 space-y-6">
              {/* ATS Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <Typography variant="h3" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("documents.aiAnalysis.atsScore")}
                  </Typography>
                  <Tag 
                    color={
                      analysisData.ats_score >= 80 ? 'green' : 
                      analysisData.ats_score >= 60 ? 'orange' : 'red'
                    }
                    className="text-lg px-3 py-1"
                  >
                    {analysisData.ats_score}/100
                  </Tag>
                </div>
                <Progress 
                  percent={analysisData.ats_score} 
                  strokeColor={{
                    '0%': analysisData.ats_score >= 80 ? '#52c41a' : analysisData.ats_score >= 60 ? '#faad14' : '#ff4d4f',
                    '100%': analysisData.ats_score >= 80 ? '#73d13d' : analysisData.ats_score >= 60 ? '#ffc53d' : '#ff7a45',
                  }}
                  status="active"
                />
                <Typography variant="text" className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {analysisData.ats_score >= 80 ? t("documents.aiAnalysis.atsExcellent") :
                   analysisData.ats_score >= 60 ? t("documents.aiAnalysis.atsGood") :
                   t("documents.aiAnalysis.atsPoor")}
                </Typography>
              </div>

              {/* Extracted Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="h4" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t("documents.aiAnalysis.fullName")}
                  </Typography>
                  <Typography variant="text" className="text-gray-900 dark:text-gray-100">
                    {analysisData.ai_full_name || t("documents.aiAnalysis.notDetected")}
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="h4" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t("documents.aiAnalysis.email")}
                  </Typography>
                  <Typography variant="text" className="text-gray-900 dark:text-gray-100">
                    {analysisData.ai_email || t("documents.aiAnalysis.notDetected")}
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="h4" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t("documents.aiAnalysis.phone")}
                  </Typography>
                  <Typography variant="text" className="text-gray-900 dark:text-gray-100">
                    {analysisData.ai_phone || t("documents.aiAnalysis.notDetected")}
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="h4" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t("documents.aiAnalysis.location")}
                  </Typography>
                  <Typography variant="text" className="text-gray-900 dark:text-gray-100">
                    {analysisData.ai_location || t("documents.aiAnalysis.notDetected")}
                  </Typography>
                </div>
              </div>

              {/* Skills */}
              {analysisData.ai_skills && analysisData.ai_skills.length > 0 && (
                <div>
                  <Typography variant="h3" className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {t("documents.aiAnalysis.detectedSkills")} ({analysisData.ai_skills.length})
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.ai_skills.map((skill, index) => (
                      <Tag key={index} color="blue">{skill}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {analysisData.ai_languages && analysisData.ai_languages.length > 0 && (
                <div>
                  <Typography variant="h3" className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {t("documents.aiAnalysis.languages")}
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.ai_languages.map((lang, index) => (
                      <Tag key={index} color="green">{lang}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Summary */}
              {analysisData.ai_summary && (
                <div>
                  <Typography variant="h3" className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {t("documents.aiAnalysis.professionalSummary")}
                  </Typography>
                  <Typography variant="text" className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {analysisData.ai_summary}
                  </Typography>
                </div>
              )}

              {/* Work History */}
              {analysisData.ai_work_history && analysisData.ai_work_history.length > 0 && (
                <div>
                  <Typography variant="h3" className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    {t("documents.aiAnalysis.workHistory")}
                  </Typography>
                  <div className="space-y-3">
                    {analysisData.ai_work_history.map((work, index) => (
                      <div key={index} className="border-l-2 border-blue-500 dark:border-blue-400 pl-4">
                        <Typography variant="h4" className="font-semibold text-gray-900 dark:text-gray-100">
                          {work.role}
                        </Typography>
                        {work.company && (
                          <Typography variant="text" className="text-gray-600 dark:text-gray-400 text-sm">
                            {work.company}
                          </Typography>
                        )}
                        {work.duration && (
                          <Typography variant="text" className="text-gray-500 dark:text-gray-500 text-sm">
                            {work.duration}
                          </Typography>
                        )}
                        <Typography variant="text" className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                          {work.description}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education History */}
              {analysisData.ai_education_history && analysisData.ai_education_history.length > 0 && (
                <div>
                  <Typography variant="h3" className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    {t("documents.aiAnalysis.education")}
                  </Typography>
                  <div className="space-y-2">
                    {analysisData.ai_education_history.map((edu, index) => (
                      <div key={index} className="border-l-2 border-green-500 dark:border-green-400 pl-4">
                        <Typography variant="h4" className="font-semibold text-gray-900 dark:text-gray-100">
                          {edu.degree}
                        </Typography>
                        <Typography variant="text" className="text-gray-600 dark:text-gray-400 text-sm">
                          {edu.institution}
                        </Typography>
                        <Typography variant="text" className="text-gray-500 dark:text-gray-500 text-sm">
                          {edu.year}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Evaluation */}
              {analysisData.ai_overall_evaluation && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <InfoCircleOutlined className="text-yellow-600 dark:text-yellow-500 mt-1" />
                    <div>
                      <Typography variant="h3" className="text-base font-semibold mb-2 text-yellow-900 dark:text-yellow-200">
                        {t("documents.aiAnalysis.aiEvaluation")}
                      </Typography>
                      <Typography variant="text" className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {analysisData.ai_overall_evaluation}
                      </Typography>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Info */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <CheckCircleOutlined className="text-green-500 dark:text-green-400" />
                <span>
                  {t("documents.aiAnalysis.analysisCompleted")} {new Date(analysisData.analysis_completed_at).toLocaleDateString()} {t("documents.aiAnalysis.at")}{' '}
                  {new Date(analysisData.analysis_completed_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ) : null
        }
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t("documents.aiAnalysis.close")}
              onClick={() => setIsAnalysisModalOpen(false)}
              variant="primary"
            />
          </Flex>
        }
      />
    </Card>
  );
}
