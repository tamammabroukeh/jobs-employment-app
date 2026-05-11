'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ReusableSelect, ReusableInput } from '@/components/Reusable-Components';
import { useDebounce } from '@/hooks/use-debounce';
import { useTypedTranslations } from '@/hooks/use-translations';

export interface JobFiltersState {
  search: string;
  types: string[];
  cities: string[];
  roles: string[];
  levels: string[];
}

interface JobFiltersProps {
  onFiltersChange: (filters: JobFiltersState) => void;
}

// Filter options - Replace with API data
const JOB_TYPES = [
  { title: 'Full-time', value: 'Full-time' },
  { title: 'Part-time', value: 'Part-time' },
  { title: 'Contract', value: 'Contract' },
  { title: 'Remote', value: 'Remote' },
  { title: 'Hybrid', value: 'Hybrid' },
  { title: 'On-site', value: 'On-site' },
];

const CITIES = [
  { title: 'San Francisco, CA', value: 'San Francisco, CA' },
  { title: 'Seattle, WA', value: 'Seattle, WA' },
  { title: 'New York, NY', value: 'New York, NY' },
  { title: 'Austin, TX', value: 'Austin, TX' },
  { title: 'Los Angeles, CA', value: 'Los Angeles, CA' },
  { title: 'Boston, MA', value: 'Boston, MA' },
  { title: 'Chicago, IL', value: 'Chicago, IL' },
  { title: 'Denver, CO', value: 'Denver, CO' },
];

const JOB_ROLES = [
  { title: 'Frontend', value: 'Frontend' },
  { title: 'Backend', value: 'Backend' },
  { title: 'Full Stack', value: 'Full Stack' },
  { title: 'Mobile', value: 'Mobile' },
  { title: 'DevOps', value: 'DevOps' },
  { title: 'Data', value: 'Data' },
  { title: 'Design', value: 'Design' },
  { title: 'Product', value: 'Product' },
  { title: 'Marketing', value: 'Marketing' },
];

const JOB_LEVELS = [
  { title: 'Entry-level', value: 'Entry-level' },
  { title: 'Junior', value: 'Junior' },
  { title: 'Mid-level', value: 'Mid-level' },
  { title: 'Senior', value: 'Senior' },
  { title: 'Lead', value: 'Lead' },
  { title: 'Manager', value: 'Manager' },
  { title: 'Director', value: 'Director' },
];

export default function JobFilters({ onFiltersChange }: JobFiltersProps) {
  const t = useTypedTranslations('jobs');
  
  const { control, watch, reset } = useForm<JobFiltersState>({
    defaultValues: {
      search: '',
      types: [],
      cities: [],
      roles: [],
      levels: [],
    },
  });

  // Watch all form values
  const searchValue = watch('search');
  const typesValue = watch('types');
  const citiesValue = watch('cities');
  const rolesValue = watch('roles');
  const levelsValue = watch('levels');

  // Debounce search input
  const debouncedSearch = useDebounce(searchValue, 500);

  // Trigger callback when filters change
  useEffect(() => {
    onFiltersChange({
      search: debouncedSearch,
      types: typesValue,
      cities: citiesValue,
      roles: rolesValue,
      levels: levelsValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, typesValue, citiesValue, rolesValue, levelsValue]);

  const handleClearFilters = () => {
    reset({
      search: '',
      types: [],
      cities: [],
      roles: [],
      levels: [],
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-5">
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

        {/* Job Types Filter */}
        <Controller
          name="types"
          control={control}
          render={({ field }) => (
            <ReusableSelect
              label={t('filters.jobType')}
              placeholder={t('filters.selectJobType')}
              selectValues={JOB_TYPES}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(Array.isArray(value) ? value : [value]);
              }}
              mode="multiple"
              allowClear
              showSearch
              maxTagCount="responsive"
            />
          )}
        />

        {/* Cities Filter */}
        <Controller
          name="cities"
          control={control}
          render={({ field }) => (
            <ReusableSelect
              label={t('filters.city')}
              placeholder={t('filters.selectCity')}
              selectValues={CITIES}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(Array.isArray(value) ? value : [value]);
              }}
              mode="multiple"
              allowClear
              showSearch
              maxTagCount="responsive"
            />
          )}
        />

        {/* Job Roles Filter */}
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <ReusableSelect
              label={t('filters.jobRole')}
              placeholder={t('filters.selectJobRole')}
              selectValues={JOB_ROLES}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(Array.isArray(value) ? value : [value]);
              }}
              mode="multiple"
              allowClear
              showSearch
              maxTagCount="responsive"
            />
          )}
        />

        {/* Job Levels Filter */}
        <Controller
          name="levels"
          control={control}
          render={({ field }) => (
            <ReusableSelect
              label={t('filters.jobLevel')}
              placeholder={t('filters.selectJobLevel')}
              selectValues={JOB_LEVELS}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(Array.isArray(value) ? value : [value]);
              }}
              mode="multiple"
              allowClear
              showSearch
              maxTagCount="responsive"
            />
          )}
        />

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-full h-10 px-4 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <i className="fa-solid fa-filter-circle-xmark mr-2" />
            {t('filters.clearAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
