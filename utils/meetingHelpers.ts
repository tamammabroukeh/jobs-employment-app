import { IMeeting } from '@/apis/services/meetings/interface';
import { format, parseISO, isPast, isFuture } from 'date-fns';

/**
 * Format meeting date and time for display
 */
export function formatMeetingDateTime(date: string, time: string): string {
  try {
    const dateTime = parseISO(`${date}T${time}`);
    return format(dateTime, 'MMM dd, yyyy · h:mm a');
  } catch {
    return `${date} · ${time}`;
  }
}

/**
 * Format meeting date only
 */
export function formatMeetingDate(date: string): string {
  try {
    const dateObj = parseISO(date);
    return format(dateObj, 'MMMM dd, yyyy');
  } catch {
    return date;
  }
}

/**
 * Format meeting time only
 */
export function formatMeetingTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  } catch {
    return time;
  }
}

/**
 * Check if meeting is in the past
 */
export function isMeetingPast(date: string, time: string): boolean {
  try {
    const dateTime = parseISO(`${date}T${time}`);
    return isPast(dateTime);
  } catch {
    return false;
  }
}

/**
 * Check if meeting is in the future
 */
export function isMeetingFuture(date: string, time: string): boolean {
  try {
    const dateTime = parseISO(`${date}T${time}`);
    return isFuture(dateTime);
  } catch {
    return false;
  }
}

/**
 * Get status badge color
 */
export function getStatusColor(status: IMeeting['status']): string {
  const colors = {
    pending: 'warning',
    accepted: 'success',
    declined: 'error',
    cancelled: 'default',
    rescheduled: 'processing',
    completed: 'success',
  };
  return colors[status] || 'default';
}

/**
 * Get meeting type icon
 */
export function getMeetingTypeIcon(type: IMeeting['meeting_type']): string {
  const icons = {
    in_person: '👥',
    phone_call: '📞',
    video_call: '🎥',
  };
  return icons[type] || '📅';
}

/**
 * Check if user is organizer
 */
export function isOrganizer(meeting: IMeeting, userId: string): boolean {
  return meeting.organizer_id === userId;
}

/**
 * Check if user is invitee
 */
export function isInvitee(meeting: IMeeting, userId: string): boolean {
  return meeting.invitee_id === userId;
}

/**
 * Check if user can accept meeting
 */
export function canAcceptMeeting(meeting: IMeeting, userId: string): boolean {
  return (
    isInvitee(meeting, userId) &&
    (meeting.status === 'pending' || meeting.status === 'rescheduled')
  );
}

/**
 * Check if user can decline meeting
 */
export function canDeclineMeeting(meeting: IMeeting, userId: string): boolean {
  return (
    isInvitee(meeting, userId) &&
    (meeting.status === 'pending' || meeting.status === 'rescheduled')
  );
}

/**
 * Check if user can cancel meeting
 */
export function canCancelMeeting(meeting: IMeeting, userId: string): boolean {
  if (isOrganizer(meeting, userId)) {
    return !['completed', 'declined', 'cancelled'].includes(meeting.status);
  }
  
  if (isInvitee(meeting, userId)) {
    return ['accepted', 'rescheduled'].includes(meeting.status);
  }
  
  return false;
}

/**
 * Check if user can reschedule meeting
 */
export function canRescheduleMeeting(meeting: IMeeting, userId: string): boolean {
  return (
    isOrganizer(meeting, userId) &&
    !['completed', 'declined', 'cancelled'].includes(meeting.status)
  );
}

/**
 * Check if user can complete meeting
 */
export function canCompleteMeeting(meeting: IMeeting, userId: string): boolean {
  return (
    isOrganizer(meeting, userId) &&
    meeting.status === 'accepted' &&
    isMeetingPast(meeting.proposed_date, meeting.proposed_start_time)
  );
}

/**
 * Duration options for meeting creation
 */
export const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
];

/**
 * Get duration label
 */
export function getDurationLabel(minutes: number): string {
  const option = DURATION_OPTIONS.find(opt => opt.value === minutes);
  return option?.label || `${minutes} minutes`;
}
