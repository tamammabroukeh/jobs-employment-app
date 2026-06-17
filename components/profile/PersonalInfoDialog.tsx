'use client';

import { useForm } from 'react-hook-form';
import { ReusableDialog, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useProfileTranslations } from '@/hooks/use-profile';
import { IJobSeekerProfile, IUpdatePersonalInfoRequest } from '@/apis/services/job-seeker/interface';
import { Form, Input, Select } from 'antd';
import { Controller } from 'react-hook-form';

interface PersonalInfoDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  personalInfo: IJobSeekerProfile;
  onSave: (data: IUpdatePersonalInfoRequest) => Promise<boolean>;
}

interface PersonalInfoFormData {
  first_name: string;
  last_name: string;
  gender: string;
  nationality: string;
  city: string;
  address: string;
  phone: string;
  date_of_birth: string;
  marital_status: string;
}

export default function PersonalInfoDialog({
  isOpen,
  setIsOpen,
  personalInfo,
  onSave,
}: PersonalInfoDialogProps) {
  const t = useProfileTranslations();
  const { control, handleSubmit, formState: { errors } } = useForm<PersonalInfoFormData>({
    defaultValues: {
      first_name: personalInfo.first_name,
      last_name: personalInfo.last_name,
      gender: personalInfo.gender,
      nationality: personalInfo.nationality,
      city: personalInfo.city,
      address: personalInfo.address,
      phone: personalInfo.phone,
      date_of_birth: personalInfo.date_of_birth,
      marital_status: personalInfo.marital_status,
    },
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    // Create full_name from first and last name
    const full_name = `${data.first_name} ${data.last_name}`;
    const location = `${data.city}`;
    
    const success = await onSave({
      ...data,
      full_name,
      location,
    });
    
    // Only close dialog if update was successful
    if (success) {
      setIsOpen(false);
    }
  };

  const genderOptions = [
    { label: t('genderOptions.male'), value: 'male' },
    { label: t('genderOptions.female'), value: 'female' },
    { label: t('genderOptions.other'), value: 'other' },
  ];

  const maritalStatusOptions = [
    { label: t('maritalStatusOptions.single'), value: 'single' },
    { label: t('maritalStatusOptions.married'), value: 'married' },
    { label: t('maritalStatusOptions.divorced'), value: 'divorced' },
    { label: t('maritalStatusOptions.widowed'), value: 'widowed' },
  ];

  const dialogFooter = (
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('userInfo.personalInfo.cancel')}
        onClick={() => setIsOpen(false)}
        variant="default"
      />
      <ReusableButton
        btnText={t('userInfo.personalInfo.save')}
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
        title: t('userInfo.personalInfo.edit'),
      }}
      dialogFooter={dialogFooter}
      contentClassName="max-w-2xl"
      dialogBody={
        <Form layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="first_name"
              control={control}
              rules={{ required: 'First name is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.firstName')}
                  validateStatus={errors.first_name ? 'error' : ''}
                  help={errors.first_name?.message}
                >
                  <Input {...field} placeholder={t('userInfo.personalInfo.firstName')} />
                </Form.Item>
              )}
            />

            <Controller
              name="last_name"
              control={control}
              rules={{ required: 'Last name is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.lastName')}
                  validateStatus={errors.last_name ? 'error' : ''}
                  help={errors.last_name?.message}
                >
                  <Input {...field} placeholder={t('userInfo.personalInfo.lastName')} />
                </Form.Item>
              )}
            />

            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.gender')}
                  validateStatus={errors.gender ? 'error' : ''}
                  help={errors.gender?.message}
                >
                  <Select {...field} options={genderOptions} placeholder={t('userInfo.personalInfo.gender')} />
                </Form.Item>
              )}
            />

            <Controller
              name="nationality"
              control={control}
              rules={{ required: 'Nationality is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.nationality')}
                  validateStatus={errors.nationality ? 'error' : ''}
                  help={errors.nationality?.message}
                >
                  <Input {...field} placeholder={t('userInfo.personalInfo.nationality')} />
                </Form.Item>
              )}
            />

            <Controller
              name="city"
              control={control}
              rules={{ required: 'City is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.city')}
                  validateStatus={errors.city ? 'error' : ''}
                  help={errors.city?.message}
                >
                  <Input {...field} placeholder={t('userInfo.personalInfo.city')} />
                </Form.Item>
              )}
            />

            <Controller
              name="address"
              control={control}
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.address')}
                  validateStatus={errors.address ? 'error' : ''}
                  help={errors.address?.message}
                >
                  <Input {...field} placeholder={t('userInfo.personalInfo.address')} />
                </Form.Item>
              )}
            />

            <Controller
              name="phone"
              control={control}
              rules={{ required: 'Phone is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.phone')}
                  validateStatus={errors.phone ? 'error' : ''}
                  help={errors.phone?.message}
                >
                  <Input {...field} placeholder={t('userInfo.personalInfo.phone')} />
                </Form.Item>
              )}
            />

            <Controller
              name="date_of_birth"
              control={control}
              rules={{ required: 'Date of birth is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.dateOfBirth')}
                  validateStatus={errors.date_of_birth ? 'error' : ''}
                  help={errors.date_of_birth?.message}
                >
                  <Input
                    {...field}
                    type="date"
                    className="w-full"
                    placeholder={t('userInfo.personalInfo.dateOfBirth')}
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="marital_status"
              control={control}
              rules={{ required: 'Marital status is required' }}
              render={({ field }) => (
                <Form.Item
                  label={t('userInfo.personalInfo.maritalStatus')}
                  validateStatus={errors.marital_status ? 'error' : ''}
                  help={errors.marital_status?.message}
                >
                  <Select {...field} options={maritalStatusOptions} placeholder={t('userInfo.personalInfo.maritalStatus')} />
                </Form.Item>
              )}
            />
          </div>
        </Form>
      }
    />
  );
}
