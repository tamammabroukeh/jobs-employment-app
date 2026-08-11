// Notification interfaces

/**
 * Notification entity
 */
export interface INotification {
  id: string;
  type: string;
  message: string;
  read_at: string | null;
  related_entity_id: string;
  related_entity_type: string;
  created_at: string;
}

/**
 * Get notifications list request
 */
export interface IGetNotificationsRequest {
  per_page?: number;
  page?: number;
}

/**
 * Get notifications list response
 */
export interface IGetNotificationsResponse {
  data: INotification[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

/**
 * Get unread count response
 */
export interface IUnreadCountResponse {
  unread_count: number;
}

/**
 * Mark as read response
 */
export interface IMarkAsReadResponse {
  status: boolean;
  message: string;
}
