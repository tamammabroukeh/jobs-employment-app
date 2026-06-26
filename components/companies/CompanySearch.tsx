'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { ReusableInput, ReusableButton } from '@/components/Reusable-Components';
import { useCompaniesTranslations } from '@/hooks/use-translations';
import { updateSearchParams } from '@/lib/searchParams';

interface CompanySearchProps {
  value?: string;
}

export default function CompanySearch({ value: initialValue = '' }: CompanySearchProps) {
  const t = useCompaniesTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Update URL when debounced search changes
  useEffect(() => {
    const paramsString = updateSearchParams(searchParams, {
      search: debouncedSearch || null,
      page: debouncedSearch ? '1' : undefined,
    });
    
    router.push(`${pathname}?${paramsString}`);
  }, [debouncedSearch, pathname, router, searchParams]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <ReusableInput
          type="text"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12 h-14 text-lg"
        />
        {searchQuery && (
          <ReusableButton
            onClick={() => setSearchQuery('')}
            variant="text"
            iconOnly
            icon={<i className="fa-solid fa-xmark" />}
            className="absolute! right-2 top-1/2 -translate-y-1/2 text-muted-foreground! hover:text-foreground! min-w-0! w-10! h-10!"
            aria-label="Clear search"
          />
        )}
      </div>
    </div>
  );
}
