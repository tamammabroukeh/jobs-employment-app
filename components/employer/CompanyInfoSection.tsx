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

const { TextArea } = Input;

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(150, 'Company name must be at most 150 characters'),
  description: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.enum(['less_than_10', '10_to_50', '51_to_200', '201_to_500', '501_to_1000', '1001_to_5000', 'more_than_5000']).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  phone_visible: z.boolean(),
  email: z.string().email('Invalid email format').optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyInfoSectionProps {
  initialData: CompanyProfile | null;
  onUpdate: (data: CompanyProfile) => void;
}

export default function CompanyInfoSection({ initialData, onUpdate }: CompanyInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(!initialData); // Auto-edit if no data
  const [isLoading, setIsLoading] = useState(false);

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
          description: initialData.description,
          industry: initialData.industry,
          company_size: initialData.company_size,
          city: initialData.city,
          country: initialData.country,
          phone: initialData.phone,
          phone_visible: initialData.phone_visible,
          email: initialData.email,
        }
      : {
          name: '',
          description: '',
          industry: '',
          company_size: 'less_than_10',
          city: '',
          country: '',
          phone: '',
          phone_visible: false,
          email: '',
        },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true);
    try {
      const result = await updateCompanyProfileAction(data);
      console.log('result', result)
      if (result?.data?.data) {
        toast.success('Company profile updated successfully!');
        onUpdate(result?.data?.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating company profile:', error);
      toast.error('Failed to update company profile');
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
          Company Information
        </Typography>
        {!isEditing && initialData && (
          <ReusableButton
            variant="default"
            onClick={() => setIsEditing(true)}
          >
            <i className="fa-solid fa-edit mr-2" />
            Edit
          </ReusableButton>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block mb-2">
              <Typography variant="p" className="text-foreground">
                Company Name <span className="text-red-500">*</span>
              </Typography>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <ReusableInput
                  {...field}
                  placeholder="e.g., Tammam Company"
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
                Description
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
                  placeholder="Tell us about your company..."
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
                  Industry
                </Typography>
              </label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder="e.g., Information Technology Services"
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
                    label="Company Size"
                    placeholder="Select company size"
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.company_size?.message}
                    size="large"
                    selectValues={[
                      { title: 'Less than 10', value: 'less_than_10' },
                      { title: '10-50', value: '10_to_50' },
                      { title: '51-200', value: '51_to_200' },
                      { title: '201-500', value: '201_to_500' },
                      { title: '501-1000', value: '501_to_1000' },
                      { title: '1001-5000', value: '1001_to_5000' },
                      { title: 'More than 5000', value: 'more_than_5000' },
                    ]}
                  />
                )}
              />
            </div>

            {/* City */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  City
                </Typography>
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder="e.g., Damascus"
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
                  Country
                </Typography>
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder="e.g., Syria"
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

            {/* Phone */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  Phone
                </Typography>
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <ReusableInput
                    {...field}
                    value={field.value || ''}
                    placeholder="e.g., 0932444357"
                    hasError={!!errors.phone}
                    size="large"
                  />
                )}
              />
              {errors.phone && (
                <Typography variant="small" className="text-red-500 mt-1">
                  {errors.phone.message}
                </Typography>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2">
                <Typography variant="p" className="text-foreground">
                  Contact Email
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
                    placeholder="e.g., contact@company.com"
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
                    Display phone number publicly to job seekers
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
                Cancel
              </ReusableButton>
            )}
            <ReusableButton
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </ReusableButton>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <InfoRow label="Company Name" value={initialData?.name} />
          <InfoRow label="Description" value={initialData?.description} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Industry" value={initialData?.industry} />
            <InfoRow 
              label="Company Size" 
              value={initialData?.company_size ? formatCompanySize(initialData.company_size) : undefined} 
            />
            <InfoRow label="City" value={initialData?.city} />
            <InfoRow label="Country" value={initialData?.country} />
            <InfoRow label="Phone" value={initialData?.phone} />
            <InfoRow label="Email" value={initialData?.email} />
          </div>
          <InfoRow 
            label="Phone Visibility" 
            value={initialData?.phone_visible ? 'Visible to job seekers' : 'Hidden from job seekers'} 
          />
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <Typography variant="small" className="text-muted-foreground mb-1">
        {label}
      </Typography>
      <Typography variant="p" className="text-foreground">
        {value || 'Not provided'}
      </Typography>
    </div>
  );
}

function formatCompanySize(size: string): string {
  const sizeMap: Record<string, string> = {
    'less_than_10': 'Less than 10',
    '10_to_50': '10-50',
    '51_to_200': '51-200',
    '201_to_500': '201-500',
    '501_to_1000': '501-1000',
    '1001_to_5000': '1001-5000',
    'more_than_5000': 'More than 5000',
  };
  return sizeMap[size] || size;
}
