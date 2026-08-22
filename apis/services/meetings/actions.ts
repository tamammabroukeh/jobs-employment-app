'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { meetingsRepository } from './index';
import { ActionError } from '@/apis/types/error';

// Validation Schemas
const createMeetingSchema = z.object({
  invitee_id: z.string().min(1, 'Invitee is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  meeting_type: z.enum(['in_person', 'phone_call', 'video_call']),
  proposed_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  proposed_start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  proposed_duration_minutes: z.number().min(15, 'Minimum duration is 15 minutes').max(480, 'Maximum duration is 480 minutes'),
  location_or_link: z.string().max(500, 'Location/Link must be less than 500 characters').optional(),
});

const acceptMeetingSchema = z.object({
  meetingId: z.string().min(1, 'Meeting ID is required'),
  meet_link: z.string().max(500, 'Link must be less than 500 characters').optional(),
});

const declineMeetingSchema = z.object({
  meetingId: z.string().min(1, 'Meeting ID is required'),
  decline_reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

const cancelMeetingSchema = z.object({
  meetingId: z.string().min(1, 'Meeting ID is required'),
  cancellation_reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

const rescheduleMeetingSchema = z.object({
  meetingId: z.string().min(1, 'Meeting ID is required'),
  proposed_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  proposed_start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  proposed_duration_minutes: z.number().min(15, 'Minimum duration is 15 minutes').max(480, 'Maximum duration is 480 minutes'),
});

const completeMeetingSchema = z.object({
  meetingId: z.string().min(1, 'Meeting ID is required'),
});

const addNoteSchema = z.object({
  meetingId: z.string().min(1, 'Meeting ID is required'),
  content: z.string().min(1, 'Note content is required').max(2000, 'Note must be less than 2000 characters'),
});

// Server Actions
export const createMeetingAction = actionClient
  .schema(createMeetingSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await meetingsRepository.createMeeting(parsedInput);
      
      revalidateTag('meetings-list', 'max');
      revalidateTag('meetings-upcoming', 'max');
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Create meeting error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create meeting';
      throw new ActionError(errorMessage);
    }
  });

export const acceptMeetingAction = actionClient
  .schema(acceptMeetingSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { meetingId, meet_link } = parsedInput;
      const response = await meetingsRepository.acceptMeeting(
        meetingId,
        meet_link ? { meet_link } : undefined
      );
      
      revalidateTag('meetings-list', 'max');
      revalidateTag('meetings-upcoming', 'max');
      revalidateTag('meeting-detail', 'max');
      revalidateTag(`meeting-${meetingId}`, 'max');
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Accept meeting error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to accept meeting';
      throw new ActionError(errorMessage);
    }
  });

export const declineMeetingAction = actionClient
  .schema(declineMeetingSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { meetingId, decline_reason } = parsedInput;
      const response = await meetingsRepository.declineMeeting(
        meetingId,
        decline_reason ? { decline_reason } : undefined
      );
      
      revalidateTag('meetings-list', 'max');
      revalidateTag('meetings-upcoming', 'max');
      revalidateTag('meeting-detail', 'max');
      revalidateTag(`meeting-${meetingId}`, 'max');
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Decline meeting error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to decline meeting';
      throw new ActionError(errorMessage);
    }
  });

export const cancelMeetingAction = actionClient
  .schema(cancelMeetingSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { meetingId, cancellation_reason } = parsedInput;
      const response = await meetingsRepository.cancelMeeting(
        meetingId,
        cancellation_reason ? { cancellation_reason } : undefined
      );
      
      revalidateTag('meetings-list', 'max');
      revalidateTag('meetings-upcoming', 'max');
      revalidateTag('meeting-detail', 'max');
      revalidateTag(`meeting-${meetingId}`, 'max');
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Cancel meeting error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to cancel meeting';
      throw new ActionError(errorMessage);
    }
  });

export const rescheduleMeetingAction = actionClient
  .schema(rescheduleMeetingSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { meetingId, ...scheduleData } = parsedInput;
      console.log('scheduleData', scheduleData)
      const response = await meetingsRepository.rescheduleMeeting(
        meetingId,
        scheduleData
      );
      
      revalidateTag('meetings-list', 'max');
      revalidateTag('meetings-upcoming', 'max');
      revalidateTag('meeting-detail', 'max');
      revalidateTag(`meeting-${meetingId}`, 'max');
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Reschedule meeting error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to reschedule meeting';
      throw new ActionError(errorMessage);
    }
  });

export const completeMeetingAction = actionClient
  .schema(completeMeetingSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { meetingId } = parsedInput;
      const response = await meetingsRepository.completeMeeting(meetingId);
      
      revalidateTag('meetings-list', 'max');
      revalidateTag('meetings-upcoming', 'max');
      revalidateTag('meeting-detail', 'max');
      revalidateTag(`meeting-${meetingId}`, 'max');
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Complete meeting error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to complete meeting';
      throw new ActionError(errorMessage);
    }
  });

export const addNoteMeetingAction = actionClient
  .schema(addNoteSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { meetingId, content } = parsedInput;
      const response = await meetingsRepository.addNote(meetingId, { content });
      
      revalidateTag('meeting-detail', 'max');
      revalidateTag(`meeting-${meetingId}`, 'max');
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Add note error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add note';
      throw new ActionError(errorMessage);
    }
  });
