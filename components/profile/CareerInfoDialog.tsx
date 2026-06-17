'use client';

import { useForm } from 'react-hook-form';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { IJobSeekerProfile, IUpdateCareerInfoRequest } from '@/apis/services/job-seeker/interface';
import { Form, InputNumber, Select, Input } from 'antd';
import { Controller } from 'react-hook-form';

interface CareerInfoDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  careerInfo: IJobSeekerProfile;
  onSave: (data: IUpdateCareerInfoRequest) => Promise<boolean>;
}

interface CareerInfoFormData {
  salary_range_from: number;
  salary_range_to: number;
  current_job_status: string;
  years_of_experience: number;
  education_level: string;
  job_level: string;
  job_types: string[];
  job_roles: string[];
  work_cities: string[];
  current_job_title: string;
  experience_summary: string;
  expected_salary: number;
  is_actively_seeking: boolean;
}

export default function CareerInfoDialog({
  isOpen,
  setIsOpen,
  careerInfo,
  onSave,
}: CareerInfoDialogProps) {
  const t = useProfileTranslations();
  const { control, handleSubmit, formState: { errors } } = useForm<CareerInfoFormData>({
    defaultValues: {
      salary_range_from: careerInfo.salary_range_from,
      salary_range_to: careerInfo.salary_range_to,
      current_job_status: careerInfo.current_job_status,
      years_of_experience: careerInfo.years_of_experience,
      education_level: careerInfo.education_level,
      job_level: careerInfo.job_level,
      job_types: careerInfo.job_types || [],
      job_roles: careerInfo.job_roles || [],
      work_cities: careerInfo.work_cities || [],
      current_job_title: careerInfo.current_job_title || '',
      experience_summary: careerInfo.experience_summary || '',
      expected_salary: careerInfo.expected_salary || 0,
      is_actively_seeking: careerInfo.is_actively_seeking || false,
    },
  });

  const onSubmit = async (data: CareerInfoFormData) => {
    const success = await onSave(data);
    
    // Only close dialog if update was successful
    if (success) {
      setIsOpen(false);
    }
  };

  const jobStatusOptions = [
    { label: t('jobStatusOptions.employed'), value: 'employed' },
    { label: t('jobStatusOptions.unemployed'), value: 'unemployed' },
    { label: t('jobStatusOptions.freelancer'), value: 'freelancer' },
    { label: t('jobStatusOptions.student'), value: 'student' },
  ];

  const educationLevelOptions = [
    { label: t('educationLevelOptions.highSchool'), value: 'highSchool' },
    { label: t('educationLevelOptions.bachelor'), value: 'bachelor' },
    { label: t('educationLevelOptions.master'), value: 'master' },
    { label: t('educationLevelOptions.phd'), value: 'phd' },
  ];

  const jobLevelOptions = [
    { label: t('jobLevelOptions.entry'), value: 'entry' },
    { label: t('jobLevelOptions.junior'), value: 'junior' },
    { label: t('jobLevelOptions.mid'), value: 'mid' },
    { label: t('jobLevelOptions.senior'), value: 'senior' },
    { label: t('jobLevelOptions.lead'), value: 'lead' },
    { label: t('jobLevelOptions.manager'), value: 'manager' },
  ];

  // Mock data for multi-select options - replace with actual data
  const jobTypesOptions = [
    { label: 'Full-time', value: 'full-time' },
    { label: 'Part-time', value: 'part-time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Remote', value: 'remote' },
  ];

  const jobRolesOptions = [
    { label: 'Frontend Developer', value: 'frontend' },
    { label: 'Backend Developer', value: 'backend' },
    { label: 'Full Stack Developer', value: 'fullstack' },
    { label: 'DevOps Engineer', value: 'devops' },
    { label: 'UI/UX Designer', value: 'designer' },
  ];

  const workCitiesOptions = [
    { label: 'New York', value: 'new-york' },
    { label: 'San Francisco', value: 'san-francisco' },
    { label: 'London', value: 'london' },
    { label: 'Berlin', value: 'berlin' },
    { label: 'Remote', value: 'remote' },
  ];

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('userInfo.careerInfo.cancel')}
        onClick={() => setIsOpen(false)}
        variant="default"
      />
      <ReusableButton
        btnText={t('userInfo.careerInfo.save')}
        onClick={handleSubmit(onSubmit)}
        variant="primary"
      />
    </Flex>
  );

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t('userInfo.careerInfo.edit'),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-2xl"
      dialogBody={
        <Form layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Salary Range */}
            <Controller
              name="salary_range_from"
              control={control}
              rules={{ required: 'Salary range from is required' }}
              render={({ field }) => (
                <Form.Item
                  label={`${t('userInfo.careerInfo.salaryRange')} (${t('userInfo.careerInfo.from')})`}
                  validateStatus={errors.salary_range_from ? 'error' : ''}
                  help={errors.salary_range_from?.message}
                >
                  <InputNumber
                    {...field}
                    className="w-full"
                    min={0}
                    placeholder="0"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="salary_range_to"
              control={control}
              rules={{ required: 'Salary range to is required' }}
              render={({ field }) => (
                <Form.Item
                  label={`${t('userInfo.careerInfo.salaryRange')} (${t('userInfo.careerInfo.to')})`}
                  validateStatus={errors.salary_range_to ? 'error' : ''}
                  help={errors.salary_range_to?.message}
                >
                  <InputNumber
                    {...field}
                    className="w-full"
                    min={0}
                    placeholder="0"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              )}
            />

            {/* Current Job Status */}
            <Controller
              name="current_job_status"
              control={control}
              rules={{ required: 'Current job status is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.currentJobStatus')}
                  validateStatus={errors.current_job_status ? 'error' : ''}
                  help={errors.current_job_status?.message}
                >
                  <Select {...field} options={jobStatusOptions} placeholder={t('userInfo.careerInfo.currentJobStatus')} />
                </Form.Item>
              )}
            />

            {/* Experience Years */}
            <Controller
              name="years_of_experience"
              control={control}
              rules={{ required: 'Experience years is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.experienceYears')}
                  validateStatus={errors.years_of_experience ? 'error' : ''}
                  help={errors.years_of_experience?.message}
                >
                  <InputNumber
                    {...field}
                    className="w-full"
                    min={0}
                    max={50}
                    placeholder="0"
                  />
                </Form.Item>
              )}
            />

            {/* Education Level */}
            <Controller
              name="education_level"
              control={control}
              rules={{ required: 'Education level is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.educationLevel')}
                  validateStatus={errors.education_level ? 'error' : ''}
                  help={errors.education_level?.message}
                >
                  <Select {...field} options={educationLevelOptions} placeholder={t('userInfo.careerInfo.educationLevel')} />
                </Form.Item>
              )}
            />

            {/* Job Level */}
            <Controller
              name="job_level"
              control={control}
              rules={{ required: 'Job level is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.jobLevel')}
                  validateStatus={errors.job_level ? 'error' : ''}
                  help={errors.job_level?.message}
                >
                  <Select {...field} options={jobLevelOptions} placeholder={t('userInfo.careerInfo.jobLevel')} />
                </Form.Item>
              )}
            />

            {/* Job Types - Multi Select */}
            <Controller
              name="job_types"
              control={control}
              rules={{ required: 'Job types is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.jobTypes')}
                  validateStatus={errors.job_types ? 'error' : ''}
                  help={errors.job_types?.message}
                  className="md:col-span-2"
                >
                  <Select
                    {...field}
                    mode="multiple"
                    options={jobTypesOptions}
                    placeholder={t('userInfo.careerInfo.jobTypes')}
                  />
                </Form.Item>
              )}
            />

            {/* Job Roles - Multi Select */}
            <Controller
              name="job_roles"
              control={control}
              rules={{ required: 'Job roles is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.jobRoles')}
                  validateStatus={errors.job_roles ? 'error' : ''}
                  help={errors.job_roles?.message}
                  className="md:col-span-2"
                >
                  <Select
                    {...field}
                    mode="multiple"
                    options={jobRolesOptions}
                    placeholder={t('userInfo.careerInfo.jobRoles')}
                  />
                </Form.Item>
              )}
            />

            {/* Work Cities - Multi Select */}
            <Controller
              name="work_cities"
              control={control}
              rules={{ required: 'Work cities is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.workCities')}
                  validateStatus={errors.work_cities ? 'error' : ''}
                  help={errors.work_cities?.message}
                  className="md:col-span-2"
                >
                  <Select
                    {...field}
                    mode="multiple"
                    options={workCitiesOptions}
                    placeholder={t('userInfo.careerInfo.workCities')}
                  />
                </Form.Item>
              )}
            />

            {/* Current Job Title */}
            <Controller
              name="current_job_title"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Current Job Title"
                  validateStatus={errors.current_job_title ? 'error' : ''}
                  help={errors.current_job_title?.message}
                >
                  <Input {...field} placeholder="e.g. Frontend Developer" />
                </Form.Item>
              )}
            />

            {/* Expected Salary */}
            <Controller
              name="expected_salary"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Expected Salary"
                  validateStatus={errors.expected_salary ? 'error' : ''}
                  help={errors.expected_salary?.message}
                >
                  <InputNumber
                    {...field}
                    className="w-full"
                    min={0}
                    placeholder="0"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
              )}
            />

            {/* Experience Summary - Full Width */}
            <Controller
              name="experience_summary"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Experience Summary"
                  validateStatus={errors.experience_summary ? 'error' : ''}
                  help={errors.experience_summary?.message}
                  className="md:col-span-2"
                >
                  <Input.TextArea
                    {...field}
                    rows={4}
                    placeholder="Brief summary of your professional experience..."
                  />
                </Form.Item>
              )}
            />

            {/* Actively Seeking */}
            <Controller
              name="is_actively_seeking"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Actively Seeking"
                  validateStatus={errors.is_actively_seeking ? 'error' : ''}
                  help={errors.is_actively_seeking?.message}
                >
                  <Select
                    {...field}
                    value={field.value ? 'yes' : 'no'}
                    onChange={(value) => field.onChange(value === 'yes')}
                    options={[
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]}
                    placeholder="Are you actively seeking?"
                  />
                </Form.Item>
              )}
            />
          </div>
        </Form>
      }
    />
  );
}
