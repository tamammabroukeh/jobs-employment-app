"use client";

import { useState } from 'react';
import { ReusableDialog } from '@/components/Reusable-Components';
import { ReusableButton, Typography, Flex } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { completeMeetingAction } from '@/apis/services/meetings/actions';
import { toast } from 'sonner';

interface CompleteMeetingDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  meetingId: string;
  onSuccess?: () => void;
}

export default function CompleteMeetingDialog({
  isOpen,
  setIsOpen,
  meetingId,
  onSuccess,
}: CompleteMeetingDialogProps) {
  const t = useMeetingsTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await completeMeetingAction({ meetingId });

      if (result?.data?.success) {
        toast.success(t('messages.completeSuccess'));
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Complete meeting error:', error);
      toast.error(t('messages.completeError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t('completeDialog.title'),
        description: t('completeDialog.description'),
      }}
      dialogBody={
        <Typography variant="text" className="text-muted-foreground">
          This action will mark the meeting as completed and it will appear in your completed meetings list.
        </Typography>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t('completeDialog.cancel')}
            onClick={() => setIsOpen(false)}
            variant="default"
            disabled={isSubmitting}
          />
          <ReusableButton
            btnText={t('completeDialog.confirm')}
            onClick={handleSubmit}
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Flex>
      }
    />
  );
}
