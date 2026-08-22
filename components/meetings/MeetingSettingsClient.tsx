"use client";

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import GoogleIntegrationCard from './GoogleIntegrationCard';
import { useRouter } from 'next/navigation';

export default function MeetingSettingsClient() {
  const t = useMeetingsTranslations();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <Flex classes="items-center gap-4 mb-6">
        <ReusableButton
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/meetings')}
          variant="default"
        />
        <Typography variant="h1" className="text-3xl font-bold">
          Meeting Settings
        </Typography>
      </Flex>

      {/* Google Integration */}
      <div className="space-y-6">
        <GoogleIntegrationCard />
      </div>
    </div>
  );
}
