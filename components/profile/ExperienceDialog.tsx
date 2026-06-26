'use client';

import { useForm } from 'react-hook-form';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { IWorkExperience } from '@/apis/services/job-seeker/interface';
import { Form, Input, Select, Checkbox } from 'antd';
import { Controller, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

interface ExperienceDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  experience?: IWorkExperience;
  onSave: (data: IWorkExperience) => Promise<void>;
}

export default function ExperienceDialog({
  isOpen,
  setIsOpen,
  experience,
  onSave,
}: ExperienceDialogProps) {
  const t = useProfileTranslations();
  const [isSaving, setIsSaving] = useState(false);
  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<IWorkExperience>({
    defaultValues: experience || {
      job_title: '',
      company_name: '',
      job_roles: [],
      from_date: '',
      to_date: '',
      is_currently_working: false,
      description: '',
    },
  });

  const is_currently_working = useWatch({ control, name: 'is_currently_working' });

  useEffect(() => {
    if (experience) {
      reset(experience);
    }
  }, [experience, reset]);

  useEffect(() => {
    if (is_currently_working) {
      setValue('to_date', '');
    }
  }, [is_currently_working, setValue]);

  const onSubmit = async (data: IWorkExperience) => {
    setIsSaving(true);
    await onSave(data);
    setIsSaving(false);
    // Note: Dialog will be closed by parent component if save is successful
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
        disabled={isSaving}
      />
      <ReusableButton
        btnText={t('experience.save')}
        onClick={handleSubmit(onSubmit)}
        variant="primary"
        isLoading={isSaving}
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
              name="job_title"
              control={control}
              rules={{ required: 'Job title is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.jobTitle')}
                  validateStatus={errors.job_title ? 'error' : ''}
                  help={errors.job_title?.message}
                >
                  <Select {...field} options={jobTitleOptions} placeholder={t('experience.jobTitle')} />
                </Form.Item>
              )}
            />

            <Controller
              name="company_name"
              control={control}
              rules={{ required: 'Company name is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.companyName')}
                  validateStatus={errors.company_name ? 'error' : ''}
                  help={errors.company_name?.message}
                >
                  <Input {...field} placeholder={t('experience.companyName')} />
                </Form.Item>
              )}
            />

            <Controller
              name="job_roles"
              control={control}
              rules={{ required: 'Job roles is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.jobRoles')}
                  validateStatus={errors.job_roles ? 'error' : ''}
                  help={errors.job_roles?.message}
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
              name="from_date"
              control={control}
              rules={{ required: 'From date is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('experience.fromDate')}
                  validateStatus={errors.from_date ? 'error' : ''}
                  help={errors.from_date?.message}
                >
                  <Input {...field} type="month" placeholder={t('experience.fromDate')} />
                </Form.Item>
              )}
            />

            {!is_currently_working && (
              <Controller
                name="to_date"
                control={control}
                rules={{ required: !is_currently_working ? 'To date is required' : false }}
                render={({ field }) => (
                  <Form.Item
                    label={t('experience.toDate')}
                    validateStatus={errors.to_date ? 'error' : ''}
                    help={errors.to_date?.message}
                  >
                    <Input {...field} type="month" placeholder={t('experience.toDate')} />
                  </Form.Item>
                )}
              />
            )}

            <Controller
              name="is_currently_working"
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
