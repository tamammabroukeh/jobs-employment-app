import { authFetcher } from '@/apis/authInstace';
import type {
  ICreateSessionRequest,
  ICreateSessionResponse,
  IGetSessionsResponse,
  IGetSessionMessagesResponse,
  IDeleteSessionResponse,
  IChatRequest,
  IChatResponse,
} from './interface';
import { Methods } from '@/constants/methods';

/**
 * Coach API Repository
 * Handles all API calls related to AI Resume Coach feature
 */
export const coachRepository = {
  /**
   * Create a new coach session
   * @param data - Optional session title
   * @returns Promise with created session data
   */
  createSession: async (
    data?: ICreateSessionRequest
  ): Promise<ICreateSessionResponse> => {
    return authFetcher<ICreateSessionResponse>(
      '/job-seeker/coach/sessions',
      {
        method: Methods.POST,
        body: data ? JSON.stringify(data) : undefined,
      }
    );
  },

  /**
   * Get all coach sessions for authenticated user
   * @returns Promise with list of sessions (newest first)
   */
  getSessions: async (): Promise<IGetSessionsResponse> => {
    return authFetcher<IGetSessionsResponse>(
      '/job-seeker/coach/sessions',
      {
        method: Methods.GET,
        next: {
          tags: ['coach-sessions'],
          revalidate: 60,
        },
      }
    );
  },

  /**
   * Get all messages in a specific session
   * @param sessionId - The session ID
   * @returns Promise with list of messages
   */
  ///sessions/{session_id}/messages
  getSessionMessages: async (
    sessionId: string
  ): Promise<IGetSessionMessagesResponse> => {
    return authFetcher<IGetSessionMessagesResponse>(
      `/sessions/${sessionId}/messages`,
      {
        method: Methods.GET,
        next: {
          tags: [`coach-session-${sessionId}`],
          revalidate: 30,
        },
      },
      false,
      0,
      true
    );
  },

  /**
   * Delete a coach session and all its messages
   * @param sessionId - The session ID
   * @returns Promise with success message
   */
  deleteSession: async (
    sessionId: string
  ): Promise<IDeleteSessionResponse> => {
    return authFetcher<IDeleteSessionResponse>(
      `/job-seeker/coach/sessions/${sessionId}`,
      {
        method: Methods.DELETE,
      }
    );
  },

  /**
   * Send a message to the AI resume coach
   * @param data - Message and optional session_id
   * @returns Promise with AI response and session_id
   */
  chat: async (data: IChatRequest): Promise<IChatResponse> => {
    return authFetcher<IChatResponse>('/job-seeker/coach/chat', {
      method: Methods.POST,
      body: JSON.stringify(data),
    });
  },
};
