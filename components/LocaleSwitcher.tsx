'use client';

import { useLocale } from 'use-intl';
import { useTransition } from 'react';
import ReusableSelect from './Reusable-Components/Reusable-Select';

const locales = [
  { value: 'en', title: 'English (EN)' },
  { value: 'ar', title: 'العربية (AR)' },
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string | string[]) => {
    const localeValue = Array.isArray(newLocale) ? newLocale[0] : newLocale;
    startTransition(() => {
      document.cookie = `locale=${localeValue}; path=/; max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <ReusableSelect
      defaultValue={locale}
      selectValues={locales}
      onValueChange={handleChange}
      triggerStyle="w-[150px]"
    />
  );
}
