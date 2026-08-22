"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Divider, Input, Alert } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Typography, ReusableButton, Flex } from '@/components/Reusable-Components';
import { useMeetingsTranslations } from '@/hooks/use-translations';
import { IMeeting } from '@/apis/services/meetings/interface';
import {
  formatMeetingDate,
  formatMeetingTime,
  getStatusColor,
  getMeetingTypeIcon,
  canAcceptMeeting,
  canDeclineMeeting,
  canCancelMeeting,
  canRescheduleMeeting,
  canCompleteMeeting,
  isOrganizer,
} from '@/utils/meetingHelpers';
import {
  acceptMeetingAction,
  declineMeetingAction,
  cancelMeetingAction,
  rescheduleMeetingAction,
  completeMeetingAction,
  addNoteMeetingAction,
} from '@/apis/services/meetings/actions';
import AcceptMeetingDialog from './AcceptMeetingDialog';
import DeclineMeetingDialog from './DeclineMeetingDialog';
import CancelMeetingDialog from './CancelMeetingDialog';
import RescheduleMeetingDialog from './RescheduleMeetingDialog';
import CompleteMeetingDialog from './CompleteMeetingDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

const { TextArea } = Input;

interface MeetingDetailClientProps {
  meeting: IMeeting;
  userId: string;
}

