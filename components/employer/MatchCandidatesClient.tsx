"use client";

import { useState } from 'react';
import { Input } from 'antd';
import { Typography, ReusableButton, ReusableBadge } from '@/components/Reusable-Components';
import { matchCandidatesAction } from '@/apis/services/employer/actions';
import type { Candidate, MatchedCandidate } from '@/apis/services/employer/interface';
import { useCandidatesTranslations } from '@/hooks/use-translations';
import { toast } from 'sonner';
import CandidateCard from './CandidateCard';

const { TextArea } = Input;
const MAX_DESCRIPTION_LENGTH = 5000;

/**
 * Adapt a matched candidate (AI matching response) into the `Candidate` shape
 * that `CandidateCard` expects. Fields absent in the match response are
 * defaulted so the shared card can render safely.
 */
function toCandidate(match: MatchedCandidate): Candidate {
  return {
    id: match.id,
    user_id: match.user_id,
    first_name: '',
    last_name: '',
    full_name: match.name,
    email: match.email,
    phone: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    nationality: '',
    city: match.city ?? '',
    address: '',
    location: '',
    image: match.image,
    current_job_title: match.current_job_title ?? '',
    current_job_status: match.current_job_status ?? '',
    is_actively_seeking: match.is_actively_seeking,
    job_level: match.job_level ?? '',
    years_of_experience: match.years_of_experience,
    education_level: match.education_level ?? '',
    job_roles: match.job_roles ?? [],
    job_types: match.job_types ?? [],
    work_cities: match.work_cities ?? [],
    salary_range_from: match.salary_range_from,
    salary_range_to: match.salary_range_to,
    expected_salary: match.expected_salary,
    experience_summary: match.experience_summary ?? '',
    skills: match.skills ?? [],
    education_history: match.education_history ?? [],
    work_experience: match.work_experience ?? [],
    social_links: match.social_links ?? {},
    created_at: '',
    updated_at: '',
  };
}

export default function MatchCandidatesClient() {
  const t = useCandidatesTranslations();

  const [jobDescription, setJobDescription] = useState('');
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);

  const handleMatch = async () => {
    const description = jobDescription.trim();
    if (description.length < 10) {
      toast.error(t('matchPage.validation.tooShort'));
      return;
    }

    setLoading(true);
    try {
      const result = await matchCandidatesAction({
        job_description: description,
        limit,
      });

      if (result?.data?.success) {
        setCandidates(result.data.data.candidates ?? []);
        setRequirements(result.data.data.extracted_requirements ?? []);
        setHasSearched(true);
      } else {
        toast.error(t('matchPage.errorMessage'));
      }
    } catch (error) {
      console.error('Error matching candidates:', error);
      toast.error(t('matchPage.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Typography variant="h1" className="text-foreground mb-2">
            {t('matchPage.title')}
          </Typography>
          <Typography variant="p" className="text-muted-foreground">
            {t('matchPage.description')}
          </Typography>
        </div>

        {/* Search Form */}
        <div className="auth-card p-6 mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('matchPage.jobDescriptionLabel')}
          </label>
          <TextArea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={t('matchPage.jobDescriptionPlaceholder')}
            rows={6}
            maxLength={MAX_DESCRIPTION_LENGTH}
            showCount
            disabled={loading}
          />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('matchPage.limitLabel')}
              </label>
              <Input
                type="number"
                min={1}
                max={50}
                value={limit}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;
                  setLimit(Math.min(50, Math.max(1, value)));
                }}
                disabled={loading}
              />
            </div>

            <ReusableButton
              btnText={t('matchPage.matchButton')}
              variant="primary"
              onClick={handleMatch}
              isLoading={loading}
              icon={<i className="fa-solid fa-wand-magic-sparkles" />}
            />
          </div>
        </div>

        {/* Extracted Requirements */}
        {hasSearched && requirements.length > 0 && (
          <div className="mb-8">
            <Typography variant="h3" className="text-foreground mb-3">
              {t('matchPage.extractedRequirements')}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req, index) => (
                <ReusableBadge key={index} variant="warning">
                  {req}
                </ReusableBadge>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hasSearched && candidates.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-users text-6xl text-muted-foreground mb-4" />
            <Typography variant="h3" className="text-foreground mb-2">
              {t('matchPage.noResults')}
            </Typography>
            <Typography variant="p" className="text-muted-foreground">
              {t('matchPage.noResultsDescription')}
            </Typography>
          </div>
        ) : candidates.length > 0 ? (
          <>
            {/* Results count */}
            <div className="mb-6">
              <Typography variant="p" className="text-muted-foreground">
                {t('matchPage.resultsCount', { count: candidates.length })}
              </Typography>
            </div>

            {/* Candidates List */}
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={toCandidate(candidate)}
                  matchedSkills={candidate.matched_skills}
                  matchScore={candidate.matched_skills_score}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
