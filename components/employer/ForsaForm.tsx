'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { Typography, ReusableButton, ReusableInput, ReusableSelect } from '@/components/Reusable-Components';
import { Input } from 'antd';
import ROUTES from '@/constants/routes';
import { createJobAction, updateJobAction } from '@/apis/services/employer/actions';
import type { Job } from '@/apis/services/employer';

const { TextArea } = Input;

const forsaSchema = z.object({
  communication_method: z.string().min(1, 'Communication method is required'),
  communication_value: z.string().nullable().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  roles: z.string().min(1, 'At least one role is required'), // Will be split into array
  portfolio_required: z.boolean(),
  cover_letter_required: z.boolean(),
  gender: z.string().min(1, 'Gender preference is required'),
  age_from: z.number().nullable().optional(),
  age_to: z.number().nullable().optional(),
  education_level: z.string().min(1, 'Education level is required'),
  job_level: z.string().min(1, 'Job level is required'),
  experience_years: z.number().min(0, 'Experience years must be positive'),
  languages: z.string().min(1, 'At least one language is required'), // Will be split into array
  vacancies: z.number().min(1, 'At least one vacancy is required'),
  job_type: z.string().min(1, 'Job type is required'),
  work_mode: z.string().min(1, 'Work mode is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Address is required'),
  salary_from: z.string().min(1, 'Minimum salary is required'),
  salary_to: z.string().min(1, 'Maximum salary is required'),
  currency: z.string().min(1, 'Currency is required'),
  display_salary: z.boolean(),
  incentives: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  questions: z.string().optional(), // Will be parsed to array
  tags: z.string().min(1, 'At least one tag is required'), // Will be split into array
  category: z.string().min(1, 'Category is required'),
  expires_at: z.string().min(1, 'Expiry date is required'),
});

type ForsaFormData = z.infer<typeof forsaSchema>;

interface ForsaFormProps {
  mode: 'create' | 'edit';
  initialData?: Job;
  jobId?: string;
}

