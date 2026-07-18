"use client";

import { useState } from 'react';
import { Typography, ReusableButton, ReusableInput, ReusableSelect } from '@/components/Reusable-Components';
import { Slider } from 'antd';
import type { TalentSearchFilters } from '@/apis/services/search/interface';
import { useTypedTranslations } from '@/hooks/use-translations';

interface TalentsFiltersProps {
  onFilterChange: (filters: TalentSearchFilters) => void;
  currentFilters: TalentSearchFilters;
}

const JOB_LEVELS = [
  { title: 'Entry', value: 'entry' },
  { title: 'Junior', value: 'junior' },
  { title: 'Mid', value: 'mid' },
  { title: 'Senior', value: 'senior' },
  { title: 'Lead', value: 'lead' },
  { title: 'Executive', value: 'executive' },
];

export default function TalentsFilters({
  onFilterChange,
  currentFilters,
}: TalentsFiltersProps) {
  const t = useTypedTranslations('talents');

  const [localFilters, setLocalFilters] = useState<TalentSearchFilters>({
    search: currentFilters.search || '',
    skills: currentFilters.skills || '',
    location: currentFilters.location || '',
    job_level: currentFilters.job_level || '',
    min_experience: currentFilters.min_experience || 0,
    max_experience: currentFilters.max_experience || 20,
    min_ats_score: currentFilters.min_ats_score || 0,
    max_ats_score: currentFilters.max_ats_score || 100,
    actively_seeking: currentFilters.actively_seeking,
  });

  const handleFilterUpdate = (key: keyof TalentSearchFilters, value: string | number | boolean | undefined) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const handleExperienceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setLocalFilters((prev) => ({
        ...prev,
        min_experience: values[0],
        max_experience: values[1],
      }));
    }
  };

  const handleAtsScoreChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setLocalFilters((prev) => ({
        ...prev,
        min_ats_score: values[0],
        max_ats_score: values[1],
      }));
    }
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: TalentSearchFilters = {
      search: '',
      skills: '',
      location: '',
      job_level: '',
      min_experience: 0,
      max_experience: 20,
      min_ats_score: 0,
      max_ats_score: 100,
      actively_seeking: undefined,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="auth-card p-6 sticky top-20">
      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            {t('filters.searchLabel')}
          </Typography>
          <ReusableInput
            placeholder={t('filters.searchPlaceholder')}
            value={localFilters.search}
            onChange={(e) => handleFilterUpdate('search', e.target.value)}
            prefix={<i className="fa-solid fa-search text-muted-foreground" />}
          />
          <Typography variant="p" className="text-xs text-muted-foreground mt-1">
            {t('filters.searchHint')}
          </Typography>
        </div>

        {/* Skills Input */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            {t('filters.skillsLabel')}
          </Typography>
          <ReusableInput
            placeholder={t('filters.skillsPlaceholder')}
            value={localFilters.skills}
            onChange={(e) => handleFilterUpdate('skills', e.target.value)}
            prefix={<i className="fa-solid fa-code text-muted-foreground" />}
          />
          <Typography variant="p" className="text-xs text-muted-foreground mt-1">
            {t('filters.skillsHint')}
          </Typography>
        </div>

        {/* Location Input */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            {t('filters.locationLabel')}
          </Typography>
          <ReusableInput
            placeholder={t('filters.locationPlaceholder')}
            value={localFilters.location}
            onChange={(e) => handleFilterUpdate('location', e.target.value)}
            prefix={<i className="fa-solid fa-location-dot text-muted-foreground" />}
          />
        </div>

        {/* Job Level Select */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            {t('filters.jobLevelLabel')}
          </Typography>
          <ReusableSelect
            placeholder={t('filters.jobLevelPlaceholder')}
            selectValues={JOB_LEVELS}
            value={localFilters.job_level}
            onValueChange={(value) => {
              // Handle single select value (string) or undefined when cleared
              const stringValue = Array.isArray(value) ? value[0] : value;
              handleFilterUpdate('job_level', stringValue);
            }}
            allowClear
          />
        </div>

        {/* Experience Range */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            {t('filters.experienceLabel')}
          </Typography>
          <Slider
            range
            min={0}
            max={20}
            value={[localFilters.min_experience || 0, localFilters.max_experience || 20]}
            onChange={handleExperienceChange}
            marks={{
              0: '0',
              5: '5',
              10: '10',
              15: '15',
              20: '20+',
            }}
          />
          <div className="text-sm text-foreground text-center mt-2">
            {localFilters.min_experience || 0} - {localFilters.max_experience || 20} {t('filters.years')}
          </div>
        </div>

        {/* ATS Score Range */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            {t('filters.atsScoreLabel')}
          </Typography>
          <Slider
            range
            min={0}
            max={100}
            value={[localFilters.min_ats_score || 0, localFilters.max_ats_score || 100]}
            onChange={handleAtsScoreChange}
            marks={{
              0: '0',
              50: '50',
              100: '100',
            }}
          />
          <div className="text-sm text-foreground text-center mt-2">
            {localFilters.min_ats_score || 0} - {localFilters.max_ats_score || 100}
          </div>
          <Typography variant="p" className="text-xs text-muted-foreground mt-1">
            {t('filters.atsScoreHint')}
          </Typography>
        </div>

        {/* Actively Seeking Toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.actively_seeking || false}
              onChange={(e) => handleFilterUpdate('actively_seeking', e.target.checked || undefined)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
            />
            <Typography variant="p" className="text-foreground">
              {t('filters.activelySeeking')}
            </Typography>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-border">
          <ReusableButton
            btnText={t('filters.applyButton')}
            onClick={handleApplyFilters}
            variant="primary"
            className="w-full"
          />
          <ReusableButton
            btnText={t('filters.resetButton')}
            onClick={handleResetFilters}
            variant="default"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
