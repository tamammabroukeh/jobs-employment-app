"use client";

import { DeleteOutlined, EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { Typography, ReusableButton } from "@/components/Reusable-Components";
import { useProfileTranslations } from "@/hooks/use-profile";

interface CoverLetterCardProps {
  coverLetter: string | null;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export default function CoverLetterCard({ coverLetter, onEditClick, onDeleteClick }: CoverLetterCardProps) {
  const t = useProfileTranslations();

  return (
    <div className="border border-doc-section-border rounded-lg p-4 bg-doc-section-bg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <FileTextOutlined className="text-2xl text-doc-icon-file mt-1" />
          <div className="flex-1">
            <Typography variant="h3" className="text-base font-medium mb-1 text-doc-section-text">
              {t("documents.coverLetter.title")}
            </Typography>
            {coverLetter ? (
              <>
                <Typography variant="text" className="text-doc-section-text-muted mb-2">
                  {t("documents.coverLetter.saved")}
                </Typography>
                <Typography variant="text" className="text-muted-foreground text-sm line-clamp-2">
                  {coverLetter}
                </Typography>
              </>
            ) : (
              <Typography variant="text" className="text-doc-section-text-muted">
                {t("documents.coverLetter.uploadPrompt")}
              </Typography>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {coverLetter ? (
            <>
              <ReusableButton
                variant="text"
                icon={<EditOutlined />}
                onClick={onEditClick}
              >
                {t("documents.coverLetter.edit")}
              </ReusableButton>
              <ReusableButton
                variant="primary"
                icon={<DeleteOutlined />}
                onClick={onDeleteClick}
              >
                {t("documents.coverLetter.delete")}
              </ReusableButton>
            </>
          ) : (
            <ReusableButton
              variant="primary"
              icon={<EditOutlined />}
              onClick={onEditClick}
            >
              {t("documents.coverLetter.add")}
            </ReusableButton>
          )}
        </div>
      </div>
    </div>
  );
}
