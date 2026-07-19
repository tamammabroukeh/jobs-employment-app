"use client";

import { Progress, Tag } from "antd";
import {
  TrophyOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Typography, ReusableButton, ReusableDialog, Flex } from "@/components/Reusable-Components";
import { IAIAnalysisProfile } from "@/apis/services/job-seeker/interface";
import { useProfileTranslations } from "@/hooks/use-profile";

interface AIAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: IAIAnalysisProfile | null;
}

export default function AIAnalysisDialog({ isOpen, onClose, analysisData }: AIAnalysisDialogProps) {
  const t = useProfileTranslations();

  if (!analysisData) return null;

  const getScoreMessage = (score: number) => {
    if (score >= 80) return t("documents.aiAnalysis.atsExcellent");
    if (score >= 60) return t("documents.aiAnalysis.atsGood");
    return t("documents.aiAnalysis.atsPoor");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { from: '#52c41a', to: '#73d13d' };
    if (score >= 60) return { from: '#faad14', to: '#ffc53d' };
    return { from: '#ff4d4f', to: '#ff7a45' };
  };

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={onClose}
      contentClassName="w-[1000px]!"
      dialogHeader={{
        title: (
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-warning" />
            <span>{t("documents.aiAnalysis.title")}</span>
          </div>
        ) as unknown as string,
      }}
      dialogBody={
        <div className="py-4 space-y-6">
          {/* ATS Score */}
          <div className="bg-doc-analysis-bg p-4 rounded-lg border border-doc-analysis-border">
            <div className="flex items-center justify-between mb-3">
              <Typography variant="h3" className="text-lg font-semibold text-doc-section-text">
                {t("documents.aiAnalysis.atsScore")}
              </Typography>
              <Tag
                color={analysisData.ats_score >= 80 ? 'green' : analysisData.ats_score >= 60 ? 'orange' : 'red'}
                className="text-lg px-3 py-1"
              >
                {analysisData.ats_score}/100
              </Tag>
            </div>
            <Progress
              percent={analysisData.ats_score}
              strokeColor={getScoreColor(analysisData.ats_score)}
              status="active"
            />
            <Typography variant="text" className="text-sm text-doc-section-text-muted mt-2">
              {getScoreMessage(analysisData.ats_score)}
            </Typography>
          </div>

          {/* Extracted Information */}
          <div className="grid grid-cols-2 gap-4">
            <InfoField label={t("documents.aiAnalysis.fullName")} value={analysisData.ai_full_name} />
            <InfoField label={t("documents.aiAnalysis.email")} value={analysisData.ai_email} />
            <InfoField label={t("documents.aiAnalysis.phone")} value={analysisData.ai_phone} />
            <InfoField label={t("documents.aiAnalysis.location")} value={analysisData.ai_location} />
          </div>

          {/* Skills */}
          {analysisData.ai_skills && analysisData.ai_skills.length > 0 && (
            <TagSection
              title={`${t("documents.aiAnalysis.detectedSkills")} (${analysisData.ai_skills.length})`}
              items={analysisData.ai_skills}
              color="blue"
            />
          )}

          {/* Languages */}
          {analysisData.ai_languages && analysisData.ai_languages.length > 0 && (
            <TagSection
              title={t("documents.aiAnalysis.languages")}
              items={analysisData.ai_languages}
              color="green"
            />
          )}

          {/* Professional Summary */}
          {analysisData.ai_summary && (
            <TextSection title={t("documents.aiAnalysis.professionalSummary")} content={analysisData.ai_summary} />
          )}

          {/* Work History */}
          {analysisData.ai_work_history && analysisData.ai_work_history.length > 0 && (
            <div>
              <Typography variant="h3" className="text-base font-semibold mb-3 text-doc-section-text">
                {t("documents.aiAnalysis.workHistory")}
              </Typography>
              <div className="space-y-3">
                {analysisData.ai_work_history.map((work, index) => (
                  <div key={index} className="border-l-2 border-doc-work-history-border pl-4">
                    <Typography variant="h4" className="font-semibold text-doc-section-text">
                      {work.role}
                    </Typography>
                    {work.company && (
                      <Typography variant="text" className="text-doc-section-text-muted text-sm">
                        {work.company}
                      </Typography>
                    )}
                    {work.duration && (
                      <Typography variant="text" className="text-muted-foreground text-sm">
                        {work.duration}
                      </Typography>
                    )}
                    <Typography variant="text" className="text-doc-section-text text-sm mt-1">
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
              <Typography variant="h3" className="text-base font-semibold mb-3 text-doc-section-text">
                {t("documents.aiAnalysis.education")}
              </Typography>
              <div className="space-y-2">
                {analysisData.ai_education_history.map((edu, index) => (
                  <div key={index} className="border-l-2 border-doc-education-border pl-4">
                    <Typography variant="h4" className="font-semibold text-doc-section-text">
                      {edu.degree}
                    </Typography>
                    <Typography variant="text" className="text-doc-section-text-muted text-sm">
                      {edu.institution}
                    </Typography>
                    <Typography variant="text" className="text-muted-foreground text-sm">
                      {edu.year}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overall Evaluation */}
          {analysisData.ai_overall_evaluation && (
            <div className="bg-doc-evaluation-bg p-4 rounded-lg border border-doc-evaluation-border">
              <div className="flex items-start gap-2">
                <InfoCircleOutlined className="text-doc-evaluation-icon mt-1" />
                <div>
                  <Typography variant="h3" className="text-base font-semibold mb-2 text-doc-evaluation-text">
                    {t("documents.aiAnalysis.aiEvaluation")}
                  </Typography>
                  <Typography variant="text" className="text-doc-section-text text-sm leading-relaxed">
                    {analysisData.ai_overall_evaluation}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Info */}
          <div className="flex items-center gap-2 text-sm text-doc-section-text-muted pt-4 border-t border-doc-section-border">
            <CheckCircleOutlined className="text-success" />
            <span>
              {t("documents.aiAnalysis.analysisCompleted")} {new Date(analysisData.analysis_completed_at).toLocaleDateString()} {t("documents.aiAnalysis.at")}{' '}
              {new Date(analysisData.analysis_completed_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t("documents.aiAnalysis.close")}
            onClick={onClose}
            variant="primary"
          />
        </Flex>
      }
    />
  );
}

// Helper Components
function InfoField({ label, value }: { label: string; value: string | null }) {
  const t = useProfileTranslations();
  return (
    <div>
      <Typography variant="h4" className="text-sm font-semibold text-doc-section-text-muted mb-1">
        {label}
      </Typography>
      <Typography variant="text" className="text-doc-section-text">
        {value || t("documents.aiAnalysis.notDetected")}
      </Typography>
    </div>
  );
}

function TagSection({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <Typography variant="h3" className="text-base font-semibold mb-2 text-doc-section-text">
        {title}
      </Typography>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Tag key={index} color={color}>{item}</Tag>
        ))}
      </div>
    </div>
  );
}

function TextSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <Typography variant="h3" className="text-base font-semibold mb-2 text-doc-section-text">
        {title}
      </Typography>
      <Typography variant="text" className="text-doc-section-text leading-relaxed">
        {content}
      </Typography>
    </div>
  );
}
