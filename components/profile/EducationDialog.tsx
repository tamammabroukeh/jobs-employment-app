'use client';

import { useForm } from 'react-hook-form';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { Education } from '@/types/profile';
import { Form, Input, Select } from 'antd';
import { Controller } from 'react-hook-form';
import { useEffect } from 'react';

interface EducationDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  education?: Education;
  onSave: (data: Omit<Education, 'id'>) => void;
}

export default function EducationDialog({
  isOpen,
  setIsOpen,
  education,
  onSave,
}: EducationDialogProps) {
  const t = useProfileTranslations();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<Omit<Education, 'id'>>({
    defaultValues: education || {
      certificateType: 'bachelor',
      university: '',
      faculty: '',
      major: '',
      majorName: '',
      grade: 'good',
      fromDate: '',
      awardedDate: '',
    },
  });

  useEffect(() => {
    if (education) {
      reset(education);
    }
  }, [education, reset]);

  const onSubmit = (data: Omit<Education, 'id'>) => {
    onSave(data);
    reset();
    setIsOpen(false);
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  const certificateTypeOptions = [
    { label: t('certificateTypes.highSchool'), value: 'highSchool' },
    { label: t('certificateTypes.bachelor'), value: 'bachelor' },
    { label: t('certificateTypes.master'), value: 'master' },
    { label: t('certificateTypes.phd'), value: 'phd' },
    { label: t('certificateTypes.diploma'), value: 'diploma' },
    { label: t('certificateTypes.certificate'), value: 'certificate' },
  ];

  const gradeOptions = [
    { label: t('gradeOptions.excellent'), value: 'excellent' },
    { label: t('gradeOptions.veryGood'), value: 'veryGood' },
    { label: t('gradeOptions.good'), value: 'good' },
    { label: t('gradeOptions.pass'), value: 'pass' },
  ];

  const universityOptions = [
    { label: 'Harvard University', value: 'harvard' },
    { label: 'MIT', value: 'mit' },
    { label: 'Stanford University', value: 'stanford' },
    { label: 'Oxford University', value: 'oxford' },
  ];

  const facultyOptions = [
    { label: 'Engineering', value: 'engineering' },
    { label: 'Science', value: 'science' },
    { label: 'Arts', value: 'arts' },
    { label: 'Business', value: 'business' },
  ];

  const majorOptions = [
    { label: 'Computer Science', value: 'computer-science' },
    { label: 'Software Engineering', value: 'software-engineering' },
    { label: 'Data Science', value: 'data-science' },
    { label: 'Business Administration', value: 'business-admin' },
  ];

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('education.cancel')}
        onClick={handleCancel}
        variant="default"
      />
      <ReusableButton
        btnText={t('education.save')}
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
        title: education ? t('education.editEducation') : t('education.addEducation'),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-3xl"
      dialogBody={
        <Form layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="certificateType"
              control={control}
              rules={{ required: 'Certificate type is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.certificateType')}
                  validateStatus={errors.certificateType ? 'error' : ''}
                  help={errors.certificateType?.message}
                >
                  <Select {...field} options={certificateTypeOptions} placeholder={t('education.certificateType')} />
                </Form.Item>
              )}
            />

            <Controller
              name="university"
              control={control}
              rules={{ required: 'University is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.university')}
                  validateStatus={errors.university ? 'error' : ''}
                  help={errors.university?.message}
                >
                  <Select {...field} options={universityOptions} placeholder={t('education.university')} />
                </Form.Item>
              )}
            />

            <Controller
              name="faculty"
              control={control}
              rules={{ required: 'Faculty is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.faculty')}
                  validateStatus={errors.faculty ? 'error' : ''}
                  help={errors.faculty?.message}
                >
                  <Select {...field} options={facultyOptions} placeholder={t('education.faculty')} />
                </Form.Item>
              )}
            />

            <Controller
              name="major"
              control={control}
              rules={{ required: 'Major is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.major')}
                  validateStatus={errors.major ? 'error' : ''}
                  help={errors.major?.message}
                >
                  <Select {...field} options={majorOptions} placeholder={t('education.major')} />
                </Form.Item>
              )}
            />

            <Controller
              name="majorName"
              control={control}
              rules={{ required: 'Major name is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.majorName')}
                  validateStatus={errors.majorName ? 'error' : ''}
                  help={errors.majorName?.message}
                  className="md:col-span-2"
                >
                  <Input {...field} placeholder={t('education.majorName')} />
                </Form.Item>
              )}
            />

            <Controller
              name="grade"
              control={control}
              rules={{ required: 'Grade is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.grade')}
                  validateStatus={errors.grade ? 'error' : ''}
                  help={errors.grade?.message}
                >
                  <Select {...field} options={gradeOptions} placeholder={t('education.grade')} />
                </Form.Item>
              )}
            />

            <div />

            <Controller
              name="fromDate"
              control={control}
              rules={{ required: 'From date is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.fromDate')}
                  validateStatus={errors.fromDate ? 'error' : ''}
                  help={errors.fromDate?.message}
                >
                  <Input {...field} type="month" placeholder={t('education.fromDate')} />
                </Form.Item>
              )}
            />

            <Controller
              name="awardedDate"
              control={control}
              rules={{ required: 'Awarded date is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.awardedDate')}
                  validateStatus={errors.awardedDate ? 'error' : ''}
                  help={errors.awardedDate?.message}
                >
                  <Input {...field} type="month" placeholder={t('education.awardedDate')} />
                </Form.Item>
              )}
            />
          </div>
        </Form>
      }
    />
  );
}
