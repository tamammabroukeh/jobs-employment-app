'use client';

import { useForm } from 'react-hook-form';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { Experience } from '@/types/profile';
import { Form, Input, Select, Checkbox } from 'antd';
import { Controller, useWatch } from 'react-hook-form';
import { useEffect } from 'react';

const { TextArea } = Input;

interface ExperienceDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  experience?: Experience;
  onSave: (data: Omit<Experience, 'id'>) => void;
}

export default function ExperienceDialog({
  isOpen,
  setIsOpen,
  experience,
  onSave,
}: ExperienceDialogProps) {
  const t = useProfileTranslations();
  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<Omit<Experience, 'id'>>({
    defaultValues: experience || {
      jobTitle: '',
      companyName: '',
      jobRoles: [],
      fromDate: '',
      toDate: '',
      isCurrentlyWorking: false,
      description: '',
    },
  });

  const isCurrentlyWorking = useWatch({ control, name: 'isCurrentlyWorking' });

  useEffect(() => {
    if (experience) {
      reset(experience);
    }
  }, [experience, reset]);

  useEffect(() => {
    if (isCurrentlyWorking) {
      setValue('toDate', '');
    }
  }, [isCurrentlyWorking, setValue]);

  const onSubmit = (data: Omit<Experience, 'id'>) => {
    onSave(data);
    reset();
    setIsOpen(false);
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  const jobTitleOptions = [
    { label: 'Software Engineer', value: 'software-engineer' },
    { label: 'Senior Software Engineer', value: 'senior-software-engineer' },
    { label: 'Frontend Developer', value: 'frontend-developer' },
    { label: 'Backend Developer', value: 'backend-developer' },
    { label: 'Full Stack Developer', value: 'fullstack-developer' },
    { label: 'DevOps Engineer', value: 'devops-engineer' },
    { label: 'UI/UX Designer', value: 'ui-ux-designer' },
    { label: 'Product Manager', value: 'product-manager' },
  ];

  const jobRolesOptions = [
    { label: 'Frontend Development', value: 'frontend' },
    { label: 'Backend Development', value: 'backend' },
    { label: 'Full Stack Development', value: 'fullstack' },
    { label: 'DevOps', value: 'devops' },
    { label: 'UI/UX Design', value: 'design' },
    { label: 'Team Lead', value: 'team-lead' },
    { label: 'Code Review', value: 'code-review' },
    { label: 'Mentoring', value: 'mentoring' },
  ];

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('experience.cancel')}
        onClick={handleCancel}
        variant="default"
      />
      <ReusableButton
        btnText={t('experience.save')}
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
        title: experience ? t('experience.editExperience') : t('experience.addExperience'),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-3xl"
      dialogBody={
        <Form layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="jobTitle"
              control={control}
              rules={{ required: 'Job title is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.jobTitle')}
                  validateStatus={errors.jobTitle ? 'error' : ''}
                  help={errors.jobTitle?.message}
                >
                  <Select {...field} options={jobTitleOptions} placeholder={t('experience.jobTitle')} />
                </Form.Item>
              )}
            />

            <Controller
              name="companyName"
              control={control}
              rules={{ required: 'Company name is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.companyName')}
                  validateStatus={errors.companyName ? 'error' : ''}
                  help={errors.companyName?.message}
                >
                  <Input {...field} placeholder={t('experience.companyName')} />
                </Form.Item>
              )}
            />

            <Controller
              name="jobRoles"
              control={control}
              rules={{ required: 'Job roles is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.jobRoles')}
                  validateStatus={errors.jobRoles ? 'error' : ''}
                  help={errors.jobRoles?.message}
                  className="md:col-span-2"
                >
                  <Select
                    {...field}
                    mode="multiple"
                    options={jobRolesOptions}
                    placeholder={t('experience.jobRoles')}
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="fromDate"
              control={control}
              rules={{ required: 'From date is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.fromDate')}
                  validateStatus={errors.fromDate ? 'error' : ''}
                  help={errors.fromDate?.message}
                >
                  <Input {...field} type="month" placeholder={t('experience.fromDate')} />
                </Form.Item>
              )}
            />

            {!isCurrentlyWorking && (
              <Controller
                name="toDate"
                control={control}
                rules={{ required: !isCurrentlyWorking ? 'To date is required' : false }}
                render={({ field }) => (
                  <Form.Item
                    label={t('experience.toDate')}
                    validateStatus={errors.toDate ? 'error' : ''}
                    help={errors.toDate?.message}
                  >
                    <Input {...field} type="month" placeholder={t('experience.toDate')} />
                  </Form.Item>
                )}
              />
            )}

            <Controller
              name="isCurrentlyWorking"
              control={control}
              render={({ field }) => (
                <Form.Item className="md:col-span-2">
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    {t('experience.currentlyWorking')}
                  </Checkbox>
                </Form.Item>
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.description')}
                  validateStatus={errors.description ? 'error' : ''}
                  help={errors.description?.message}
                  className="md:col-span-2"
                >
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder={t('experience.description')}
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
