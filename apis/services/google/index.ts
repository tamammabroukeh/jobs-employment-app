import { authFetcher } from '@/apis/authInstace';
import {
  IGoogleStatusResponse,
  IGoogleConnectResponse,
  IGoogleDisconnectResponse,
} from './interface';
import { Methods } from '@/constants/methods';

export const googleRepository = {
  /**
   * Get Google Calendar connection status
   * @returns Promise with connection status and email (if connected)
   */
  getStatus: async (): Promise<IGoogleStatusResponse> => {
    return authFetcher<IGoogleStatusResponse>('/google/status', {
      method: Methods.GET,
      next: {
        tags: ['google-status'],
        revalidate: 60,
      },
    });
  },

  /**
   * Get Google OAuth authorization URL
   * @returns Promise with auth URL to redirect user
   */
  getConnectUrl: async (): Promise<IGoogleConnectResponse> => {
    return authFetcher<IGoogleConnectResponse>('/google/connect', {
      method: Methods.GET,
    });
  },

  /**
   * Disconnect Google Calendar integration
   * @returns Promise with success message
   */
  disconnect: async (): Promise<IGoogleDisconnectResponse> => {
    return authFetcher<IGoogleDisconnectResponse>('/google/disconnect', {
      method: Methods.DELETE,
    });
  },
};
