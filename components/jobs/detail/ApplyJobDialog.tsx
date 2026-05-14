"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  ReusableButton,
  ReusableDialog,
  ReusableSelect,
  ReusableInput,
} from "@/components/Reusable-Components";
import { useJobDetailTranslations } from "@/hooks/use-translations";
import { Radio } from "antd";

interface ApplyJobFormData {
  currentStatus: "working" | "notWorking";
  noticePeriod: string;
  salaryFrom: number;
  salaryTo: number;
}

interface ApplyJobDialogProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onClose: () => void;
}

export default function ApplyJobDialog({
  jobId,
  jobTitle,
  open,
  onClose,
}: ApplyJobDialogProps) {
  const t = useJobDetailTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyJobFormData>({
    defaultValues: {
      currentStatus: "notWorking",
      noticePeriod: "immediate",
      salaryFrom: 0,
      salaryTo: 0,
    },
  });

  const noticePeriodOptions = [
    {
      title: t("applyDialog.noticePeriodOptions.immediate"),
      value: "immediate",
    },
    { title: t("applyDialog.noticePeriodOptions.oneWeek"), value: "oneWeek" },
    { title: t("applyDialog.noticePeriodOptions.twoWeeks"), value: "twoWeeks" },
    { title: t("applyDialog.noticePeriodOptions.oneMonth"), value: "oneMonth" },
    {
      title: t("applyDialog.noticePeriodOptions.twoMonths"),
      value: "twoMonths",
    },
  ];

  const onSubmit = async (data: ApplyJobFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Application submitted:", { ...data, jobId });

      setSubmitStatus("success");
      setTimeout(() => {
        reset();
        onClose();
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSubmitStatus("idle");
      onClose();
    }
  };

  return (
    <ReusableDialog
      dialogBody={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Application Details Header */}
          <Typography variant="h4" className="text-foreground">
            {t("applyDialog.applicationDetails")}
          </Typography>

          {/* Current Job Status */}
          <div>
            <label className="block mb-3">
              <Typography
                variant="small"
                className="text-foreground font-medium"
              >
                {t("applyDialog.currentStatus")}{" "}
                <span className="text-destructive">*</span>
              </Typography>
            </label>
            <Controller
              name="currentStatus"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Radio.Group {...field} className="w-full">
                  <Radio value="working">
                    {t("applyDialog.statusWorking")}
                  </Radio>
                  <Radio value="notWorking">
                    {t("applyDialog.statusNotWorking")}
                  </Radio>
                </Radio.Group>
              )}
            />
            {errors.currentStatus && (
              <Typography variant="error" className="mt-1">
                {errors.currentStatus.message}
              </Typography>
            )}
          </div>

          {/* Notice Period */}
          <div>
            <label className="block mb-2">
              <Typography
                variant="small"
                className="text-foreground font-medium"
              >
                {t("applyDialog.noticePeriod")}{" "}
                <span className="text-destructive">*</span>
              </Typography>
            </label>
            <Controller
              name="noticePeriod"
              control={control}
              rules={{ required: "Notice period is required" }}
              render={({ field }) => (
                <ReusableSelect
                  {...field}
                  selectValues={noticePeriodOptions}
                  placeholder={t("applyDialog.noticePeriod")}
                  size="large"
                />
              )}
            />
            {errors.noticePeriod && (
              <Typography variant="error" className="mt-1">
                {errors.noticePeriod.message}
              </Typography>
            )}
          </div>

          {/* Expected Salary Range */}
          <div>
            <label className="block mb-2">
              <Typography
                variant="small"
                className="text-foreground font-medium"
              >
                {t("applyDialog.expectedSalary")}{" "}
                <span className="text-destructive">*</span>
              </Typography>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="salaryFrom"
                  control={control}
                  rules={{
                    required: "Minimum salary is required",
                    min: { value: 1, message: "Must be greater than 0" },
                  }}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      type="number"
                      placeholder={t("applyDialog.salaryFrom")}
                      prefix="$"
                      size="large"
                      status={errors.salaryFrom ? "error" : undefined}
                    />
                  )}
                />
                {errors.salaryFrom && (
                  <Typography variant="error" className="mt-1">
                    {errors.salaryFrom.message}
                  </Typography>
                )}
              </div>
              <div>
                <Controller
                  name="salaryTo"
                  control={control}
                  rules={{
                    required: "Maximum salary is required",
                    min: { value: 1, message: "Must be greater than 0" },
                    validate: (value, formValues) =>
                      value >= formValues.salaryFrom ||
                      "Must be greater than minimum salary",
                  }}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      type="number"
                      placeholder={t("applyDialog.salaryTo")}
                      prefix="$"
                      size="large"
                      status={errors.salaryTo ? "error" : undefined}
                    />
                  )}
                />
                {errors.salaryTo && (
                  <Typography variant="error" className="mt-1">
                    {errors.salaryTo.message}
                  </Typography>
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="bg-success/10 border border-success rounded-lg p-4">
              <Typography variant="success" className="text-center">
                {t("applyDialog.success")}
              </Typography>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
              <Typography variant="error" className="text-center">
                {t("applyDialog.error")}
              </Typography>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <ReusableButton
              variant="default"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("applyDialog.cancel")}
            </ReusableButton>
            <ReusableButton
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("applyDialog.applying")
                : t("applyDialog.confirmApply")}
            </ReusableButton>
          </div>
        </form>
      }
      isOpen={open}
      dialogHeader={{
        title: t("applyDialog.title", { jobTitle }),
      }}
      setIsOpen={handleClose}
    ></ReusableDialog>
  );
}
