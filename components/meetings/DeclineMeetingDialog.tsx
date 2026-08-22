"use client";

import { useState } from 'react';
import { Input } from 'antd';
import { ReusableDialog } from '@/components/Reusable-Components';
import { ReusableButton, Typography, Flex } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { declineMeetingAction } from '@/apis/services/meetings/actions';
import { toast } from 'sonner';

const { TextArea } = Input;

interface DeclineMeetingDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  meetingId: string;
  onSuccess?: () => void;
}

export default function DeclineMeetingDialog({
  isOpen,
  setIsOpen,
  meetingId,
  onSuccess,
}: DeclineMeetingDialogProps) {
  const t = useMeetingsTranslations();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await declineMeetingAction({
        meetingId,
        decline_reason: reason || undefined,
      });

      if (result?.data?.success) {
        toast.success(t('messages.declineSuccess'));
        setIsOpen(false);
        setReason('');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Decline meeting error:', error);
      toast.error(t('messages.declineError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t('declineDialog.title'),
        description: t('declineDialog.description'),
      }}
      dialogBody={
        <div>
          <Typography variant="text" className="block mb-2 font-medium">
            {t('declineDialog.reason')}
          </Typography>
          <TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('declineDialog.reasonPlaceholder')}
            rows={4}
            maxLength={500}
            showCount
          />
        </div>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t('declineDialog.cancel')}
            onClick={() => setIsOpen(false)}
            variant="default"
            disabled={isSubmitting}
          />
          <ReusableButton
            btnText={t('declineDialog.confirm')}
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
