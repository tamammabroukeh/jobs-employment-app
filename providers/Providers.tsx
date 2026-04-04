'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { IntlProvider } from 'use-intl';
import { Toaster } from 'sonner';
import { DeepPartial } from 'react-hook-form';
import ThemeProvider from './ThemeProvider';

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: DeepPartial<Record<string, string>> | null | undefined;
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <AntdRegistry>
          {children}
          <Toaster position="top-right" richColors />
        </AntdRegistry>
      </ThemeProvider>
    </IntlProvider>
  );
}
