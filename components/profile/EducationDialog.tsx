'use client';

import { useForm } from 'react-hook-form';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-translations';
import { IEducation } from '@/apis/services/job-seeker/interface';
import { Form, Input, Select } from 'antd';
import { Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { getUniversitiesAction, getFacultiesAction, getMajorsAction } from '@/apis/services/common/actions';
import type { IEducationLookupItem } from '@/apis/services/common/interface';

interface EducationDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  education?: IEducation;
  onSave: (data: IEducation) => Promise<boolean>;
}

export default function EducationDialog({
  isOpen,
  setIsOpen,
  education,
  onSave,
}: EducationDialogProps) {
  const t = useProfileTranslations();
  const [isSaving, setIsSaving] = useState(false);
  const [universities, setUniversities] = useState<IEducationLookupItem[]>([]);
  const [faculties, setFaculties] = useState<IEducationLookupItem[]>([]);
  const [majors, setMajors] = useState<IEducationLookupItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm<IEducation>({
    defaultValues: education || {
      certificate_type: 'bachelor',
      university: '',
      faculty: '',
      major: '',
      major_name: '',
      grade: 'good',
      from_date: '',
      awarded_date: '',
    },
  });

  // Fetch lookup data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchLookupData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (education) {
      reset(education);
    }
  }, [education, reset]);

  const fetchLookupData = async () => {
    setIsLoadingData(true);
    try {
      const [universitiesData, facultiesData, majorsData] = await Promise.all([
        getUniversitiesAction(),
        getFacultiesAction(),
        getMajorsAction(),
      ]);
      
      setUniversities(universitiesData);
      setFaculties(facultiesData);
      setMajors(majorsData);
    } catch (error) {
      console.error('Error fetching lookup data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const onSubmit = async (data: IEducation) => {
    setIsSaving(true);
    const success = await onSave(data);
    setIsSaving(false);
    
    if (success) {
      reset();
      setIsOpen(false);
    }
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

  // Convert lookup data to Select options
  const universityOptions = universities.map(uni => ({
    label: uni.name,
    value: uni.name,
  }));

  const facultyOptions = faculties.map(faculty => ({
    label: faculty.name,
    value: faculty.name,
  }));

  const majorOptions = majors.map(major => ({
    label: major.name,
    value: major.name,
  }));

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('education.cancel')}
        onClick={handleCancel}
        variant="default"
        disabled={isSaving}
      />
      <ReusableButton
        btnText={t('education.save')}
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
        title: education ? t('education.editEducation') : t('education.addEducation'),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-3xl"
      dialogBody={
        <Form layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="certificate_type"
              control={control}
              rules={{ required: 'Certificate type is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.certificateType')}
                  validateStatus={errors.certificate_type ? 'error' : ''}
                  help={errors.certificate_type?.message}
                >
                  <Select 
                    {...field} 
                    options={certificateTypeOptions} 
                    placeholder={t('education.certificateType')}
                    loading={isLoadingData}
                  />
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
                  <Select 
                    {...field} 
                    options={universityOptions} 
                    placeholder={t('education.university')}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    loading={isLoadingData}
                  />
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
                  <Select 
                    {...field} 
                    options={facultyOptions} 
                    placeholder={t('education.faculty')}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    loading={isLoadingData}
                  />
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
                  <Select 
                    {...field} 
                    options={majorOptions} 
                    placeholder={t('education.major')}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    loading={isLoadingData}
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="major_name"
              control={control}
              rules={{ required: 'Major name is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.majorName')}
                  validateStatus={errors.major_name ? 'error' : ''}
                  help={errors.major_name?.message}
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
              name="from_date"
              control={control}
              rules={{ required: 'From date is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.fromDate')}
                  validateStatus={errors.from_date ? 'error' : ''}
                  help={errors.from_date?.message}
                >
                  <Input {...field} type="month" placeholder={t('education.fromDate')} />
                </Form.Item>
              )}
            />

            <Controller
              name="awarded_date"
              control={control}
              rules={{ required: 'Awarded date is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('education.awardedDate')}
                  validateStatus={errors.awarded_date ? 'error' : ''}
                  help={errors.awarded_date?.message}
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
