"use client";

import { useState } from 'react';
import { Input, Alert } from 'antd';
import { ReusableButton, Typography, Flex, ReusableDialog } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { acceptMeetingAction } from '@/apis/services/meetings/actions';
import { IMeeting } from '@/apis/services/meetings/interface';
import { toast } from 'sonner';

interface AcceptMeetingDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  meeting: IMeeting;
  onSuccess?: () => void;
}

export default function AcceptMeetingDialog({
  isOpen,
  setIsOpen,
  meeting,
  onSuccess,
}: AcceptMeetingDialogProps) {
  const t = useMeetingsTranslations();
  const [meetLink, setMeetLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVideoCall = meeting.meeting_type === 'video_call';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await acceptMeetingAction({
        meetingId: meeting.id,
        meet_link: meetLink || undefined,
      });
      
      if (result?.data?.success && result.data.data) {
        toast.success(t('messages.acceptSuccess'));
        
        // Show warning if Google Meet link couldn't be generated
        const warning = result.data.data.google_meet_warning;
        if (warning) {
          toast.warning(warning, {
            duration: 5000,
          });
        }
        
        setIsOpen(false);
        setMeetLink('');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Accept meeting error:', error);
      toast.error(t('messages.acceptError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogHeader={{
        title: t('acceptDialog.title'),
        description: t('acceptDialog.description'),
      }}
      dialogBody={
        <div className="space-y-4">
          {isVideoCall && (
            <Alert
              type="info"
              message={t('acceptDialog.videoCallNote')}
              description={t('acceptDialog.googleMeetNote')}
              showIcon
            />
          )}

          {isVideoCall && (
            <div>
              <Typography variant="text" className="block mb-2 font-medium">
                {t('acceptDialog.provideLink')}
              </Typography>
              <Input
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                placeholder={t('acceptDialog.linkPlaceholder')}
              />
            </div>
          )}
        </div>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t('acceptDialog.cancel')}
            onClick={() => setIsOpen(false)}
            variant="default"
            disabled={isSubmitting}
          />
          <ReusableButton
            btnText={t('acceptDialog.confirm')}
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
