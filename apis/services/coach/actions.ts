'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { coachRepository } from './index';
import { ActionError } from '@/apis/types/error';

/**
 * Create Session Action Schema
 */
const createSessionSchema = z.object({
  title: z.string().max(100).optional(),
});

/**
 * Create a new coach session
 */
export const createSessionAction = actionClient
  .schema(createSessionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await coachRepository.createSession(
        parsedInput.title ? { title: parsedInput.title } : undefined
      );

      revalidateTag('coach-sessions', 'max');

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Create coach session error:', error);

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to create coach session');
    }
  });

/**
 * Get all sessions action
 */
export const getSessionsAction = async () => {
  try {
    const response = await coachRepository.getSessions();
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get coach sessions error:', error);
    throw new ActionError('Failed to fetch coach sessions');
  }
};

/**
 * Get Session Messages Schema
 */
const getSessionMessagesSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
});

/**
 * Get messages for a specific session
 */
export const getSessionMessagesAction = actionClient
  .schema(getSessionMessagesSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await coachRepository.getSessionMessages(
        parsedInput.sessionId
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get session messages error:', error);

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to fetch session messages');
    }
  });

/**
 * Delete Session Schema
 */
const deleteSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
});

/**
 * Delete a coach session
 */
export const deleteSessionAction = actionClient
  .schema(deleteSessionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await coachRepository.deleteSession(
        parsedInput.sessionId
      );

      revalidateTag('coach-sessions', 'max');
      revalidateTag(`coach-session-${parsedInput.sessionId}`, 'max');

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Delete coach session error:', error);

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to delete coach session');
    }
  });

/**
 * Chat Message Schema
 */
const chatSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message must be 1000 characters or less'),
  session_id: z.string().optional(),
});

/**
 * Send a message to the AI coach
 */
export const chatAction = actionClient
  .schema(chatSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await coachRepository.chat(parsedInput);

      // Revalidate sessions list and the specific session
      revalidateTag('coach-sessions', 'max');
      if (response.session_id) {
        revalidateTag(`coach-session-${response.session_id}`, 'max');
      }

      return {
        success: true,
        response: response.response,
        session_id: response.session_id,
      };
    } catch (error) {
      console.error('Chat with coach error:', error);

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to send message to coach');
    }
  });
