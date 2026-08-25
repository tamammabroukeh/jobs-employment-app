"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Tag, DatePicker, Select, Empty } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Typography, ReusableButton, Flex } from '@/components/Reusable-Components';
import ReusableTabs from '@/components/Reusable-Components/Reusable-Tabs';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { meetingsRepository } from '@/apis/services/meetings';
import { IMeeting } from '@/apis/services/meetings/interface';
import { formatMeetingDateTime, getStatusColor, getMeetingTypeIcon } from '@/utils/meetingHelpers';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function MeetingsClient() {
  const t = useMeetingsTranslations();
  const router = useRouter();
  
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filters
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const statusFilter = activeTab === 'all' ? undefined : activeTab;
      const params = {
        page: currentPage,
        per_page: 15,
        status: selectedStatuses.length > 0 ? selectedStatuses.join(',') : statusFilter,
        from_date: dateRange?.[0] ? dateRange[0].format('YYYY-MM-DD') : undefined,
        to_date: dateRange?.[1] ? dateRange[1].format('YYYY-MM-DD') : undefined,
        sort_direction: 'asc' as const,
      };

      const response = await meetingsRepository.getMeetings(params);
      console.log('response', response)
      setMeetings(response.data);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      toast.error(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [currentPage, activeTab, selectedStatuses, dateRange]);

  const handleMeetingClick = (meetingId: string) => {
    router.push(`/meetings/${meetingId}`);
  };

  const handleCreateMeeting = () => {
    router.push('/meetings/create');
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setDateRange(null);
    setCurrentPage(1);
  };

  const tabs = [
    { key: 'all', label: t('tabs.all') },
    { key: 'pending', label: t('tabs.pending') },
    { key: 'accepted', label: t('tabs.accepted') },
    { key: 'completed', label: t('tabs.completed') },
  ];

  const tabTriggers = tabs.map(tab => ({
    value: tab.key,
    title: tab.label,
  }));

  const statusOptions = [
    { value: 'pending', label: t('status.pending') },
    { value: 'accepted', label: t('status.accepted') },
    { value: 'rescheduled', label: t('status.rescheduled') },
    { value: 'declined', label: t('status.declined') },
    { value: 'cancelled', label: t('status.cancelled') },
    { value: 'completed', label: t('status.completed') },
  ];

  return (
    <div className="container py-8">
      {/* Header */}
      <Flex classes="w-full justify-between! items-center! mb-6">
        <Typography variant="h1" className="text-3xl font-bold">
          {t('myMeetings')}
        </Typography>
        <Flex classes="gap-3">
          <ReusableButton
            icon={<SettingOutlined />}
            onClick={() => router.push('/meetings/settings')}
            variant="default"
          />
          <ReusableButton
            btnText={t('scheduleMeeting')}
            icon={<PlusOutlined />}
            onClick={handleCreateMeeting}
            variant="primary"
          />
        </Flex>
      </Flex>

      {/* Filters */}
      <div className="bg-card border border-card-border rounded-lg p-4 mb-6">
        <Flex classes="gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Typography variant="text" className="text-sm font-medium mb-2 block">
              {t('filters.status')}
            </Typography>
            <Select
              mode="multiple"
              placeholder={t('filters.status')}
              value={selectedStatuses}
              onChange={setSelectedStatuses}
              options={statusOptions}
              style={{ width: '100%' }}
              allowClear
            />
          </div>
          
          <div className="flex-1 min-w-[300px]">
            <Typography variant="text" className="text-sm font-medium mb-2 block">
              {t('filters.dateRange')}
            </Typography>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              placeholder={[t('filters.from'), t('filters.to')]}
            />
          </div>
          
          {(selectedStatuses.length > 0 || dateRange) && (
            <div className="flex items-end">
              <ReusableButton
                btnText={t('filters.clearFilters')}
                onClick={clearFilters}
                variant="default"
              />
            </div>
          )}
        </Flex>
      </div>

      {/* Tabs */}
      <ReusableTabs
        tabTriggerValues={tabTriggers}
        value={activeTab}
        onValueChange={setActiveTab}
      />

      {/* Meetings List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-card border border-card-border rounded-lg p-12">
          <Empty
            description={
              <div className="items-center flex flex-col gap-3">
                <div>
                <Typography variant="h3" className="text-xl font-semibold mb-2">
                  {t('empty.title')}
                </Typography>
                <Typography variant="text" className="text-muted-foreground mb-4">
                  {t('empty.description')}
                </Typography>
              </div>
                <ReusableButton
                  btnText={t('empty.action')}
                  onClick={handleCreateMeeting}
                  variant="primary"
                  className='w-fit'
                />
              </div>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => handleMeetingClick(meeting.id)}
                className="bg-card border border-card-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <Flex classes="justify-between items-start">
                  <div className="flex-1">
                    <Flex classes="items-center gap-3 mb-2">
                      <span className="text-2xl">{getMeetingTypeIcon(meeting.meeting_type)}</span>
                      <Typography variant="h3" className="text-xl font-semibold">
                        {meeting.title}
                      </Typography>
                      <Tag color={getStatusColor(meeting.status)}>
                        {t(`status.${meeting.status}`)}
                      </Tag>
                    </Flex>
                    
                    <div className="space-y-2 ml-11">
                      <Flex classes="items-center gap-2 text-muted-foreground">
                        <CalendarOutlined />
                        <Typography variant="text" className="text-sm">
                          {formatMeetingDateTime(meeting.proposed_date, meeting.proposed_start_time)}
                        </Typography>
                      </Flex>
                      
                      <Flex classes="items-center gap-2 text-muted-foreground">
                        <ClockCircleOutlined />
                        <Typography variant="text" className="text-sm">
                          {meeting.proposed_duration_minutes} {t('detail.minutes', { minutes: meeting.proposed_duration_minutes })}
                        </Typography>
                      </Flex>
                      
                      {meeting.other_participant && (
                        <Typography variant="text" className="text-sm text-muted-foreground">
                          {t('detail.with')} <span className="font-medium text-foreground">{meeting.other_participant.name}</span>
                          {meeting.other_participant.company_name && (
                            <span> · {meeting.other_participant.company_name}</span>
                          )}
                        </Typography>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {t(`meetingType.${meeting.meeting_type}`)}
                  </div>
                </Flex>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex classes="justify-center gap-2">
              <ReusableButton
                btnText="Previous"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="default"
              />
              <Typography variant="text" className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </Typography>
              <ReusableButton
                btnText="Next"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="default"
              />
            </Flex>
          )}
        </>
      )}
    </div>
  );
}
