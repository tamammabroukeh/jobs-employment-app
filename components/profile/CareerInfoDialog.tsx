'use client';

import { useForm } from 'react-hook-form';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { CareerInfo } from '@/types/profile';
import { Form, InputNumber, Select } from 'antd';
import { Controller } from 'react-hook-form';

interface CareerInfoDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  careerInfo: CareerInfo;
  onSave: (data: CareerInfo) => void;
}

export default function CareerInfoDialog({
  isOpen,
  setIsOpen,
  careerInfo,
  onSave,
}: CareerInfoDialogProps) {
  const t = useProfileTranslations();
  const { control, handleSubmit, formState: { errors } } = useForm<CareerInfo>({
    defaultValues: careerInfo,
  });

  const onSubmit = (data: CareerInfo) => {
    onSave(data);
    setIsOpen(false);
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
              name="salaryRangeFrom"
              control={control}
              rules={{ required: 'Salary range from is required' }}
              render={({ field }) => (
                <Form.Item
                  label={`${t('userInfo.careerInfo.salaryRange')} (${t('userInfo.careerInfo.from')})`}
                  validateStatus={errors.salaryRangeFrom ? 'error' : ''}
                  help={errors.salaryRangeFrom?.message}
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
              name="salaryRangeTo"
              control={control}
              rules={{ required: 'Salary range to is required' }}
              render={({ field }) => (
                <Form.Item
                  label={`${t('userInfo.careerInfo.salaryRange')} (${t('userInfo.careerInfo.to')})`}
                  validateStatus={errors.salaryRangeTo ? 'error' : ''}
                  help={errors.salaryRangeTo?.message}
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
              name="currentJobStatus"
              control={control}
              rules={{ required: 'Current job status is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.currentJobStatus')}
                  validateStatus={errors.currentJobStatus ? 'error' : ''}
                  help={errors.currentJobStatus?.message}
                >
                  <Select {...field} options={jobStatusOptions} placeholder={t('userInfo.careerInfo.currentJobStatus')} />
                </Form.Item>
              )}
            />

            {/* Experience Years */}
            <Controller
              name="experienceYears"
              control={control}
              rules={{ required: 'Experience years is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.experienceYears')}
                  validateStatus={errors.experienceYears ? 'error' : ''}
                  help={errors.experienceYears?.message}
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
              name="educationLevel"
              control={control}
              rules={{ required: 'Education level is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.educationLevel')}
                  validateStatus={errors.educationLevel ? 'error' : ''}
                  help={errors.educationLevel?.message}
                >
                  <Select {...field} options={educationLevelOptions} placeholder={t('userInfo.careerInfo.educationLevel')} />
                </Form.Item>
              )}
            />

            {/* Job Level */}
            <Controller
              name="jobLevel"
              control={control}
              rules={{ required: 'Job level is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.jobLevel')}
                  validateStatus={errors.jobLevel ? 'error' : ''}
                  help={errors.jobLevel?.message}
                >
                  <Select {...field} options={jobLevelOptions} placeholder={t('userInfo.careerInfo.jobLevel')} />
                </Form.Item>
              )}
            />

            {/* Job Types - Multi Select */}
            <Controller
              name="jobTypes"
              control={control}
              rules={{ required: 'Job types is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.jobTypes')}
                  validateStatus={errors.jobTypes ? 'error' : ''}
                  help={errors.jobTypes?.message}
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
              name="jobRoles"
              control={control}
              rules={{ required: 'Job roles is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.jobRoles')}
                  validateStatus={errors.jobRoles ? 'error' : ''}
                  help={errors.jobRoles?.message}
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
              name="workCities"
              control={control}
              rules={{ required: 'Work cities is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.careerInfo.workCities')}
                  validateStatus={errors.workCities ? 'error' : ''}
                  help={errors.workCities?.message}
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
          </div>
        </Form>
      }
    />
  );
}
