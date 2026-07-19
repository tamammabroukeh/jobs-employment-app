"use client";

import { useRef } from "react";
import { UploadOutlined, DeleteOutlined, EditOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Typography, ReusableButton } from "@/components/Reusable-Components";
import { useProfileTranslations } from "@/hooks/use-profile";

interface ResumeCardProps {
  resumeUrl: string | null;
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteClick: () => void;
}

export default function ResumeCard({ resumeUrl, isUploading, onFileChange, onDeleteClick }: ResumeCardProps) {
  const t = useProfileTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-doc-section-border rounded-lg p-4 bg-doc-section-bg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <FilePdfOutlined className="text-2xl text-doc-icon-pdf mt-1" />
          <div className="flex-1">
            <Typography variant="h3" className="text-base font-medium mb-1 text-doc-section-text">
              {t("documents.resume.title")}
            </Typography>
            {resumeUrl ? (
              <>
                <Typography variant="text" className="text-doc-section-text-muted mb-2">
                  {t("documents.resume.uploaded")}
                </Typography>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {t("documents.resume.viewResume")}
                </a>
              </>
            ) : (
              <Typography variant="text" className="text-doc-section-text-muted">
                {t("documents.resume.uploadPrompt")}
              </Typography>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {resumeUrl ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onFileChange}
                className="hidden"
                disabled={isUploading}
              />
              <ReusableButton
                variant="text"
                icon={<EditOutlined />}
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
              >
                {t("documents.resume.update")}
              </ReusableButton>
              <ReusableButton
                variant="text"
                danger
                icon={<DeleteOutlined />}
                onClick={onDeleteClick}
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
                onChange={onFileChange}
                className="hidden"
                disabled={isUploading}
              />
              <ReusableButton
                variant="primary"
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
              >
                {t("documents.resume.upload")}
              </ReusableButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
