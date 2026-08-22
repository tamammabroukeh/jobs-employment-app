import { authFetcher } from '@/apis/authInstace';
import { Methods } from '@/constants/methods';
import { buildQueryString } from '@/apis/utils/queryBuilder';
import type {
  ICreateMeetingRequest,
  ICreateMeetingResponse,
  IAcceptMeetingRequest,
  IAcceptMeetingResponse,
  IDeclineMeetingRequest,
  ICancelMeetingRequest,
  IRescheduleMeetingRequest,
  IRescheduleMeetingResponse,
  IAddNoteRequest,
  IAddNoteResponse,
  IGetMeetingsParams,
  IMeetingsListResponse,
  IMeeting,
  IUpcomingMeetingSummary,
  IGoogleStatusResponse,
  IGoogleConnectResponse,
  IGoogleDisconnectResponse,
} from './interface';

export const meetingsRepository = {
  /**
   * Create a new meeting invitation
   * @param data - Meeting details
   * @returns Promise with created meeting and conflicts
   */
  createMeeting: async (
    data: ICreateMeetingRequest
  ): Promise<ICreateMeetingResponse> => {
    return authFetcher<ICreateMeetingResponse>('/meetings', {
      method: Methods.POST,
      body: JSON.stringify(data),
    });
  },

  /**
   * Get list of meetings
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with meetings list
   */
  getMeetings: async (
    params?: IGetMeetingsParams
  ): Promise<IMeetingsListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    return authFetcher<IMeetingsListResponse>(`/meetings?${queryString}`, {
      method: Methods.GET,
      next: {
        tags: ['meetings-list'],
        revalidate: 60,
      },
    });
  },

  /**
   * Get meeting details
   * @param id - Meeting ID
   * @returns Promise with meeting details
   */
  getMeeting: async (id: string): Promise<{ meeting: IMeeting }> => {
    return authFetcher<{ meeting: IMeeting }>(`/meetings/${id}`, {
      method: Methods.GET,
      next: {
        tags: ['meeting-detail', `meeting-${id}`],
        revalidate: 60,
      },
    });
  },

  /**
   * Accept meeting invitation
   * @param id - Meeting ID
   * @param data - Optional meeting link
   * @returns Promise with updated meeting and conflicts
   */
  acceptMeeting: async (
    id: string,
    data?: IAcceptMeetingRequest
  ): Promise<IAcceptMeetingResponse> => {
    return authFetcher<IAcceptMeetingResponse>(`/meetings/${id}/accept`, {
      method: Methods.POST,
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Decline meeting invitation
   * @param id - Meeting ID
   * @param data - Optional decline reason
   * @returns Promise with updated meeting
   */
  declineMeeting: async (
    id: string,
    data?: IDeclineMeetingRequest
  ): Promise<IMeeting> => {
    return authFetcher<IMeeting>(`/meetings/${id}/decline`, {
      method: Methods.POST,
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Cancel meeting
   * @param id - Meeting ID
   * @param data - Optional cancellation reason
   * @returns Promise with updated meeting
   */
  cancelMeeting: async (
    id: string,
    data?: ICancelMeetingRequest
  ): Promise<IMeeting> => {
    return authFetcher<IMeeting>(`/meetings/${id}/cancel`, {
      method: Methods.POST,
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Reschedule meeting
   * @param id - Meeting ID
   * @param data - New schedule details
   * @returns Promise with updated meeting and conflicts
   */
  rescheduleMeeting: async (
    id: string,
    data: IRescheduleMeetingRequest
  ): Promise<IRescheduleMeetingResponse> => {
    return authFetcher<IRescheduleMeetingResponse>(
      `/meetings/${id}/reschedule`,
      {
        method: Methods.POST,
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Mark meeting as completed
   * @param id - Meeting ID
   * @returns Promise with updated meeting
   */
  completeMeeting: async (id: string): Promise<IMeeting> => {
    return authFetcher<IMeeting>(`/meetings/${id}/complete`, {
      method: Methods.POST,
    });
  },

  /**
   * Add note to meeting
   * @param id - Meeting ID
   * @param data - Note content
   * @returns Promise with created note
   */
  addNote: async (id: string, data: IAddNoteRequest): Promise<IAddNoteResponse> => {
    return authFetcher<IAddNoteResponse>(`/meetings/${id}/notes`, {
      method: Methods.POST,
      body: JSON.stringify(data),
    });
  },

  /**
   * Get upcoming meetings summary
   * @returns Promise with upcoming meetings (max 5)
   */
  getUpcomingMeetings: async (): Promise<IUpcomingMeetingSummary[]> => {
    return authFetcher<IUpcomingMeetingSummary[]>('/meetings/upcoming', {
      method: Methods.GET,
      next: {
        tags: ['meetings-upcoming'],
        revalidate: 30,
      },
    });
  },

  /**
   * Get Google account connection status
   * @returns Promise with connection status
   */
  getGoogleStatus: async (): Promise<IGoogleStatusResponse> => {
    return authFetcher<IGoogleStatusResponse>('/google/status', {
      method: Methods.GET,
    });
  },

  /**
   * Get Google OAuth connection URL
   * @returns Promise with auth URL
   */
  getGoogleConnectUrl: async (): Promise<IGoogleConnectResponse> => {
    return authFetcher<IGoogleConnectResponse>('/google/connect', {
      method: Methods.GET,
    });
  },

  /**
   * Disconnect Google account
   * @returns Promise with success message
   */
  disconnectGoogle: async (): Promise<IGoogleDisconnectResponse> => {
    return authFetcher<IGoogleDisconnectResponse>('/google/disconnect', {
      method: Methods.DELETE,
    });
  },
};
