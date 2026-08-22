"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, DatePicker, Alert } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ReusableDialog } from '@/components/Reusable-Components';
import { ReusableButton, Typography, Flex } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { rescheduleMeetingAction } from '@/apis/services/meetings/actions';
import { IMeeting, IConflict } from '@/apis/services/meetings/interface';
import { DURATION_OPTIONS } from '@/utils/meetingHelpers';
import { toast } from 'sonner';
import dayjs from 'dayjs';

interface RescheduleMeetingDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  meeting: IMeeting;
  onSuccess?: () => void;
}

export default function RescheduleMeetingDialog({
  isOpen,
  setIsOpen,
  meeting,
  onSuccess,
}: RescheduleMeetingDialogProps) {
  const t = useMeetingsTranslations();
  const [conflicts, setConflicts] = useState<{ organizer: IConflict[]; invitee: IConflict[] }>({
    organizer: [],
    invitee: [],
  });

  const schema = z.object({
    proposed_date: z.string().min(1, t('validation.dateRequired')),
    proposed_start_time: z.string().min(1, t('validation.timeRequired')),
    proposed_duration_minutes: z.number()
      .min(15, t('validation.durationMin'))
      .max(480, t('validation.durationMax')),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      proposed_date: meeting.proposed_date,
      proposed_start_time: meeting.proposed_start_time,
      proposed_duration_minutes: meeting.proposed_duration_minutes,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await rescheduleMeetingAction({
        meetingId: meeting.id,
        ...data,
      });

      if (result?.data?.success) {
        const response = result.data.data;
        
        // Show conflicts if any
        if (response.organizer_conflicts.length > 0 || response.invitee_conflicts.length > 0) {
          setConflicts({
            organizer: response.organizer_conflicts,
            invitee: response.invitee_conflicts,
          });
        }

        toast.success(t('messages.rescheduleSuccess'));
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Reschedule meeting error:', error);
      toast.error(t('messages.rescheduleError'));
    }
  };

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      contentClassName="w-full max-w-2xl"
      dialogHeader={{
        title: t('rescheduleDialog.title'),
        description: t('rescheduleDialog.description'),
      }}
      dialogBody={
        <form id="reschedule-meeting-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                </div>
              }
              closable
              onClose={() => setConflicts({ organizer: [], invitee: [] })}
            />
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="text" className="block mb-2 font-medium">
                {t('rescheduleDialog.date')} *
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
                {t('rescheduleDialog.startTime')} *
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
              {t('rescheduleDialog.duration')} *
            </Typography>
            <Controller
              name="proposed_duration_minutes"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={DURATION_OPTIONS.map(opt => ({
                    value: opt.value,
                    label: t('rescheduleDialog.durationMinutes', { minutes: opt.value }),
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
        </form>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t('rescheduleDialog.cancel')}
            onClick={() => setIsOpen(false)}
            variant="default"
            disabled={isSubmitting}
          />
          <ReusableButton
            type="submit"
            form="reschedule-meeting-form"
            btnText={t('rescheduleDialog.confirm')}
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Flex>
      }
    />
  );
}