export default function ForsaForm({ mode, initialData, jobId }: ForsaFormProps) {
  const router = useRouter();
  const t = useTranslations('employer.forsa');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForsaFormData>({
    resolver: zodResolver(forsaSchema),
    defaultValues: initialData
      ? {
          communication_method: initialData.communication_method,
          communication_value: initialData.communication_value,
          title: initialData.title,
          roles: initialData.roles.join(', '),
          portfolio_required: initialData.portfolio_required,
          cover_letter_required: initialData.cover_letter_required,
          gender: initialData.gender,
          age_from: initialData.age_from,
          age_to: initialData.age_to,
          education_level: initialData.education_level,
          job_level: initialData.job_level,
          experience_years: initialData.experience_years,
          languages: initialData.languages.join(', '),
          vacancies: initialData.vacancies,
          job_type: initialData.job_type,
          work_mode: initialData.work_mode,
          city: initialData.city,
          address: initialData.address,
          salary_from: initialData.salary_from,
          salary_to: initialData.salary_to,
          currency: initialData.currency,
          display_salary: initialData.display_salary,
          incentives: initialData.incentives,
          description: initialData.description,
          requirements: initialData.requirements,
          questions: initialData.questions.map(q => `${q.question}|${q.required}`).join('\n'),
          tags: initialData.tags.join(', '),
          category: initialData.category,
          expires_at: initialData.expires_at,
        }
      : {
          communication_method: 'by_forsa',
          communication_value: null,
          portfolio_required: false,
          cover_letter_required: false,
          gender: 'no_preference',
          age_from: null,
          age_to: null,
          experience_years: 0,
          vacancies: 1,
          currency: 'USD',
          display_salary: true,
          work_mode: 'on_site',
        },
  });

  const onSubmit = async (data: ForsaFormData) => {
    setIsLoading(true);
    try {
      // Convert comma-separated strings to arrays and parse questions
      const payload = {
        communication_method: data.communication_method,
        communication_value: data.communication_value || null,
        title: data.title,
        roles: data.roles.split(',').map((role) => role.trim()).filter(Boolean),
        portfolio_required: data.portfolio_required,
        cover_letter_required: data.cover_letter_required,
        gender: data.gender,
        age_from: data.age_from,
        age_to: data.age_to,
        education_level: data.education_level,
        job_level: data.job_level,
        experience_years: data.experience_years,
        languages: data.languages.split(',').map((lang) => lang.trim()).filter(Boolean),
        vacancies: data.vacancies,
        job_type: data.job_type,
        work_mode: data.work_mode,
        city: data.city,
        address: data.address,
        salary_from: data.salary_from,
        salary_to: data.salary_to,
        currency: data.currency,
        display_salary: data.display_salary,
        incentives: data.incentives || '',
        description: data.description,
        requirements: data.requirements,
        questions: data.questions
          ? data.questions.split('\n').filter(Boolean).map((line) => {
              const [question, required] = line.split('|');
              return { question: question.trim(), required: required?.trim() || 'false' };
            })
          : [],
        tags: data.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        category: data.category,
        expires_at: data.expires_at,
      };

      if (mode === 'create') {
        const result = await createJobAction(payload);
        console.log('result', result);
        if (result?.data) {
          toast.success(t('messages.createSuccess'));
          router.push(ROUTES.EMPLOYER.MANAGE_JOBS);
        }
      } else if (mode === 'edit' && jobId) {
        const result = await updateJobAction({ ...payload, id: jobId });
        if (result?.data) {
          toast.success(t('messages.updateSuccess'));
          router.push(ROUTES.EMPLOYER.MANAGE_JOBS);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(mode === 'create' ? t('messages.createError') : t('messages.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Typography variant="h1" className="text-foreground mb-4">
            {mode === 'create' ? t('title.create') : t('title.edit')}
          </Typography>
        </div>

        {/* How to Receive CVs Section */}
        <Controller
          name="communication_method"
          control={control}
          render={({ field }) => (
            <div className="auth-card p-6">
              <Typography variant="h2" className="text-foreground mb-4">
                {t('cvReceive.title')}
              </Typography>
              <Typography variant="p" className="text-muted-foreground mb-6">
                {t('cvReceive.description')}
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => field.onChange('by_email')}
                  className={`p-6 border-2 rounded-lg text-center transition-all ${
                    field.value === 'by_email'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <i className="fa-solid fa-envelope text-4xl text-primary mb-3" />
                  <Typography variant="h4" className="text-foreground mb-2">
                    {t('cvReceive.byEmail.title')}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    {t('cvReceive.byEmail.description')}
                  </Typography>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange('by_forsa')}
                  className={`p-6 border-2 rounded-lg text-center transition-all ${
                    field.value === 'by_forsa'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <i className="fa-solid fa-info-circle text-4xl text-primary mb-3" />
                  <Typography variant="h4" className="text-foreground mb-2">
                    {t('cvReceive.byForsa.title')}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    {t('cvReceive.byForsa.description')}
                  </Typography>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange('by_website')}
                  className={`p-6 border-2 rounded-lg text-center transition-all ${
                    field.value === 'by_website'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <i className="fa-solid fa-globe text-4xl text-primary mb-3" />
                  <Typography variant="h4" className="text-foreground mb-2">
                    {t('cvReceive.byWebsite.title')}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    {t('cvReceive.byWebsite.description')}
                  </Typography>
                </button>
              </div>

              {/* Conditional communication value input */}
              {field.value !== 'by_forsa' && (
                <Controller
                  name="communication_value"
                  control={control}
                  render={({ field: valueField }) => (
                    <div>
                      <label className="block mb-2">
                        <Typography variant="p" className="text-foreground">
                          {t('cvReceive.communicationValue')} <span className="text-red-500">*</span>
                        </Typography>
                      </label>
                      <ReusableInput
                        {...valueField}
                        value={valueField.value || ''}
                        placeholder={t('placeholders.communicationValue')}
                        hasError={!!errors.communication_value}
                        size="large"
                      />
                      {errors.communication_value && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          {errors.communication_value.message}
                        </Typography>
                      )}
                    </div>
                  )}
                />
              )}
            </div>
          )}
        />

        {/* Required Employee Specification */}
        <div className="auth-card p-6">
          <Typography variant="h2" className="text-foreground mb-6">
            {t('employeeSpec.title')}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('employeeSpec.jobTitle')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    placeholder={t('placeholders.jobTitle')}
                    hasError={!!errors.title}
                    size="large"
                  />
                )}
              />
              {errors.title && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.title.message}
                </Typography>
              )}
            </div>

            {/* Category */}
            <div>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <ReusableSelect
                    label={`${t('employeeSpec.category')} *`}
                    placeholder={t('placeholders.selectCategory')}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.category?.message}
                    size="large"
                    selectValues={[
                      { title: t('categories.engineering'), value: 'Engineering' },
                      { title: t('categories.design'), value: 'Design' },
                      { title: t('categories.marketing'), value: 'Marketing' },
                      { title: t('categories.sales'), value: 'Sales' },
                      { title: t('categories.product'), value: 'Product' },
                      { title: t('categories.customerSupport'), value: 'Customer Support' },
                      { title: t('categories.hr'), value: 'HR' },
                      { title: t('categories.finance'), value: 'Finance' },
                      { title: t('categories.other'), value: 'Other' },
                    ]}
                  />
                )}
              />
            </div>

            {/* Roles */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('employeeSpec.roles')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    placeholder={t('placeholders.roles')}
                    hasError={!!errors.roles}
                    size="large"
                  />
                )}
              />
              {errors.roles && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.roles.message}
                </Typography>
              )}
            </div>

            {/* Portfolio Required */}
            <div className="flex items-center">
              <Controller
                name="portfolio_required"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 rounded border-border"
                    />
                    <Typography variant="p" className="text-foreground">
                      {t('employeeSpec.portfolioRequired')}
                    </Typography>
                  </label>
                )}
              />
            </div>

            {/* Cover Letter Required */}
            <div className="flex items-center">
              <Controller
                name="cover_letter_required"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 rounded border-border"
                    />
                    <Typography variant="p" className="text-foreground">
                      {t('employeeSpec.coverLetterRequired')}
                    </Typography>
                  </label>
                )}
              />
            </div>

            {/* Gender */}
            <div>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <ReusableSelect
                    label={`${t('employeeSpec.gender')} *`}
                    placeholder={t('placeholders.selectGender')}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.gender?.message}
                    size="large"
                    selectValues={[
                      { title: t('genders.noPreference'), value: 'no_preference' },
                      { title: t('genders.male'), value: 'male' },
                      { title: t('genders.female'), value: 'female' },
                    ]}
                  />
                )}
              />
            </div>

            {/* Age From */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('employeeSpec.ageFrom')}
                </Typography>
              </label>
              <Controller
                name="age_from"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    type="number"
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    placeholder={t('placeholders.ageFrom')}
                    hasError={!!errors.age_from}
                    size="large"
                  />
                )}
              />
              {errors.age_from && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.age_from.message}
                </Typography>
              )}
            </div>

            {/* Age To */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('employeeSpec.ageTo')}
                </Typography>
              </label>
              <Controller
                name="age_to"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    type="number"
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    placeholder={t('placeholders.ageTo')}
                    hasError={!!errors.age_to}
                    size="large"
                  />
                )}
              />
              {errors.age_to && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.age_to.message}
                </Typography>
              )}
            </div>

            {/* Education Level */}
            <div>
              <Controller
                name="education_level"
                control={control}
                render={({ field }) => (
                  <ReusableSelect
                    label={`${t('employeeSpec.educationLevel')} *`}
                    placeholder={t('placeholders.selectEducationLevel')}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.education_level?.message}
                    size="large"
                    selectValues={[
                      { title: t('educationLevels.highSchool'), value: 'high_school' },
                      { title: t('educationLevels.diploma'), value: 'diploma' },
                      { title: t('educationLevels.bachelor'), value: 'bachelor' },
                      { title: t('educationLevels.master'), value: 'master' },
                      { title: t('educationLevels.phd'), value: 'phd' },
                    ]}
                  />
                )}
              />
            </div>

            {/* Job Level */}
            <div>
              <Controller
                name="job_level"
                control={control}
                render={({ field }) => (
                  <ReusableSelect
                    label={`${t('employeeSpec.jobLevel')} *`}
                    placeholder={t('placeholders.selectJobLevel')}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.job_level?.message}
                    size="large"
                    selectValues={[
                      { title: t('jobLevels.junior'), value: 'junior' },
                      { title: t('jobLevels.mid'), value: 'mid' },
                      { title: t('jobLevels.senior'), value: 'senior' },
                      { title: t('jobLevels.lead'), value: 'lead' },
                      { title: t('jobLevels.manager'), value: 'manager' },
                    ]}
                  />
                )}
              />
            </div>

            {/* Experience Years */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('employeeSpec.experienceYears')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="experience_years"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    type="number"
                    value={field.value?.toString() || '0'}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder={t('placeholders.experienceYears')}
                    hasError={!!errors.experience_years}
                    size="large"
                  />
                )}
              />
              {errors.experience_years && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.experience_years.message}
                </Typography>
              )}
            </div>

            {/* Languages */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('employeeSpec.languages')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="languages"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    placeholder={t('placeholders.languages')}
                    hasError={!!errors.languages}
                    size="large"
                  />
                )}
              />
              {errors.languages && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.languages.message}
                </Typography>
              )}
            </div>

            {/* Vacancies */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('employeeSpec.vacancies')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="vacancies"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    type="number"
                    value={field.value?.toString() || '1'}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder={t('placeholders.vacancies')}
                    hasError={!!errors.vacancies}
                    size="large"
                  />
                )}
              />
              {errors.vacancies && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.vacancies.message}
                </Typography>
              )}
            </div>

            {/* Job Type */}
            <div>
              <Controller
                name="job_type"
                control={control}
                render={({ field }) => (
                  <ReusableSelect
                    label={`${t('employeeSpec.jobType')} *`}
                    placeholder={t('placeholders.selectJobType')}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.job_type?.message}
                    size="large"
                    selectValues={[
                      { title: t('jobTypes.fullTime'), value: 'full_time' },
                      { title: t('jobTypes.partTime'), value: 'part_time' },
                      { title: t('jobTypes.contract'), value: 'contract' },
                      { title: t('jobTypes.internship'), value: 'internship' },
                      { title: t('jobTypes.freelance'), value: 'freelance' },
                    ]}
                  />
                )}
              />
            </div>

            {/* Work Mode */}
            <div>
              <Controller
                name="work_mode"
                control={control}
                render={({ field }) => (
                  <ReusableSelect
                    label={`${t('employeeSpec.workMode')} *`}
                    placeholder={t('placeholders.selectWorkMode')}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.work_mode?.message}
                    size="large"
                    selectValues={[
                      { title: t('workModes.remote'), value: 'remote' },
                      { title: t('workModes.onSite'), value: 'on_site' },
                      { title: t('workModes.hybrid'), value: 'hybrid' },
                    ]}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="auth-card p-6">
          <Typography variant="h2" className="text-foreground mb-6">
            {t('locationDetails.title')}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('locationDetails.city')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    placeholder={t('placeholders.city')}
                    hasError={!!errors.city}
                    size="large"
                  />
                )}
              />
              {errors.city && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.city.message}
                </Typography>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('locationDetails.address')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    placeholder={t('placeholders.address')}
                    hasError={!!errors.address}
                    size="large"
                  />
                )}
              />
              {errors.address && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.address.message}
                </Typography>
              )}
            </div>
          </div>
        </div>

        {/* Salary Details */}
        <div className="auth-card p-6">
          <Typography variant="h2" className="text-foreground mb-6">
            {t('salaryDetails.title')}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salary From */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('salaryDetails.salaryFrom')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="salary_from"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    placeholder={t('placeholders.salaryFrom')}
                    hasError={!!errors.salary_from}
                    size="large"
                  />
                )}
              />
              {errors.salary_from && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.salary_from.message}
                </Typography>
              )}
            </div>

            {/* Salary To */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('salaryDetails.salaryTo')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="salary_to"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    placeholder={t('placeholders.salaryTo')}
                    hasError={!!errors.salary_to}
                    size="large"
                  />
                )}
              />
              {errors.salary_to && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.salary_to.message}
                </Typography>
              )}
            </div>

            {/* Currency */}
            <div>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <ReusableSelect
                    label={`${t('salaryDetails.currency')} *`}
                    placeholder={t('placeholders.selectCategory')}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.currency?.message}
                    size="large"
                    selectValues={[
                      { title: t('currencies.usd'), value: 'USD' },
                      { title: t('currencies.eur'), value: 'EUR' },
                      { title: t('currencies.gbp'), value: 'GBP' },
                      { title: t('currencies.lbp'), value: 'LBP' },
                    ]}
                  />
                )}
              />
            </div>

            {/* Display Salary */}
            <div className="flex items-center">
              <Controller
                name="display_salary"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 rounded border-border"
                    />
                    <Typography variant="p" className="text-foreground">
                      {t('salaryDetails.displaySalary')}
                    </Typography>
                  </label>
                )}
              />
            </div>

            {/* Incentives */}
            <div className="md:col-span-2">
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('salaryDetails.incentives')}
                </Typography>
              </label>
              <Controller
                name="incentives"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    value={field.value || ''}
                    rows={3}
                    placeholder={t('placeholders.incentives')}
                    status={errors.incentives ? 'error' : undefined}
                    size="large"
                  />
                )}
              />
              {errors.incentives && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.incentives.message}
                </Typography>
              )}
            </div>
          </div>
        </div>

        {/* Job Vacancy Information */}
        <div className="auth-card p-6">
          <Typography variant="h2" className="text-foreground mb-6">
            {t('jobInfo.title')}
          </Typography>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('jobInfo.description')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={6}
                    placeholder={t('placeholders.description')}
                    status={errors.description ? 'error' : undefined}
                    size="large"
                  />
                )}
              />
              {errors.description && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.description.message}
                </Typography>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('jobInfo.requirements')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="requirements"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={6}
                    placeholder={t('placeholders.requirements')}
                    status={errors.requirements ? 'error' : undefined}
                    size="large"
                  />
                )}
              />
              {errors.requirements && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.requirements.message}
                </Typography>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('jobInfo.tags')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    placeholder={t('placeholders.tags')}
                    hasError={!!errors.tags}
                    size="large"
                  />
                )}
              />
              {errors.tags && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.tags.message}
                </Typography>
              )}
            </div>

            {/* Questions */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('jobInfo.questions')}
                </Typography>
              </label>
              <Controller
                name="questions"
                control={control}
                render={({ field }) => (
                  <div>
                    <TextArea
                      {...field}
                      value={field.value || ''}
                      rows={4}
                      placeholder={t('placeholders.questions')}
                      status={errors.questions ? 'error' : undefined}
                      size="large"
                    />
                    <Typography variant="small" className="text-muted-foreground mt-1">
                      {t('jobInfo.questionsHelp')}
                    </Typography>
                  </div>
                )}
              />
              {errors.questions && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.questions.message}
                </Typography>
              )}
            </div>

            {/* Expires At */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('jobInfo.expiresAt')} <span className="text-red-500">*</span>
                </Typography>
              </label>
              <Controller
                name="expires_at"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    type="date"
                    placeholder={t('placeholders.expiresAt')}
                    hasError={!!errors.expires_at}
                    size="large"
                  />
                )}
              />
              {errors.expires_at && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.expires_at.message}
                </Typography>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <ReusableButton
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="px-12"
          >
            {isLoading ? t('buttons.submitting') : mode === 'create' ? t('buttons.submit') : t('buttons.update')}
          </ReusableButton>
        </div>
      </form>
    </div>
  );
}
