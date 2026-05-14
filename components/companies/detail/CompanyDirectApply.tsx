'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Typography, ReusableInput, ReusableButton } from '@/components/Reusable-Components';
import { useCompaniesTranslations } from '@/hooks/use-translations';
import { Input } from 'antd';

const { TextArea } = Input;

interface DirectApplyFormData {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: FileList;
}

interface CompanyDirectApplyProps {
  companyId: string;
  companyName: string;
}

export default function CompanyDirectApply({ companyId, companyName }: CompanyDirectApplyProps) {
  const t = useCompaniesTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DirectApplyFormData>();

  const onSubmit = async (data: DirectApplyFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      console.log('Application submitted:', { ...data, companyId, companyName });
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <Typography variant="h3" className="text-foreground mb-4">
          {t('detail.directApply.title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground leading-relaxed">
          {t('detail.directApply.description')}
        </Typography>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="auth-card p-8 space-y-6">
        {/* Full Name */}
        <div>
          <label className="block mb-2">
            <Typography variant="small" className="text-foreground font-medium">
              {t('detail.directApply.form.fullName')} <span className="text-destructive">*</span>
            </Typography>
          </label>
          <Controller
            name="fullName"
            control={control}
            rules={{ required: 'Full name is required' }}
            render={({ field }) => (
              <ReusableInput
                {...field}
                size="large"
                placeholder={t('detail.directApply.form.fullName')}
                status={errors.fullName ? 'error' : undefined}
              />
            )}
          />
          {errors.fullName && (
            <Typography variant="error" className="mt-1">
              {errors.fullName.message}
            </Typography>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2">
            <Typography variant="small" className="text-foreground font-medium">
              {t('detail.directApply.form.email')} <span className="text-destructive">*</span>
            </Typography>
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <ReusableInput
                {...field}
                type="email"
                size="large"
                placeholder={t('detail.directApply.form.email')}
                status={errors.email ? 'error' : undefined}
              />
            )}
          />
          {errors.email && (
            <Typography variant="error" className="mt-1">
              {errors.email.message}
            </Typography>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2">
            <Typography variant="small" className="text-foreground font-medium">
              {t('detail.directApply.form.phone')} <span className="text-destructive">*</span>
            </Typography>
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{ required: 'Phone number is required' }}
            render={({ field }) => (
              <ReusableInput
                {...field}
                type="tel"
                size="large"
                placeholder={t('detail.directApply.form.phone')}
                status={errors.phone ? 'error' : undefined}
              />
            )}
          />
          {errors.phone && (
            <Typography variant="error" className="mt-1">
              {errors.phone.message}
            </Typography>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block mb-2">
            <Typography variant="small" className="text-foreground font-medium">
              {t('detail.directApply.form.coverLetter')} <span className="text-destructive">*</span>
            </Typography>
          </label>
          <Controller
            name="coverLetter"
            control={control}
            rules={{
              required: 'Cover letter is required',
              minLength: {
                value: 100,
                message: 'Cover letter must be at least 100 characters',
              },
            }}
            render={({ field }) => (
              <TextArea
                {...field}
                rows={6}
                placeholder={t('detail.directApply.form.coverLetterPlaceholder')}
                status={errors.coverLetter ? 'error' : undefined}
                className="w-full"
              />
            )}
          />
          {errors.coverLetter && (
            <Typography variant="error" className="mt-1">
              {errors.coverLetter.message}
            </Typography>
          )}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block mb-2">
            <Typography variant="small" className="text-foreground font-medium">
              {t('detail.directApply.form.resume')} <span className="text-destructive">*</span>
            </Typography>
          </label>
          <Controller
            name="resume"
            control={control}
            rules={{ required: 'Resume is required' }}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => onChange(e.target.files)}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90
                  file:cursor-pointer cursor-pointer"
              />
            )}
          />
          {errors.resume && (
            <Typography variant="error" className="mt-1">
              {errors.resume.message}
            </Typography>
          )}
        </div>

        {/* Submit Button */}
        <ReusableButton
          type="submit"
          variant="primary"
          size="large"
          className="w-full"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('detail.directApply.form.submitting') : t('detail.directApply.form.submit')}
        </ReusableButton>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="bg-success/10 border border-success rounded-lg p-4">
            <Typography variant="success" className="text-center">
              {t('detail.directApply.success')}
            </Typography>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
            <Typography variant="error" className="text-center">
              {t('detail.directApply.error')}
            </Typography>
          </div>
        )}
      </form>
    </div>
  );
}
