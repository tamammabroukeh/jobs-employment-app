"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Empty } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Typography, Flex } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { meetingsRepository } from '@/apis/services/meetings';
import { IUpcomingMeetingSummary } from '@/apis/services/meetings/interface';
import { formatMeetingDateTime, getMeetingTypeIcon } from '@/utils/meetingHelpers';
import { toast } from 'sonner';

export default function UpcomingMeetingsWidget() {
  const t = useMeetingsTranslations();
  const router = useRouter();
  const [meetings, setMeetings] = useState<IUpcomingMeetingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        const data = await meetingsRepository.getUpcomingMeetings();
        setMeetings(data);
      } catch (error) {
        console.error('Failed to fetch upcoming meetings:', error);
        toast.error(t('messages.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMeetings();

    // Refresh every 60 seconds
    const interval = setInterval(fetchUpcomingMeetings, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-6">
        <Empty
          description={
            <Typography variant="text" className="text-muted-foreground">
              {t('noUpcomingMeetings')}
            </Typography>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting, index) => (
        <div
          key={index}
          onClick={() => router.push('/meetings')}
          className="bg-card border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <Flex classes="items-start gap-3">
            <span className="text-2xl">{getMeetingTypeIcon(meeting.meeting_type)}</span>
            <div className="flex-1 min-w-0">
              <Typography variant="text" className="font-medium block truncate mb-1">
                {meeting.title}
              </Typography>
              
              <Flex classes="items-center gap-2 text-muted-foreground text-sm mb-1">
                <CalendarOutlined className="flex-shrink-0" />
                <Typography variant="text" className="text-sm">
                  {formatMeetingDateTime(meeting.proposed_date, meeting.proposed_start_time)}
                </Typography>
              </Flex>
              
              <Flex classes="items-center gap-2 text-muted-foreground text-sm mb-2">
                <ClockCircleOutlined className="flex-shrink-0" />
                <Typography variant="text" className="text-sm">
                  {meeting.proposed_duration_minutes} minutes
                </Typography>
              </Flex>
              
              <Typography variant="text" className="text-sm text-muted-foreground truncate">
                with <span className="font-medium text-foreground">{meeting.other_participant.name}</span>
                {meeting.other_participant.company_name && (
                  <span> · {meeting.other_participant.company_name}</span>
                )}
              </Typography>
            </div>
          </Flex>
        </div>
      ))}
    </div>
  );
}
