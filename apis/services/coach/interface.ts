// Coach API Interfaces

/**
 * Coach session object
 */
export interface ICoachSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

/**
 * Chat message object
 */
export interface ICoachMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Request Interfaces

/**
 * Request to create a new coach session
 */
export interface ICreateSessionRequest {
  title?: string; // optional, max 100 chars
}

/**
 * Request to send a chat message
 */
export interface IChatRequest {
  message: string; // max 1000 chars
  session_id?: string; // optional
}

// Response Interfaces

/**
 * Response from create session endpoint
 */
export interface ICreateSessionResponse {
  data: ICoachSession;
}

/**
 * Response from get sessions endpoint
 */
export interface IGetSessionsResponse {
  data: ICoachSession[];
}

/**
 * Response from get session messages endpoint
 */
export interface IGetSessionMessagesResponse {
  data: ICoachMessage[];
}

/**
 * Response from delete session endpoint
 */
export interface IDeleteSessionResponse {
  message: string;
}

/**
 * Response from chat endpoint
 */
export interface IChatResponse {
  response: string;
  session_id: string;
}
