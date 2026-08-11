'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Typography, ReusableButton, ReusableInput, ReusableSelect } from '@/components/Reusable-Components';
import { Input, Checkbox } from 'antd';
import type { CompanyProfile } from '@/apis/services/employer';
import { updateCompanyProfileAction } from '@/apis/services/employer/actions';
import { useEmployerProfileTranslations } from '@/hooks/use-translations';

const { TextArea } = Input;

interface CompanyInfoSectionProps {
  initialData: CompanyProfile | null;
  onUpdate: (data: CompanyProfile) => void;
}

export default function CompanyInfoSection({ initialData, onUpdate }: CompanyInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(!initialData); // Auto-edit if no data
  const [isLoading, setIsLoading] = useState(false);
  const t = useEmployerProfileTranslations();

  const companySchema = z.object({
    name: z.string().min(1, t('publicInfo.companyNameRequired')).max(150, t('publicInfo.companyNameMaxLength')),
    description: z.string().optional(),
    industry: z.string().optional(),
    company_size: z.enum(['less_than_10', '10_to_50', '51_to_200', '201_to_500', '501_to_1000', '1001_to_5000', 'more_than_5000']).optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    phone_main: z.string().optional(),
    phone_extra: z.string().optional(),
    phone_visible: z.boolean(),
    email: z.string().email(t('publicInfo.invalidEmail')).optional(),
  });

  type CompanyFormData = z.infer<typeof companySchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          industry: initialData.industry || '',
          company_size: initialData.company_size || 'less_than_10',
          city: initialData.city || '',
          country: initialData.country || '',
          phone_main: initialData.phone_main || '',
          phone_extra: initialData.phone_extra || '',
          phone_visible: initialData.phone_visible,
          email: initialData.email || '',
        }
      : {
          name: '',
          description: '',
          industry: '',
          company_size: 'less_than_10',
          city: '',
          country: '',
          phone_main: '',
          phone_extra: '',
          phone_visible: false,
          email: '',
        },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true);
    try {
      const result = await updateCompanyProfileAction(data);
      if (result?.data?.data) {
        toast.success(t('publicInfo.updateSuccess'));
        onUpdate(result?.data?.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating company profile:', error);
      toast.error(t('publicInfo.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      reset();
      setIsEditing(false);
    }
  };

  return (
    <div className="auth-card p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h2" className="text-foreground">
          {t('publicInfo.title')}
        </Typography>
        {!isEditing && initialData && (
          <ReusableButton
            variant="default"
            onClick={() => setIsEditing(true)}
          >
            <i className="fa-solid fa-edit mr-2" />
            {t('publicInfo.edit')}
          </ReusableButton>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block mb-2">
              <Typography variant="p" className="text-foreground">
                {t('publicInfo.companyName')} <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <ReusableInput
                  {...field}
                  placeholder={t('publicInfo.companyNamePlaceholder')}
                  hasError={!!errors.name}
                  size="large"
                />
              )}
            />
            {errors.name && (
              <Typography variant="small" className="text-red-500 mt-1">
                {errors.name.message}
              </Typography>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2">
              <Typography variant="p" className="text-foreground">
                {t('publicInfo.description')}
              </Typography>
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  value={field.value || ''}
                  rows={4}
                  placeholder={t('publicInfo.descriptionPlaceholder')}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Industry */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('publicInfo.industry')}
                </Typography>
              </label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('publicInfo.industryPlaceholder')}
                    hasError={!!errors.industry}
                    size="large"
                  />
                )}
              />
              {errors.industry && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.industry.message}
                </Typography>
              )}
            </div>

            {/* Company Size */}
            <div>
              <Controller
                name="company_size"
                control={control}
                render={({ field }) => (
                  <ReusableSelect
                    label={t('publicInfo.companySize')}
                    placeholder={t('publicInfo.companySizePlaceholder')}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.company_size?.message}
                    size="large"
                    selectValues={[
                      { title: t('companySize.lessThan10'), value: 'less_than_10' },
                      { title: t('companySize.10to50'), value: '10_to_50' },
                      { title: t('companySize.51to200'), value: '51_to_200' },
                      { title: t('companySize.201to500'), value: '201_to_500' },
                      { title: t('companySize.501to1000'), value: '501_to_1000' },
                      { title: t('companySize.1001to5000'), value: '1001_to_5000' },
                      { title: t('companySize.moreThan5000'), value: 'more_than_5000' },
                    ]}
                  />
                )}
              />
            </div>

            {/* City */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('publicInfo.city')}
                </Typography>
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('publicInfo.cityPlaceholder')}
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

            {/* Country */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('publicInfo.country')}
                </Typography>
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('publicInfo.countryPlaceholder')}
                    hasError={!!errors.country}
                    size="large"
                  />
                )}
              />
              {errors.country && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.country.message}
                </Typography>
              )}
            </div>

            {/* Phone Main */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('publicInfo.primaryPhone')}
                </Typography>
              </label>
              <Controller
                name="phone_main"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('publicInfo.primaryPhonePlaceholder')}
                    hasError={!!errors.phone_main}
                    size="large"
                  />
                )}
              />
              {errors.phone_main && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.phone_main.message}
                </Typography>
              )}
            </div>

            {/* Phone Extra */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('publicInfo.secondaryPhone')}
                </Typography>
              </label>
              <Controller
                name="phone_extra"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('publicInfo.secondaryPhonePlaceholder')}
                    hasError={!!errors.phone_extra}
                    size="large"
                  />
                )}
              />
              {errors.phone_extra && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.phone_extra.message}
                </Typography>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('publicInfo.contactEmail')}
                </Typography>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    type="email"
                    placeholder={t('publicInfo.contactEmailPlaceholder')}
                    hasError={!!errors.email}
                    size="large"
                  />
                )}
              />
              {errors.email && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.email.message}
                </Typography>
              )}
            </div>
          </div>

          {/* Phone Visible */}
          <div className="flex items-center">
            <Controller
              name="phone_visible"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  <Typography variant="p" className="text-foreground">
                    {t('publicInfo.phoneVisibility')}
                  </Typography>
                </Checkbox>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            {initialData && (
              <ReusableButton
                type="button"
                variant="default"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {t('publicInfo.cancel')}
              </ReusableButton>
            )}
            <ReusableButton
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? t('publicInfo.saving') : t('publicInfo.saveChanges')}
            </ReusableButton>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <InfoRow label={t('publicInfo.companyName')} value={initialData?.name} />
          <InfoRow label={t('publicInfo.description')} value={initialData?.description} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label={t('publicInfo.industry')} value={initialData?.industry} />
            <InfoRow 
              label={t('publicInfo.companySize')} 
              value={initialData?.company_size ? formatCompanySize(initialData.company_size, t) : undefined} 
            />
            <InfoRow label={t('publicInfo.city')} value={initialData?.city} />
            <InfoRow label={t('publicInfo.country')} value={initialData?.country} />
            <InfoRow label={t('publicInfo.primaryPhone')} value={initialData?.phone_main} />
            <InfoRow label={t('publicInfo.secondaryPhone')} value={initialData?.phone_extra} />
            <InfoRow label={t('publicInfo.contactEmail')} value={initialData?.email} />
          </div>
          <InfoRow 
            label={t('publicInfo.phoneVisibilityLabel')} 
            value={initialData?.phone_visible ? t('publicInfo.phoneVisibleToSeekers') : t('publicInfo.phoneHiddenFromSeekers')} 
          />
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  const t = useEmployerProfileTranslations();
  return (
    <div>
      <Typography variant="small" className="text-muted-foreground mb-1">
        {label}
      </Typography>
      <Typography variant="p" className="text-foreground">
        {value || t('publicInfo.notProvided')}
      </Typography>
    </div>
  );
}

function formatCompanySize(size: string, t: any): string {
  const sizeMap: Record<string, string> = {
    'less_than_10': t('companySize.lessThan10'),
    '10_to_50': t('companySize.10to50'),
    '51_to_200': t('companySize.51to200'),
    '201_to_500': t('companySize.201to500'),
    '501_to_1000': t('companySize.501to1000'),
    '1001_to_5000': t('companySize.1001to5000'),
    'more_than_5000': t('companySize.moreThan5000'),
  };
  return sizeMap[size] || size;
}
