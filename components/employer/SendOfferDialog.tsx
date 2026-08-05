'use client';

import { useState, useEffect } from 'react';
import { Select, Input } from 'antd';
import { ReusableDialog, ReusableButton, Flex, Typography } from '@/components/Reusable-Components';
import { sendOfferAction } from '@/apis/services/employer/actions';
import { employerRepository } from '@/apis/services/employer';
import type { Job } from '@/apis/services/employer/interface';
import { toast } from 'sonner';

const { TextArea } = Input;

interface SendOfferDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  candidateUserId: string;
  candidateName: string;
  t: (key: string) => string;
}

export default function SendOfferDialog({
  isOpen,
  setIsOpen,
  candidateUserId,
  candidateName,
  t,
}: SendOfferDialogProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Fetch jobs when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await employerRepository.getJobs(1, 100);
      // Filter only active jobs
      const activeJobs = response.filter((job) => job.is_active);
      setJobs(activeJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error(t('sendOfferDialog.errorMessage'));
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleSend = async () => {
    if (!selectedJobId) {
      toast.error(t('sendOfferDialog.selectJobPlaceholder'));
      return;
    }

    if (!message.trim()) {
      toast.error(t('sendOfferDialog.messagePlaceholder'));
      return;
    }

    if (message.length > 1000) {
      toast.error(t('sendOfferDialog.messageHelper'));
      return;
    }

    setIsSending(true);
    try {
      const result = await sendOfferAction({
        job_seeker_id: candidateUserId,
        job_post_id: selectedJobId,
        message: message.trim(),
      });

      if (result?.data?.success) {
        toast.success(result.data.message || t('sendOfferDialog.successMessage'));
        handleClose();
      } else {
        toast.error(t('sendOfferDialog.errorMessage'));
      }
    } catch (error) {
      console.error('Error sending offer:', error);
      toast.error(t('sendOfferDialog.errorMessage'));
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedJobId('');
    setMessage('');
  };

  return (
    <ReusableDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      contentClassName="max-w-2xl"
      dialogHeader={{
        title: t('sendOfferDialog.title'),
        description: t('sendOfferDialog.description'),
      }}
      dialogBody={
        <div className="space-y-4">
          {/* Job Selection */}
          <div>
            <Typography variant="p" className="text-foreground font-medium mb-2 block">
              {t('sendOfferDialog.selectJob')} <span className="text-red-500">*</span>
            </Typography>
            {isLoadingJobs ? (
              <Typography variant="p" className="text-muted-foreground text-sm">
                {t('sendOfferDialog.loadingJobs')}
              </Typography>
            ) : jobs.length === 0 ? (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <Typography variant="p" className="text-warning text-sm">
                  {t('sendOfferDialog.noActiveJobs')}
                </Typography>
                <Typography variant="p" className="text-muted-foreground text-xs mt-1">
                  {t('sendOfferDialog.createJobFirst')}
                </Typography>
              </div>
            ) : (
              <Select
                placeholder={t('sendOfferDialog.selectJobPlaceholder')}
                value={selectedJobId || undefined}
                onChange={setSelectedJobId}
                className="w-full"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={jobs.map((job) => ({
                  value: job.id,
                  label: `${job.title} - ${job.city} (${job.job_type})`,
                }))}
              />
            )}
          </div>

          {/* Message Input */}
          <div>
            <Typography variant="p" className="text-foreground font-medium mb-2 block">
              {t('sendOfferDialog.messageLabel')} <span className="text-red-500">*</span>
            </Typography>
            <TextArea
              placeholder={t('sendOfferDialog.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              maxLength={1000}
              showCount
              disabled={isSending}
            />
            <Typography variant="p" className="text-muted-foreground text-xs mt-1 block">
              {t('sendOfferDialog.messageHelper')}
            </Typography>
          </div>
        </div>
      }
      dialogFooter={
        <Flex classes="gap-2 justify-end">
          <ReusableButton
            btnText={t('sendOfferDialog.cancel')}
            onClick={handleClose}
            variant="default"
            disabled={isSending}
          />
          <ReusableButton
            btnText={t('sendOfferDialog.send')}
            onClick={handleSend}
            variant="primary"
            isLoading={isSending}
            disabled={isSending || jobs.length === 0}
          />
        </Flex>
      }
    />
  );
}
