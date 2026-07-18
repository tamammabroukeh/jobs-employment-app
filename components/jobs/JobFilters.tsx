'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ReusableSelect, ReusableInput } from '@/components/Reusable-Components';
import { useDebounce } from '@/hooks/use-debounce';
import { useTypedTranslations } from '@/hooks/use-translations';
import { TJobTypes } from '@/apis/services/job-seeker/interface';
import { useSearchParams } from '@/hooks/useSearchParams';

export interface JobFiltersState {
  search: string;
  jobType: TJobTypes;
  location: string;
  category: string;
  minSalary?: number;
}

interface JobFiltersProps {
  onFiltersChange: (filters: JobFiltersState) => void;
}

// Filter options matching API requirements
const JOB_TYPES = [
  { title: 'Full Time', value: 'full_time' },
  { title: 'Part Time', value: 'part_time' },
  { title: 'Contract', value: 'contract' },
  { title: 'Freelance', value: 'freelance' },
];

const CATEGORIES = [
  { title: 'Engineering', value: 'Engineering' },
  { title: 'Design', value: 'Design' },
  { title: 'Marketing', value: 'Marketing' },
  { title: 'Sales', value: 'Sales' },
  { title: 'Product', value: 'Product' },
  { title: 'Data', value: 'Data' },
  { title: 'Customer Service', value: 'Customer Service' },
  { title: 'HR', value: 'HR' },
];

const SALARY_RANGES = [
  { title: 'Any Salary', value: '' },
  { title: '$1,000+', value: '1000' },
  { title: '$2,000+', value: '2000' },
  { title: '$3,000+', value: '3000' },
  { title: '$4,000+', value: '4000' },
  { title: '$5,000+', value: '5000' },
  { title: '$10,000+', value: '10000' },
];

export default function JobFilters({ onFiltersChange }: JobFiltersProps) {
  const t = useTypedTranslations('jobs');
    const { getParam, deleteParam } = useSearchParams()
    const searchParam = getParam("search")
  const { control, watch, reset } = useForm<JobFiltersState>({
    defaultValues: {
      search: searchParam ?? '',
      jobType: '',
      location: '',
      category: '',
      minSalary: undefined,
    },
  });

  // Watch all form values
  const searchValue = watch('search');
  const jobTypeValue = watch('jobType');
  const locationValue = watch('location');
  const categoryValue = watch('category');
  const minSalaryValue = watch('minSalary');

  // Debounce search input
  const debouncedSearch = useDebounce(searchValue, 500);
  const debouncedLocation = useDebounce(locationValue, 500);

  // Trigger callback when filters change
  useEffect(() => {
    onFiltersChange({
      search: debouncedSearch,
      jobType: jobTypeValue,
      location: debouncedLocation,
      category: categoryValue,
      minSalary: minSalaryValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, jobTypeValue, debouncedLocation, categoryValue, minSalaryValue]);

  const handleClearFilters = () => {
    reset({
      search: '',
      jobType: '',
      location: '',
      category: '',
      minSalary: undefined,
    });
    deleteParam("search")
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <ReusableInput
                placeholder={t('filters.searchPlaceholder')}
                value={field.value}
                onChange={field.onChange}
                prefix={<i className="fa-solid fa-search text-muted-foreground" />}
                size="large"
              />
            )}
          />
        </div>

        {/* Location Input */}
        <div>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <ReusableInput
                placeholder={t('filters.locationPlaceholder')}
                value={field.value}
                onChange={field.onChange}
                prefix={<i className="fa-solid fa-location-dot text-muted-foreground" />}
                size="large"
              />
            )}
          />
        </div>

        {/* Job Type Filter */}
        <Controller
          name="jobType"
          control={control}
          render={({ field }) => (
            <ReusableSelect
              placeholder={t('filters.selectJobType')}
              selectValues={JOB_TYPES}
              value={field.value}
              onValueChange={field.onChange}
              allowClear
              showSearch
            />
          )}
        />

        {/* Category Filter */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <ReusableSelect
              placeholder={t('filters.selectCategory')}
              selectValues={CATEGORIES}
              value={field.value}
              onValueChange={field.onChange}
              allowClear
              showSearch
            />
          )}
        />

        {/* Min Salary Filter */}
        <Controller
          name="minSalary"
          control={control}
          render={({ field }) => (
            <ReusableSelect
              placeholder={t('filters.minSalary')}
              selectValues={SALARY_RANGES}
              value={field.value ? String(field.value) : ''}
              onValueChange={(value) => {
                field.onChange(value ? Number(value) : undefined);
              }}
              allowClear
            />
          )}
        />
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <i className="fa-solid fa-filter-circle-xmark mr-2" />
          {t('filters.clearAll')}
        </button>
      </div>
    </div>
  );
}
