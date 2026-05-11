'use client';

import { ReusableInput } from '@/components/Reusable-Components';
import { useCompaniesTranslations } from '@/hooks/use-translations';

interface CompanySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CompanySearch({ value, onChange }: CompanySearchProps) {
  const t = useCompaniesTranslations();

  return (
    <div className="mb-8">
      <ReusableInput
        placeholder={t('search.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        prefix={<i className="fa-solid fa-search text-muted-foreground" />}
        size="large"
        allowClear
      />
    </div>
  );
}
