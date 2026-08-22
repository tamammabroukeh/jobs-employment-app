'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { googleRepository } from './index';
import { ActionError } from '@/apis/types/error';

/**
 * Server action to get Google Calendar connection status
 */
export const getGoogleStatusAction = actionClient.action(async () => {
  try {
    const response = await googleRepository.getStatus();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Get Google status error:', error);

    if (error instanceof ActionError) throw error;
    throw new ActionError('Failed to get Google connection status');
  }
});

/**
 * Server action to get Google OAuth authorization URL
 */
export const getGoogleConnectUrlAction = actionClient.action(async () => {
  try {
    const response = await googleRepository.getConnectUrl();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Get Google connect URL error:', error);

    if (error instanceof ActionError) throw error;
    throw new ActionError('Failed to get Google authorization URL');
  }
});

/**
 * Server action to disconnect Google Calendar integration
 */
export const disconnectGoogleAction = actionClient.action(async () => {
  try {
    const response = await googleRepository.disconnect();

    // Revalidate Google status cache
    revalidateTag('google-status', 'max');
    // Also revalidate meetings cache as meet links might be affected
    revalidateTag('meetings-list', 'max');

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    console.error('Disconnect Google error:', error);

    if (error instanceof ActionError) throw error;
    throw new ActionError('Failed to disconnect Google account');
  }
});
