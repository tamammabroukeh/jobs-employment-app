'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReusableInput from '@/components/Reusable-Components/Reusable-Input';
import ReusableButton from '@/components/Reusable-Components/Reusable-Button';
import ROUTES from '@/constants/routes';
import { useDebounce } from '@/hooks/use-debounce';
import { useHomeTranslations } from '@/hooks/use-translations';

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const router = useRouter();
  const t = useHomeTranslations();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`${ROUTES.JOB.LIST}?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(ROUTES.JOB.LIST);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePopularSearch = (keyword: string) => {
    setSearchQuery(keyword);
    router.push(`${ROUTES.JOB.LIST}?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 bg-card p-2 rounded-lg shadow-lg border border-border">
        <ReusableInput
          size="large"
          placeholder={t('hero.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          prefix={<i className="fa-solid fa-magnifying-glass text-muted-foreground" />}
          className="flex-1"
        />
        <ReusableButton
          variant="primary"
          size="large"
          onClick={handleSearch}
          className="px-8 whitespace-nowrap"
        >
          <i className="fa-solid fa-search mr-2" />
          {t('hero.searchButton')}
        </ReusableButton>
      </div>
      
      {/* Popular Searches */}
      <div className="mt-4 text-center">
        <span className="text-sm text-muted-foreground mr-2">
          {t('hero.popularSearches')}:
        </span>
        <div className="inline-flex flex-wrap gap-2 mt-2 justify-center">
          {['Developer', 'Designer', 'Marketing', 'Sales'].map((keyword) => (
            <button
              key={keyword}
              onClick={() => handlePopularSearch(keyword)}
              className="px-3 py-1 text-xs rounded-full bg-background hover:bg-primary hover:text-white transition-colors border border-border"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
