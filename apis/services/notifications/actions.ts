'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { notificationsRepository } from './index';
import { ActionError } from '@/apis/types/error';

/**
 * Get notifications list
 */
const getNotificationsSchema = z.object({
  per_page: z.number().min(1).max(50).optional(),
  page: z.number().min(1).optional(),
});

export const getNotificationsAction = actionClient
  .schema(getNotificationsSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await notificationsRepository.getNotifications(
        parsedInput
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Get notifications error:', error);

      if (error instanceof ActionError) throw error;

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch notifications';
      throw new ActionError(errorMessage);
    }
  });

/**
 * Get unread notifications count
 */
export const getUnreadCountAction = actionClient.action(async () => {
  try {
    const response = await notificationsRepository.getUnreadCount();

    return {
      success: true,
      unread_count: response.unread_count,
    };
  } catch (error) {
    console.error('Get unread count error:', error);

    if (error instanceof ActionError) throw error;

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to fetch unread count';
    throw new ActionError(errorMessage);
  }
});

/**
 * Mark all notifications as read
 */
export const markAllAsReadAction = actionClient.action(async () => {
  try {
    const response = await notificationsRepository.markAllAsRead();

    // Revalidate notifications cache
    revalidateTag('notifications-list', 'max');
    revalidateTag('notifications-unread-count', 'max');

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    console.error('Mark all as read error:', error);

    if (error instanceof ActionError) throw error;

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to mark all as read';
    throw new ActionError(errorMessage);
  }
});

/**
 * Mark a notification as read
 */
const markAsReadSchema = z.object({
  notificationId: z.string().min(1, 'Notification ID is required'),
});

export const markAsReadAction = actionClient
  .schema(markAsReadSchema)
  .action(async ({ parsedInput: { notificationId } }) => {
    try {
      const response = await notificationsRepository.markAsRead(notificationId);

      // Revalidate notifications cache
      revalidateTag('notifications-list', 'max');
      revalidateTag('notifications-unread-count', 'max');

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Mark as read error:', error);

      if (error instanceof ActionError) throw error;

      const errorMessage =
        error instanceof Error
        ? error.message
        : 'Failed to mark notification as read';
      throw new ActionError(errorMessage);
    }
  });
