"use client";

import { useState } from 'react';
import { Input } from 'antd';
import { ReusableButton, Typography, Flex, ReusableDialog } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { cancelMeetingAction } from '@/apis/services/meetings/actions';
import { toast } from 'sonner';

const { TextArea } = Input;

interface CancelMeetingDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  meetingId: string;
  onSuccess?: () => void;
}

export default function CancelMeetingDialog({
  isOpen,
  setIsOpen,
  meetingId,
  onSuccess,
}: CancelMeetingDialogProps) {
  const t = useMeetingsTranslations();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await cancelMeetingAction({
        meetingId,
        cancellation_reason: reason || undefined,
      });

      if (result?.data?.success) {
        toast.success(t('messages.cancelSuccess'));
        setIsOpen(false);
        setReason('');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Cancel meeting error:', error);
      toast.error(t('messages.cancelError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t('cancelDialog.title'),
        description: t('cancelDialog.description'),
      }}
      dialogBody={
        <div>
          <Typography variant="text" className="block mb-2 font-medium">
            {t('cancelDialog.reason')}
          </Typography>
          <TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('cancelDialog.reasonPlaceholder')}
            rows={4}
            maxLength={500}
            showCount
          />
        </div>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t('cancelDialog.cancel')}
            onClick={() => setIsOpen(false)}
            variant="default"
            disabled={isSubmitting}
          />
          <ReusableButton
            btnText={t('cancelDialog.confirm')}
            onClick={handleSubmit}
            variant="primary"
            danger
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Flex>
      }
    />
  );
}
