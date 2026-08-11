'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Typography, ReusableButton, ReusableInput } from '@/components/Reusable-Components';
import { Input, Checkbox, Tag } from 'antd';
import type { CompanyProfile } from '@/apis/services/employer';
import { updateCompanyPrivateInfoAction } from '@/apis/services/employer/actions';
import { useEmployerProfileTranslations } from '@/hooks/use-translations';

const { TextArea } = Input;

interface CompanyPrivateInfoSectionProps {
  initialData: CompanyProfile | null;
  onUpdate: (data: CompanyProfile) => void;
}

export default function CompanyPrivateInfoSection({ initialData, onUpdate }: CompanyPrivateInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [industryTagInput, setIndustryTagInput] = useState('');
  const t = useEmployerProfileTranslations();

  const privateInfoSchema = z.object({
    expose_to_applicants: z.boolean(),
    address: z.string().optional(),
    industry_tags: z.array(z.string()).optional(),
    founded_year: z.number().min(1800, t('privateInfo.foundedYearInvalid')).max(new Date().getFullYear(), t('privateInfo.foundedYearFuture')).optional().nullable(),
    website: z.string().url(t('privateInfo.invalidUrl')).optional().or(z.literal('')),
    social_media: z.object({
      linkedin: z.string().url(t('socialMedia.linkedinInvalid')).optional().or(z.literal('')),
      github: z.string().url(t('socialMedia.githubInvalid')).optional().or(z.literal('')),
      twitter: z.string().url(t('socialMedia.twitterInvalid')).optional().or(z.literal('')),
      facebook: z.string().url(t('socialMedia.facebookInvalid')).optional().or(z.literal('')),
      instagram: z.string().optional().or(z.literal('')),
      telegram: z.string().optional().or(z.literal('')),
      behance: z.string().url(t('socialMedia.behanceInvalid')).optional().or(z.literal('')),
    }).optional(),
  });

  type PrivateInfoFormData = z.infer<typeof privateInfoSchema>;

  const privateInfo = initialData?.private_info || {
    expose_to_applicants: false,
    address: null,
    industry_tags: [],
    founded_year: null,
    website: null,
    social_media: {
      linkedin: null,
      github: null,
      twitter: null,
      facebook: null,
      instagram: null,
      telegram: null,
      behance: null,
    },
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PrivateInfoFormData>({
    resolver: zodResolver(privateInfoSchema),
    defaultValues: {
      expose_to_applicants: privateInfo.expose_to_applicants,
      address: privateInfo.address || '',
      industry_tags: privateInfo.industry_tags || [],
      founded_year: privateInfo.founded_year,
      website: privateInfo.website || '',
      social_media: {
        linkedin: privateInfo.social_media?.linkedin || '',
        github: privateInfo.social_media?.github || '',
        twitter: privateInfo.social_media?.twitter || '',
        facebook: privateInfo.social_media?.facebook || '',
        instagram: privateInfo.social_media?.instagram || '',
        telegram: privateInfo.social_media?.telegram || '',
        behance: privateInfo.social_media?.behance || '',
      },
    },
  });

  const industryTags = watch('industry_tags') || [];

  const onSubmit = async (data: PrivateInfoFormData) => {
    setIsLoading(true);
    try {
      // Convert empty strings to null for URLs
      const cleanedData = {
        ...data,
        website: data.website || undefined,
        founded_year: data.founded_year || undefined,
        social_media: data.social_media ? {
          linkedin: data.social_media.linkedin || undefined,
          github: data.social_media.github || undefined,
          twitter: data.social_media.twitter || undefined,
          facebook: data.social_media.facebook || undefined,
          instagram: data.social_media.instagram || undefined,
          telegram: data.social_media.telegram || undefined,
          behance: data.social_media.behance || undefined,
        } : undefined,
      };

      const result = await updateCompanyPrivateInfoAction(cleanedData);
      
      if (result?.data?.data) {
        toast.success(t('privateInfo.updateSuccess'));
        onUpdate(result.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating private information:', error);
      toast.error(t('privateInfo.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (industryTagInput.trim() && !industryTags.includes(industryTagInput.trim())) {
      setValue('industry_tags', [...industryTags, industryTagInput.trim()]);
      setIndustryTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('industry_tags', industryTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="auth-card p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Typography variant="h2" className="text-foreground mb-2">
            {t('privateInfo.title')}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            {t('privateInfo.subtitle')}
          </Typography>
        </div>
        {!isEditing && (
          <ReusableButton
            variant="default"
            onClick={() => setIsEditing(true)}
          >
            <i className="fa-solid fa-edit mr-2" />
            {t('privateInfo.edit')}
          </ReusableButton>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Expose to Applicants */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <Controller
              name="expose_to_applicants"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  <div>
                    <Typography variant="p" className="text-foreground font-semibold">
                      {t('privateInfo.exposeToApplicants')}
                    </Typography>
                    <Typography variant="small" className="text-muted-foreground block mt-1">
                      {t('privateInfo.exposeDescription')}
                    </Typography>
                  </div>
                </Checkbox>
              )}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2">
              <Typography variant="p" className="text-foreground">
                {t('privateInfo.fullAddress')}
              </Typography>
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  value={field.value || ''}
                  rows={2}
                  placeholder={t('privateInfo.fullAddressPlaceholder')}
                  status={errors.address ? 'error' : undefined}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Founded Year */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('privateInfo.foundedYear')}
                </Typography>
              </label>
              <Controller
                name="founded_year"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    type="number"
                    placeholder={t('privateInfo.foundedYearPlaceholder')}
                    hasError={!!errors.founded_year}
                    size="large"
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                )}
              />
              {errors.founded_year && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.founded_year.message}
                </Typography>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  {t('privateInfo.website')}
                </Typography>
              </label>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    type="url"
                    placeholder={t('privateInfo.websitePlaceholder')}
                    hasError={!!errors.website}
                    size="large"
                  />
                )}
              />
              {errors.website && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.website.message}
                </Typography>
              )}
            </div>
          </div>

          {/* Industry Tags */}
          <div>
            <label className="block mb-2">
              <Typography variant="p" className="text-foreground">
                {t('privateInfo.industryTags')}
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                {t('privateInfo.industryTagsDescription')}
              </Typography>
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={industryTagInput}
                onChange={(e) => setIndustryTagInput(e.target.value)}
                onPressEnter={(e) => {
                  e.preventDefault();
                  handleAddTag();
                }}
                placeholder={t('privateInfo.industryTagsPlaceholder')}
                size="large"
              />
              <ReusableButton
                type="button"
                onClick={handleAddTag}
                variant="default"
              >
                {t('privateInfo.addTag')}
              </ReusableButton>
            </div>
            {industryTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {industryTags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleRemoveTag(tag)}
                    className="text-sm"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* Social Media */}
          <div>
            <Typography variant="h3" className="text-foreground mb-4">
              {t('socialMedia.title')}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">
                  <Typography variant="small" className="text-foreground">
                    <i className="fa-brands fa-linkedin mr-2 text-blue-600" />
                    {t('socialMedia.linkedin')}
                  </Typography>
                </label>
                <Controller
                  name="social_media.linkedin"
                  control={control}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      value={field.value || ''}
                      type="url"
                      placeholder={t('socialMedia.linkedinPlaceholder')}
                      hasError={!!errors.social_media?.linkedin}
                      size="large"
                    />
                  )}
                />
                {errors.social_media?.linkedin && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {errors.social_media.linkedin.message}
                  </Typography>
                )}
              </div>

              <div>
                <label className="block mb-2">
                  <Typography variant="small" className="text-foreground">
                    <i className="fa-brands fa-github mr-2" />
                    {t('socialMedia.github')}
                  </Typography>
                </label>
                <Controller
                  name="social_media.github"
                  control={control}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      value={field.value || ''}
                      type="url"
                      placeholder={t('socialMedia.githubPlaceholder')}
                      hasError={!!errors.social_media?.github}
                      size="large"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block mb-2">
                  <Typography variant="small" className="text-foreground">
                    <i className="fa-brands fa-twitter mr-2 text-blue-400" />
                    {t('socialMedia.twitter')}
                  </Typography>
                </label>
                <Controller
                  name="social_media.twitter"
                  control={control}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      value={field.value || ''}
                      type="url"
                      placeholder={t('socialMedia.twitterPlaceholder')}
                      hasError={!!errors.social_media?.twitter}
                      size="large"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block mb-2">
                  <Typography variant="small" className="text-foreground">
                    <i className="fa-brands fa-facebook mr-2 text-blue-600" />
                    {t('socialMedia.facebook')}
                  </Typography>
                </label>
                <Controller
                  name="social_media.facebook"
                  control={control}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      value={field.value || ''}
                      type="url"
                      placeholder={t('socialMedia.facebookPlaceholder')}
                      hasError={!!errors.social_media?.facebook}
                      size="large"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block mb-2">
                  <Typography variant="small" className="text-foreground">
                    <i className="fa-brands fa-instagram mr-2 text-pink-600" />
                    {t('socialMedia.instagram')}
                  </Typography>
                </label>
                <Controller
                  name="social_media.instagram"
                  control={control}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      value={field.value || ''}
                      placeholder={t('socialMedia.instagramPlaceholder')}
                      hasError={!!errors.social_media?.instagram}
                      size="large"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block mb-2">
                  <Typography variant="small" className="text-foreground">
                    <i className="fa-brands fa-telegram mr-2 text-blue-500" />
                    {t('socialMedia.telegram')}
                  </Typography>
                </label>
                <Controller
                  name="social_media.telegram"
                  control={control}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      value={field.value || ''}
                      placeholder={t('socialMedia.telegramPlaceholder')}
                      hasError={!!errors.social_media?.telegram}
                      size="large"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block mb-2">
                  <Typography variant="small" className="text-foreground">
                    <i className="fa-brands fa-behance mr-2 text-blue-700" />
                    {t('socialMedia.behance')}
                  </Typography>
                </label>
                <Controller
                  name="social_media.behance"
                  control={control}
                  render={({ field }) => (
                    <ReusableInput
                      {...field}
                      value={field.value || ''}
                      type="url"
                      placeholder={t('socialMedia.behancePlaceholder')}
                      hasError={!!errors.social_media?.behance}
                      size="large"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <ReusableButton
              type="button"
              variant="default"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t('privateInfo.cancel')}
            </ReusableButton>
            <ReusableButton
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? t('privateInfo.saving') : t('privateInfo.saveChanges')}
            </ReusableButton>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <InfoRow 
            label={t('privateInfo.exposeToApplicants')} 
            value={privateInfo.expose_to_applicants ? t('privateInfo.exposeYes') : t('privateInfo.exposeNo')} 
          />
          <InfoRow label={t('privateInfo.address')} value={privateInfo.address} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label={t('privateInfo.foundedYear')} value={privateInfo.founded_year?.toString()} />
            <InfoRow label={t('privateInfo.website')} value={privateInfo.website} isLink />
          </div>
          {privateInfo.industry_tags && privateInfo.industry_tags.length > 0 && (
            <div>
              <Typography variant="small" className="text-muted-foreground mb-2">
                {t('privateInfo.industryTags')}
              </Typography>
              <div className="flex flex-wrap gap-2">
                {privateInfo.industry_tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          )}
          <div>
            <Typography variant="small" className="text-muted-foreground mb-2">
              {t('socialMedia.label')}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {privateInfo.social_media?.linkedin && (
                <InfoRow label={t('socialMedia.linkedin')} value={privateInfo.social_media.linkedin} isLink />
              )}
              {privateInfo.social_media?.github && (
                <InfoRow label={t('socialMedia.github')} value={privateInfo.social_media.github} isLink />
              )}
              {privateInfo.social_media?.twitter && (
                <InfoRow label={t('socialMedia.twitter')} value={privateInfo.social_media.twitter} isLink />
              )}
              {privateInfo.social_media?.facebook && (
                <InfoRow label={t('socialMedia.facebook')} value={privateInfo.social_media.facebook} isLink />
              )}
              {privateInfo.social_media?.instagram && (
                <InfoRow label={t('socialMedia.instagram')} value={privateInfo.social_media.instagram} />
              )}
              {privateInfo.social_media?.telegram && (
                <InfoRow label={t('socialMedia.telegram')} value={privateInfo.social_media.telegram} />
              )}
              {privateInfo.social_media?.behance && (
                <InfoRow label={t('socialMedia.behance')} value={privateInfo.social_media.behance} isLink />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, isLink = false }: { label: string; value?: string | null; isLink?: boolean }) {
  const t = useEmployerProfileTranslations();
  return (
    <div>
      <Typography variant="small" className="text-muted-foreground mb-1">
        {label}
      </Typography>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {value}
        </a>
      ) : (
        <Typography variant="p" className="text-foreground">
          {value || t('privateInfo.notProvided')}
        </Typography>
      )}
    </div>
  );
}
