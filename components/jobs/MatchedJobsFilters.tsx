'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ReusableSelect } from '@/components/Reusable-Components';
import { useTypedTranslations } from '@/hooks/use-translations';

export interface MatchedJobsFiltersState {
  minScore?: number;
}

interface MatchedJobsFiltersProps {
  onFiltersChange: (filters: MatchedJobsFiltersState) => void;
}

// Match score filter options
const MATCH_SCORE_OPTIONS = [
  { title: 'All Matches', value: '' },
  { title: 'Score 2+', value: '2' },
  { title: 'Score 4+', value: '4' },
  { title: 'Score 6+', value: '6' },
  { title: 'Score 8+', value: '8' },
  { title: 'Score 10+', value: '10' },
];

export default function MatchedJobsFilters({ onFiltersChange }: MatchedJobsFiltersProps) {
  const t = useTypedTranslations('jobs');

  const { control, watch, reset } = useForm<MatchedJobsFiltersState>({
    defaultValues: {
      minScore: undefined,
    },
  });

  // Watch form values
  const minScoreValue = watch('minScore');

  // Trigger callback when filters change
  useEffect(() => {
    onFiltersChange({
      minScore: minScoreValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minScoreValue]);

  const handleClearFilters = () => {
    reset({
      minScore: undefined,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center gap-4">
        {/* Info Text */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            <i className="fa-solid fa-bullseye mr-2 text-primary" />
            {t('matchedJobs.title')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('matchedJobs.description')}
          </p>
        </div>

        {/* Min Score Filter */}
        <div className="w-48">
          <Controller
            name="minScore"
            control={control}
            render={({ field }) => (
              <ReusableSelect
                placeholder={t('matchedJobs.minScoreLabel')}
                selectValues={MATCH_SCORE_OPTIONS}
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
