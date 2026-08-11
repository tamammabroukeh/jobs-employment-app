import { authFetcher } from '@/apis/authInstace';
import type {
  IGetNotificationsRequest,
  IGetNotificationsResponse,
  IUnreadCountResponse,
  IMarkAsReadResponse,
} from './interface';
import { buildQueryString } from '@/apis/utils/queryBuilder';
import { Methods } from '@/constants/methods';

export const notificationsRepository = {
  /**
   * Get list of notifications for authenticated user
   * @param params - Pagination parameters (per_page, page)
   * @returns Promise with notifications list
   */
  getNotifications: async (
    params?: IGetNotificationsRequest
  ): Promise<IGetNotificationsResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    
    return authFetcher<IGetNotificationsResponse>(
      `/notifications${queryString}`,
      {
        method: Methods.GET,
        next: {
          tags: ['notifications-list'],
          revalidate: 60, // Revalidate every 60 seconds
        },
      }
    );
  },

  /**
   * Get unread notifications count
   * @returns Promise with unread count
   */
  getUnreadCount: async (): Promise<IUnreadCountResponse> => {
    return authFetcher<IUnreadCountResponse>('/notifications/unread-count', {
      method: Methods.GET,
      next: {
        tags: ['notifications-unread-count'],
        revalidate: 30, // Revalidate every 30 seconds
      },
    });
  },

  /**
   * Mark all notifications as read
   * @returns Promise with success response
   */
  markAllAsRead: async (): Promise<IMarkAsReadResponse> => {
    return authFetcher<IMarkAsReadResponse>('/notifications/read-all', {
      method: Methods.POST,
    });
  },

  /**
   * Mark a single notification as read
   * @param notificationId - The notification ID
   * @returns Promise with success response
   */
  markAsRead: async (notificationId: string): Promise<IMarkAsReadResponse> => {
    return authFetcher<IMarkAsReadResponse>(
      `/notifications/${notificationId}/read`,
      {
        method: Methods.POST,
      }
    );
  },
};