export default function MeetingDetailClient({ meeting: initialMeeting, userId }: MeetingDetailClientProps) {
  const t = useMeetingsTranslations();
  const router = useRouter();
  
  const [meeting, setMeeting] = useState(initialMeeting);
  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // Dialog states
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const isUserOrganizer = isOrganizer(meeting, userId);

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    setIsAddingNote(true);
    try {
      const result = await addNoteMeetingAction({
        meetingId: meeting.id,
        content: noteContent.trim(),
      });

      if (result?.data?.success) {
        toast.success(t('messages.noteAddSuccess'));
        setNoteContent('');
        // Refresh the page to show new note
        router.refresh();
      }
    } catch (error) {
      console.error('Add note error:', error);
      toast.error(t('messages.noteAddError'));
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleCopyLink = () => {
    if (meeting.meet_link) {
      navigator.clipboard.writeText(meeting.meet_link);
      toast.success(t('detail.linkCopied'));
    }
  };

  const handleBack = () => {
    router.push('/meetings');
  };

  const getMeetingTypeDetails = () => {
    switch (meeting.meeting_type) {
      case 'in_person':
        return {
          icon: <EnvironmentOutlined className="text-xl" />,
          label: t('detail.location'),
          value: meeting.location_or_link,
        };
      case 'phone_call':
        return {
          icon: <PhoneOutlined className="text-xl" />,
          label: t('detail.phoneNumber'),
          value: meeting.location_or_link,
        };
      case 'video_call':
        return {
          icon: <VideoCameraOutlined className="text-xl" />,
          label: t('detail.meetingLink'),
          value: meeting.meet_link,
        };
      default:
        return null;
    }
  };

  const typeDetails = getMeetingTypeDetails();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <Flex classes="items-center gap-4 mb-6">
        <ReusableButton
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          variant="default"
        />
        <div className="flex-1">
          <Flex classes="items-center gap-3 mb-2">
            <span className="text-3xl">{getMeetingTypeIcon(meeting.meeting_type)}</span>
            <Typography variant="h1" className="text-3xl font-bold">
              {meeting.title}
            </Typography>
          </Flex>
          <Flex classes="items-center gap-2">
            <Tag color={getStatusColor(meeting.status)} className="text-sm">
              {t(`status.${meeting.status}`)}
            </Tag>
            <Typography variant="text" className="text-muted-foreground text-sm">
              {t(`meetingType.${meeting.meeting_type}`)}
            </Typography>
          </Flex>
        </div>
      </Flex>

      {/* Main Content */}
      <div className="bg-card border border-card-border rounded-lg p-6 mb-6">
        {/* Participant Info */}
        <div className="mb-6">
          <Typography variant="h3" className="text-lg font-semibold mb-3">
            {isUserOrganizer ? t('detail.invitee') : t('detail.organizer')}
          </Typography>
          {meeting.other_participant && (
            <Flex classes="items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <UserOutlined className="text-primary text-xl" />
              </div>
              <div>
                <Typography variant="text" className="font-medium block">
                  {meeting.other_participant.name}
                </Typography>
                <Typography variant="text" className="text-sm text-muted-foreground">
                  {meeting.other_participant.email}
                </Typography>
                {meeting.other_participant.company_name && (
                  <Typography variant="text" className="text-sm text-muted-foreground">
                    {meeting.other_participant.company_name}
                  </Typography>
                )}
              </div>
            </Flex>
          )}
        </div>

        <Divider />

        {/* Meeting Details */}
        <div className="space-y-4">
          {/* Date & Time */}
          <Flex classes="items-start gap-4">
            <CalendarOutlined className="text-xl text-primary mt-1" />
            <div>
              <Typography variant="text" className="font-medium block mb-1">
                {t('detail.dateTime')}
              </Typography>
              <Typography variant="text" className="text-muted-foreground">
                {formatMeetingDate(meeting.proposed_date)} · {formatMeetingTime(meeting.proposed_start_time)}
              </Typography>
            </div>
          </Flex>

          {/* Duration */}
          <Flex classes="items-start gap-4">
            <ClockCircleOutlined className="text-xl text-primary mt-1" />
            <div>
              <Typography variant="text" className="font-medium block mb-1">
                {t('detail.duration')}
              </Typography>
              <Typography variant="text" className="text-muted-foreground">
                {meeting.proposed_duration_minutes} {t('detail.minutes', { minutes: meeting.proposed_duration_minutes })}
              </Typography>
            </div>
          </Flex>

          {/* Location/Phone/Link */}
          {typeDetails && (
            <Flex classes="items-start gap-4">
              <span className="text-primary mt-1">{typeDetails.icon}</span>
              <div className="flex-1">
                <Typography variant="text" className="font-medium block mb-1">
                  {typeDetails.label}
                </Typography>
                {typeDetails.value ? (
                  meeting.meeting_type === 'video_call' ? (
                    <Flex classes="gap-2">
                      <a
                        href={typeDetails.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {t('detail.joinMeeting')}
                      </a>
                      <ReusableButton
                        icon={<LinkOutlined />}
                        onClick={handleCopyLink}
                        variant="text"
                        btnText={t('detail.copyLink')}
                      />
                    </Flex>
                  ) : (
                    <Typography variant="text" className="text-muted-foreground">
                      {typeDetails.value}
                    </Typography>
                  )
                ) : (
                  <Typography variant="text" className="text-muted-foreground italic">
                    {meeting.meeting_type === 'video_call' ? 'Link not available yet' : 'Not provided'}
                  </Typography>
                )}
              </div>
            </Flex>
          )}
        </div>

        {/* Decline/Cancellation Reason */}
        {meeting.decline_reason && (
          <>
            <Divider />
            <div>
              <Typography variant="text" className="font-medium block mb-2">
                {t('detail.declineReason')}
              </Typography>
              <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                <Typography variant="text" className="text-sm">
                  {meeting.decline_reason}
                </Typography>
              </div>
            </div>
          </>
        )}

        {meeting.cancellation_reason && (
          <>
            <Divider />
            <div>
              <Typography variant="text" className="font-medium block mb-2">
                {t('detail.cancellationReason')}
              </Typography>
              <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                <Typography variant="text" className="text-sm">
                  {meeting.cancellation_reason}
                </Typography>
              </div>
            </div>
          </>
        )}

        {/* Previous Schedules */}
        {meeting.previous_schedules && meeting.previous_schedules.length > 0 && (
          <>
            <Divider />
            <div>
              <Typography variant="text" className="font-medium block mb-3">
                {t('detail.previousSchedules')}
              </Typography>
              <div className="space-y-2">
                {meeting.previous_schedules.map((schedule, index) => (
                  <div key={index} className="bg-muted/50 rounded p-3">
                    <Typography variant="text" className="text-sm text-muted-foreground">
                      {t('detail.rescheduledFrom')}: {formatMeetingDate(schedule.proposed_date)} ·{' '}
                      {formatMeetingTime(schedule.proposed_start_time)} ({schedule.proposed_duration_minutes}{' '}
                      {t('detail.minutes', { minutes: schedule.proposed_duration_minutes })})
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-card border border-card-border rounded-lg p-6 mb-6">
        <Typography variant="h3" className="text-lg font-semibold mb-4">
          {t('detail.actions')}
        </Typography>
        <Flex classes="gap-2 flex-wrap">
          {canAcceptMeeting(meeting, userId) && (
            <ReusableButton
              btnText={t('actions.accept')}
              icon={<CheckCircleOutlined />}
              onClick={() => setIsAcceptOpen(true)}
              variant="primary"
            />
          )}
          
          {canDeclineMeeting(meeting, userId) && (
            <ReusableButton
              btnText={t('actions.decline')}
              icon={<CloseCircleOutlined />}
              onClick={() => setIsDeclineOpen(true)}
              variant="default"
              danger
            />
          )}
          
          {canRescheduleMeeting(meeting, userId) && (
            <ReusableButton
              btnText={t('actions.reschedule')}
              icon={<EditOutlined />}
              onClick={() => setIsRescheduleOpen(true)}
              variant="default"
            />
          )}
          
          {canCancelMeeting(meeting, userId) && (
            <ReusableButton
              btnText={t('actions.cancel')}
              icon={<CloseCircleOutlined />}
              onClick={() => setIsCancelOpen(true)}
              variant="default"
              danger
            />
          )}
          
          {canCompleteMeeting(meeting, userId) && (
            <ReusableButton
              btnText={t('actions.complete')}
              icon={<CheckCircleOutlined />}
              onClick={() => setIsCompleteOpen(true)}
              variant="primary"
            />
          )}
        </Flex>
      </div>

      {/* Notes Section */}
      <div className="bg-card border border-card-border rounded-lg p-6">
        <Typography variant="h3" className="text-lg font-semibold mb-4">
          {t('detail.notes')}
        </Typography>
        
        {/* Add Note */}
        <div className="mb-6">
          <TextArea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder={t('detail.notePlaceholder')}
            rows={3}
            maxLength={2000}
            showCount
          />
          <div className="mt-2">
            <ReusableButton
              btnText={t('detail.addNote')}
              onClick={handleAddNote}
              disabled={!noteContent.trim() || isAddingNote}
              isLoading={isAddingNote}
              variant="default"
            />
          </div>
        </div>

        {/* Notes List */}
        {meeting.notes && meeting.notes.length > 0 ? (
          <div className="space-y-4">
            {meeting.notes.map((note, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-4">
                <Flex classes="justify-between items-start mb-2">
                  <Typography variant="text" className="font-medium">
                    {note.author_id === userId ? 'You' : meeting.other_participant?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="text" className="text-sm text-muted-foreground">
                    {format(new Date(note.created_at), 'MMM dd, yyyy · h:mm a')}
                  </Typography>
                </Flex>
                <Typography variant="text" className="text-sm whitespace-pre-wrap">
                  {note.content}
                </Typography>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Typography variant="text" className="text-muted-foreground">
              {t('detail.noNotes')}
            </Typography>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AcceptMeetingDialog
        isOpen={isAcceptOpen}
        setIsOpen={setIsAcceptOpen}
        meeting={meeting}
        onSuccess={() => router.refresh()}
      />
      
      <DeclineMeetingDialog
        isOpen={isDeclineOpen}
        setIsOpen={setIsDeclineOpen}
        meetingId={meeting.id}
        onSuccess={() => router.refresh()}
      />
      
      <CancelMeetingDialog
        isOpen={isCancelOpen}
        setIsOpen={setIsCancelOpen}
        meetingId={meeting.id}
        onSuccess={() => router.refresh()}
      />
      
      <RescheduleMeetingDialog
        isOpen={isRescheduleOpen}
        setIsOpen={setIsRescheduleOpen}
        meeting={meeting}
        onSuccess={() => router.refresh()}
      />
      
      <CompleteMeetingDialog
        isOpen={isCompleteOpen}
        setIsOpen={setIsCompleteOpen}
        meetingId={meeting.id}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
