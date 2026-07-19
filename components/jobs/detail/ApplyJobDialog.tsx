"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Typography,
  ReusableButton,
  ReusableDialog,
  Flex,
} from "@/components/Reusable-Components";
import { Input } from "antd";
import { useJobDetailTranslations } from "@/hooks/use-translations";
import { applyForJobAction } from "@/apis/services/job-seeker/actions";
import { toast } from "sonner";

const { TextArea } = Input;

interface ApplyJobDialogProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onClose: () => void;
}

// Zod schema matching API requirements
const applyJobSchema = z.object({
  cover_letter: z.string().max(1000).optional(),
  resume: z.instanceof(File).optional(),
  education: z.string().max(255).optional(),
  last_work: z.string().max(255).optional(),
  years_of_experience: z.number().min(0).max(60).optional(),
  why_join: z.string().max(2000).optional(),
  what_to_add: z.string().max(2000).optional(),
  positions_suited_for: z.string().optional(), // Will be converted to array
  notice_period: z.string().max(100).optional(),
  expected_salary: z.string().max(100).optional(),
});

type ApplyJobFormData = z.infer<typeof applyJobSchema>;

export default function ApplyJobDialog({
  jobId,
  jobTitle,
  open,
  onClose,
}: ApplyJobDialogProps) {
  const t = useJobDetailTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApplyJobFormData>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      cover_letter: "",
      education: "",
      last_work: "",
      years_of_experience: undefined,
      why_join: "",
      what_to_add: "",
      positions_suited_for: "",
      notice_period: "",
      expected_salary: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("applyDialog.validation.fileTooLarge"));
      return;
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error(t("applyDialog.validation.invalidFileType"));
      return;
    }

    setSelectedFile(file);
    setValue("resume", file);
  };

  const onSubmit = async (data: ApplyJobFormData) => {
    setIsSubmitting(true);

    try {
      // Convert positions_suited_for from comma-separated string to array
      const positions = data.positions_suited_for
        ? data.positions_suited_for.split(',').map(p => p.trim()).filter(p => p)
        : undefined;

      const result = await applyForJobAction({
        job_post_id: jobId,
        cover_letter: data.cover_letter,
        resume: data.resume,
        education: data.education,
        last_work: data.last_work,
        years_of_experience: data.years_of_experience,
        why_join: data.why_join,
        what_to_add: data.what_to_add,
        positions_suited_for: positions,
        notice_period: data.notice_period,
        expected_salary: data.expected_salary,
      });

      if (result?.data?.success) {
        toast.success(result.data.message || t("applyDialog.success"));
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        toast.error(t("applyDialog.error"));
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(t("applyDialog.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  return (
    <ReusableDialog
      isOpen={open}
      setIsOpen={handleClose}
      contentClassName="max-w-3xl max-h-[90vh] overflow-y-auto"
      dialogHeader={{
        title: t("applyDialog.title", { jobTitle }),
        description: t("applyDialog.applicationDetails"),
      }}
      dialogBody={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Info Message */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <Typography variant="p" className="text-sm text-gray-700 dark:text-gray-300">
              {t("applyDialog.useProfileDocuments")}
            </Typography>
            <Typography variant="p" className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("applyDialog.orUploadNew")}
            </Typography>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.coverLetter")}
              </Typography>
            </label>
            <Controller
              name="cover_letter"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={6}
                  placeholder={t("applyDialog.coverLetterPlaceholder")}
                  maxLength={1000}
                  showCount
                  status={errors.cover_letter ? "error" : undefined}
                />
              )}
            />
            {errors.cover_letter && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.cover_letter.message}
              </Typography>
            )}
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.resume")}
              </Typography>
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-file-pdf text-red-500 text-xl" />
                    <div>
                      <Typography variant="p" className="text-foreground text-sm">
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="p" className="text-gray-500 text-xs">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </div>
                  </div>
                  <ReusableButton
                    variant="text"
                    onClick={() => {
                      setSelectedFile(null);
                      setValue("resume", undefined);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <i className="fa-solid fa-times" />
                  </ReusableButton>
                </div>
              ) : (
                <div className="text-center">
                  <Typography variant="p" className="">
                  <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 dark:text-gray-600" />
                  </Typography>
                  <ReusableButton
                    variant="default"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    {t("applyDialog.uploadResume")}
                  </ReusableButton>
                  <Typography variant="p" className="text-gray-500 text-xs mt-2">
                    {t("applyDialog.resumeInfo")}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Header */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Typography variant="h4" className="text-foreground mb-4">
              {t("applyDialog.additionalInfo")}
            </Typography>
          </div>

          {/* Education */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.education")}
              </Typography>
            </label>
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("applyDialog.educationPlaceholder")}
                  maxLength={255}
                  status={errors.education ? "error" : undefined}
                />
              )}
            />
            {errors.education && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.education.message}
              </Typography>
            )}
          </div>

          {/* Last Work */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.lastWork")}
              </Typography>
            </label>
            <Controller
              name="last_work"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("applyDialog.lastWorkPlaceholder")}
                  maxLength={255}
                  status={errors.last_work ? "error" : undefined}
                />
              )}
            />
            {errors.last_work && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.last_work.message}
              </Typography>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.yearsOfExperience")}
              </Typography>
            </label>
            <Controller
              name="years_of_experience"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  max={60}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  status={errors.years_of_experience ? "error" : undefined}
                />
              )}
            />
            {errors.years_of_experience && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.years_of_experience.message}
              </Typography>
            )}
          </div>

          {/* Why Join */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.whyJoin")}
              </Typography>
            </label>
            <Controller
              name="why_join"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={4}
                  placeholder={t("applyDialog.whyJoinPlaceholder")}
                  maxLength={2000}
                  showCount
                  status={errors.why_join ? "error" : undefined}
                />
              )}
            />
            {errors.why_join && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.why_join.message}
              </Typography>
            )}
          </div>

          {/* What to Add */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.whatToAdd")}
              </Typography>
            </label>
            <Controller
              name="what_to_add"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={4}
                  placeholder={t("applyDialog.whatToAddPlaceholder")}
                  maxLength={2000}
                  showCount
                  status={errors.what_to_add ? "error" : undefined}
                />
              )}
            />
            {errors.what_to_add && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.what_to_add.message}
              </Typography>
            )}
          </div>

          {/* Positions Suited For */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.positionsSuitedFor")}
              </Typography>
            </label>
            <Controller
              name="positions_suited_for"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("applyDialog.positionsSuitedForPlaceholder")}
                  status={errors.positions_suited_for ? "error" : undefined}
                />
              )}
            />
            <Typography variant="p" className="text-gray-500 text-xs mt-1">
              Comma-separated values
            </Typography>
            {errors.positions_suited_for && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.positions_suited_for.message}
              </Typography>
            )}
          </div>

          {/* Notice Period */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.noticePeriod")}
              </Typography>
            </label>
            <Controller
              name="notice_period"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("applyDialog.noticePeriodPlaceholder")}
                  maxLength={100}
                  status={errors.notice_period ? "error" : undefined}
                />
              )}
            />
            {errors.notice_period && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.notice_period.message}
              </Typography>
            )}
          </div>

          {/* Expected Salary */}
          <div>
            <label className="block mb-2">
              <Typography variant="small" className="text-foreground font-medium">
                {t("applyDialog.expectedSalary")}
              </Typography>
            </label>
            <Controller
              name="expected_salary"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("applyDialog.expectedSalaryPlaceholder")}
                  maxLength={100}
                  status={errors.expected_salary ? "error" : undefined}
                />
              )}
            />
            {errors.expected_salary && (
              <Typography variant="p" className="text-red-500 text-sm mt-1">
                {errors.expected_salary.message}
              </Typography>
            )}
          </div>
        </form>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t("applyDialog.cancel")}
            onClick={handleClose}
            variant="default"
            disabled={isSubmitting}
          />
          <ReusableButton
            btnText={isSubmitting ? t("applyDialog.applying") : t("applyDialog.confirmApply")}
            onClick={handleSubmit(onSubmit)}
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Flex>
      }
    />
  );
}
