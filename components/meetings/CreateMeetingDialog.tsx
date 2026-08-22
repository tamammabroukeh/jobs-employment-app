"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, DatePicker, Radio, Alert } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ReusableDialog } from '@/components/Reusable-Components';
import { ReusableButton, Typography, Flex } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { createMeetingAction } from '@/apis/services/meetings/actions';
import { DURATION_OPTIONS } from '@/utils/meetingHelpers';
import { IConflict } from '@/apis/services/meetings/interface';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface CreateMeetingDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
  participants: Array<{ id: string; name: string; email: string; company_name?: string }>;
}

export default function CreateMeetingDialog({
  isOpen,
  setIsOpen,
  onSuccess,
  participants,
}: CreateMeetingDialogProps) {
  const t = useMeetingsTranslations();
  const [conflicts, setConflicts] = useState<{ organizer: IConflict[]; invitee: IConflict[] }>({
    organizer: [],
    invitee: [],
  });

  const schema = z.object({
    invitee_id: z.string().min(1, t('validation.inviteeRequired')),
    title: z.string()
      .min(1, t('validation.titleRequired'))
      .max(255, t('validation.titleMaxLength')),
    meeting_type: z.enum(['in_person', 'phone_call', 'video_call']),
    proposed_date: z.string().min(1, t('validation.dateRequired')),
    proposed_start_time: z.string().min(1, t('validation.timeRequired')),
    proposed_duration_minutes: z.number()
      .min(15, t('validation.durationMin'))
      .max(480, t('validation.durationMax')),
    location_or_link: z.string().max(500, t('validation.locationMaxLength')).optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      invitee_id: '',
      title: '',
      meeting_type: 'video_call',
      proposed_date: '',
      proposed_start_time: '',
      proposed_duration_minutes: 60,
      location_or_link: '',
    },
  });

  const meetingType = watch('meeting_type');

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createMeetingAction(data);

      if (result?.data?.success) {
        const response = result.data.data;
        
        // Show conflicts if any
        if (response.organizer_conflicts.length > 0 || response.invitee_conflicts.length > 0) {
          setConflicts({
            organizer: response.organizer_conflicts,
            invitee: response.invitee_conflicts,
          });
        }

        toast.success(t('messages.createSuccess'));
        reset();
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Create meeting error:', error);
      toast.error(t('messages.createError'));
    }
  };

  const handleClose = () => {
    reset();
    setConflicts({ organizer: [], invitee: [] });
    setIsOpen(false);
  };

  const participantOptions = participants.map(p => ({
    value: p.id,
    label: `${p.name} ${p.company_name ? `(${p.company_name})` : ''} - ${p.email}`,
  }));

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      contentClassName="w-full max-w-2xl"
      dialogHeader={{
        title: t('createMeeting.title'),
        description: t('createMeeting.description'),
      }}
      dialogBody={
        <form id="create-meeting-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Conflicts Warning */}
          {(conflicts.organizer.length > 0 || conflicts.invitee.length > 0) && (
            <Alert
              type="warning"
              message={t('conflicts.title')}
              description={
                <div className="space-y-2 mt-2">
                  {conflicts.organizer.length > 0 && (
                    <div>
                      <Typography variant="text" className="font-medium">
                        {t('conflicts.organizerConflicts')}
                      </Typography>
                      <ul className="list-disc list-inside">
                        {conflicts.organizer.map((conflict, idx) => (
                          <li key={idx} className="text-sm">
                            {t('conflicts.conflictTime', {
                              date: conflict.proposed_date,
                              time: conflict.proposed_start_time,
                              duration: conflict.proposed_duration_minutes,
                            })}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {conflicts.invitee.length > 0 && (
                    <div>
                      <Typography variant="text" className="font-medium">
                        {t('conflicts.inviteeConflicts')}
                      </Typography>
                      <ul className="list-disc list-inside">
                        {conflicts.invitee.map((conflict, idx) => (
                          <li key={idx} className="text-sm">
                            {t('conflicts.conflictTime', {
                              date: conflict.proposed_date,
                              time: conflict.proposed_start_time,
                              duration: conflict.proposed_duration_minutes,
                            })}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Typography variant="text" className="text-sm">
                    {t('conflicts.proceedAnyway')}
                  </Typography>
                </div>
              }
              closable
              onClose={() => setConflicts({ organizer: [], invitee: [] })}
            />
          )}

          {/* Participant */}
          <div>
            <Typography variant="text" className="block mb-2 font-medium">
              {t('createMeeting.selectParticipant')} *
            </Typography>
            <Controller
              name="invitee_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={t('createMeeting.searchParticipant')}
                  options={participantOptions}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: '100%' }}
                  status={errors.invitee_id ? 'error' : ''}
                />
              )}
            />
            {errors.invitee_id && (
              <Typography variant="text" className="text-destructive text-sm mt-1">
                {errors.invitee_id.message}
              </Typography>
            )}
          </div>

          {/* Title */}
          <div>
            <Typography variant="text" className="block mb-2 font-medium">
              {t('createMeeting.meetingTitle')} *
            </Typography>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t('createMeeting.meetingTitlePlaceholder')}
                  status={errors.title ? 'error' : ''}
                />
              )}
            />
            {errors.title && (
              <Typography variant="text" className="text-destructive text-sm mt-1">
                {errors.title.message}
              </Typography>
            )}
          </div>

          {/* Meeting Type */}
          <div>
            <Typography variant="text" className="block mb-2 font-medium">
              {t('createMeeting.meetingType')} *
            </Typography>
            <Controller
              name="meeting_type"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field} className="w-full">
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        field.value === 'video_call'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => field.onChange('video_call')}
                    >
                      <Radio value="video_call" className="mb-2" />
                      <VideoCameraOutlined className="text-2xl block mb-2" />
                      <Typography variant="text" className="font-medium block">
                        {t('meetingType.video_call')}
                      </Typography>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        field.value === 'phone_call'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => field.onChange('phone_call')}
                    >
                      <Radio value="phone_call" className="mb-2" />
                      <PhoneOutlined className="text-2xl block mb-2" />
                      <Typography variant="text" className="font-medium block">
                        {t('meetingType.phone_call')}
                      </Typography>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        field.value === 'in_person'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => field.onChange('in_person')}
                    >
                      <Radio value="in_person" className="mb-2" />
                      <EnvironmentOutlined className="text-2xl block mb-2" />
                      <Typography variant="text" className="font-medium block">
                        {t('meetingType.in_person')}
                      </Typography>
                    </div>
                  </div>
                </Radio.Group>
              )}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="text" className="block mb-2 font-medium">
                {t('createMeeting.date')} *
              </Typography>
              <Controller
                name="proposed_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    style={{ width: '100%' }}
                    status={errors.proposed_date ? 'error' : ''}
                    suffixIcon={<CalendarOutlined />}
                  />
                )}
              />
              {errors.proposed_date && (
                <Typography variant="text" className="text-destructive text-sm mt-1">
                  {errors.proposed_date.message}
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="text" className="block mb-2 font-medium">
                {t('createMeeting.startTime')} *
              </Typography>
              <Controller
                name="proposed_start_time"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="time"
                    status={errors.proposed_start_time ? 'error' : ''}
                    suffix={<ClockCircleOutlined />}
                  />
                )}
              />
              {errors.proposed_start_time && (
                <Typography variant="text" className="text-destructive text-sm mt-1">
                  {errors.proposed_start_time.message}
                </Typography>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Typography variant="text" className="block mb-2 font-medium">
              {t('createMeeting.duration')} *
            </Typography>
            <Controller
              name="proposed_duration_minutes"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={DURATION_OPTIONS.map(opt => ({
                    value: opt.value,
                    label: t('createMeeting.durationMinutes', { minutes: opt.value }),
                  }))}
                  style={{ width: '100%' }}
                  status={errors.proposed_duration_minutes ? 'error' : ''}
                />
              )}
            />
            {errors.proposed_duration_minutes && (
              <Typography variant="text" className="text-destructive text-sm mt-1">
                {errors.proposed_duration_minutes.message}
              </Typography>
            )}
          </div>

          {/* Location/Link based on meeting type */}
          {meetingType === 'in_person' && (
            <div>
              <Typography variant="text" className="block mb-2 font-medium">
                {t('createMeeting.location')} *
              </Typography>
              <Controller
                name="location_or_link"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder={t('createMeeting.locationPlaceholder')}
                    rows={3}
                    status={errors.location_or_link ? 'error' : ''}
                  />
                )}
              />
              {errors.location_or_link && (
                <Typography variant="text" className="text-destructive text-sm mt-1">
                  {errors.location_or_link.message}
                </Typography>
              )}
            </div>
          )}

          {meetingType === 'phone_call' && (
            <div>
              <Typography variant="text" className="block mb-2 font-medium">
                {t('createMeeting.phoneNumber')} *
              </Typography>
              <Controller
                name="location_or_link"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t('createMeeting.phoneNumberPlaceholder')}
                    status={errors.location_or_link ? 'error' : ''}
                  />
                )}
              />
              {errors.location_or_link && (
                <Typography variant="text" className="text-destructive text-sm mt-1">
                  {errors.location_or_link.message}
                </Typography>
              )}
            </div>
          )}

          {meetingType === 'video_call' && (
            <Alert
              type="info"
              message={t('createMeeting.googleMeetInfo')}
              showIcon
            />
          )}
        </form>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t('createMeeting.cancel')}
            onClick={handleClose}
            variant="default"
            disabled={isSubmitting}
          />
          <ReusableButton
            type="submit"
            form="create-meeting-form"
            btnText={isSubmitting ? t('createMeeting.creating') : t('createMeeting.create')}
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Flex>
      }
    />
  );
}
