"use client";

import { useState } from 'react';
import { Typography, ReusableButton } from '@/components/Reusable-Components';
import { Select, Input, Slider } from 'antd';
import type { CandidatesQueryParams } from '@/apis/services/employer/interface';

interface CandidatesFiltersProps {
  onFilterChange: (filters: Partial<CandidatesQueryParams>) => void;
  currentFilters: CandidatesQueryParams;
}

const ALPHABET_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

const POPULAR_SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java',
  'PHP', 'Laravel', 'Vue', 'Angular', 'MongoDB', 'MySQL', 'PostgreSQL',
  'Docker', 'AWS', 'Git', 'Redux', 'Next.js', 'Express', 'Django'
];

export default function CandidatesFilters({
  onFilterChange,
  currentFilters,
}: CandidatesFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Partial<CandidatesQueryParams>>({
    keyword: currentFilters.keyword || '',
    location: currentFilters.location || '',
    skills: currentFilters.skills || '',
    min_ats_score: currentFilters.min_ats_score || 0,
    max_ats_score: currentFilters.max_ats_score || 100,
  });

  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [skillsArray, setSkillsArray] = useState<string[]>(
    currentFilters.skills ? currentFilters.skills.split(',') : []
  );

  const handleFilterUpdate = (key: keyof CandidatesQueryParams, value: string | number) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    const updatedKeyword = letter;
    setLocalFilters((prev) => ({ ...prev, keyword: updatedKeyword }));
    onFilterChange({ keyword: updatedKeyword });
  };

  const handleSkillsChange = (values: string[]) => {
    setSkillsArray(values);
    const skillsString = values.join(',');
    handleFilterUpdate('skills', skillsString);
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
    const resetFilters = {
      keyword: '',
      location: '',
      skills: '',
      min_ats_score: 0,
      max_ats_score: 100,
    };
    setLocalFilters(resetFilters);
    setSelectedLetter('');
    setSkillsArray([]);
    onFilterChange(resetFilters);
  };

  return (
    <div className="auth-card p-6 sticky top-20">
      <div className="space-y-6">
        {/* Alphabet Filter */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            Quick Search by Name
          </Typography>
          <div className="flex flex-wrap gap-1">
            {ALPHABET_LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Keyword Search */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            Job Keywords
          </Typography>
          <Input
            placeholder="e.g., frontend, developer, designer"
            value={localFilters.keyword}
            onChange={(e) => handleFilterUpdate('keyword', e.target.value)}
            allowClear
          />
          <Typography variant="p" className="text-xs text-muted-foreground mt-1">
            Search in AI summary or current job title
          </Typography>
        </div>

        {/* Skills Filter */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            Required Skills
          </Typography>
          <Select
            mode="tags"
            placeholder="Select skills (all must match)"
            className="w-full"
            value={skillsArray}
            onChange={handleSkillsChange}
            options={POPULAR_SKILLS.map((skill) => ({ value: skill, label: skill }))}
            allowClear
          />
          <Typography variant="p" className="text-xs text-muted-foreground mt-1">
            All selected skills must match
          </Typography>
        </div>

        {/* Location Filter */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            Location
          </Typography>
          <Input
            placeholder="e.g., Beirut, Damascus, Remote"
            value={localFilters.location}
            onChange={(e) => handleFilterUpdate('location', e.target.value)}
            allowClear
          />
          <Typography variant="p" className="text-xs text-muted-foreground mt-1">
            AI-detected location (partial match)
          </Typography>
        </div>

        {/* ATS Score Range */}
        <div>
          <Typography variant="h5" className="text-foreground mb-3 font-medium">
            ATS Score
          </Typography>
          <Slider
            range
            min={0}
            max={100}
            value={[localFilters.min_ats_score || 0, localFilters.max_ats_score || 100]}
            onChange={handleAtsScoreChange}
            marks={{
              0: '0',
              25: '25',
              50: '50',
              75: '75',
              100: '100',
            }}
          />
          <div className="text-sm text-foreground text-center mt-2">
            {localFilters.min_ats_score || 0} - {localFilters.max_ats_score || 100}
          </div>
          <Typography variant="p" className="text-xs text-muted-foreground mt-1">
            Applicant Tracking System compatibility score
          </Typography>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <ReusableButton
            btnText="Search"
            onClick={handleApplyFilters}
            variant="primary"
            className="w-full"
          />
          <ReusableButton
            btnText="Reset Filters"
            onClick={handleResetFilters}
            variant="default"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
