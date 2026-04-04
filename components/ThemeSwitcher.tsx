'use client';

import { useTheme } from '@/themes';
import { Switch } from 'antd';
import { useMounted } from '@/hooks/useMounted';

export default function ThemeSwitcher() {
  const { themeMode, toggleTheme } = useTheme();
  const mounted = useMounted();

  // Return a placeholder with the same dimensions during SSR
  if (!mounted) {
    return (
      <div className="w-[44px] h-[22px]" />
    );
  }

  return (
    <Switch
      checked={themeMode === 'dark'}
      onChange={toggleTheme}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      className="bg-muted"
    />
  );
}
