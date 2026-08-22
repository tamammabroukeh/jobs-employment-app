// Meeting API Interfaces

export interface IUser {
  id: string;
  name: string;
  email: string;
  company_name?: string;
}

export interface INote {
  author_id: string;
  content: string;
  created_at: string;
}

export interface IPreviousSchedule {
  proposed_date: string;
  proposed_start_time: string;
  proposed_duration_minutes: number;
}

export interface IConflict {
  id: string;
  proposed_date: string;
  proposed_start_time: string;
  proposed_duration_minutes: number;
}

export interface IMeeting {
  id: string;
  organizer_id: string;
  invitee_id: string;
  title: string;
  meeting_type: 'in_person' | 'phone_call' | 'video_call';
  proposed_date: string;
  proposed_start_time: string;
  proposed_duration_minutes: number;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'rescheduled' | 'completed';
  location_or_link?: string | null;
  meet_link?: string | null;
  google_calendar_event_id?: string | null;
  decline_reason?: string | null;
  cancellation_reason?: string | null;
  cancelled_by?: string | null;
  notes: INote[];
  previous_schedules: IPreviousSchedule[];
  created_at: string;
  updated_at: string;
  other_participant?: IUser;
}

// Request Interfaces
export interface ICreateMeetingRequest {
  invitee_id: string;
  title: string;
  meeting_type: 'in_person' | 'phone_call' | 'video_call';
  proposed_date: string;
  proposed_start_time: string;
  proposed_duration_minutes: number;
  location_or_link?: string;
}

export interface IAcceptMeetingRequest {
  meet_link?: string;
}

export interface IDeclineMeetingRequest {
  decline_reason?: string;
}

export interface ICancelMeetingRequest {
  cancellation_reason?: string;
}

export interface IRescheduleMeetingRequest {
  proposed_date: string;
  proposed_start_time: string;
  proposed_duration_minutes: number;
}

export interface IAddNoteRequest {
  content: string;
}

export interface IGetMeetingsParams {
  page?: number;
  per_page?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
  sort_direction?: 'asc' | 'desc';
}

// Response Interfaces
export interface ICreateMeetingResponse {
  meeting: IMeeting;
  organizer_conflicts: IConflict[];
  invitee_conflicts: IConflict[];
}

export interface IAcceptMeetingResponse {
  meeting: IMeeting;
  organizer_conflicts: IConflict[];
  invitee_conflicts: IConflict[];
  google_meet_warning?: string;
}

export interface IRescheduleMeetingResponse {
  meeting: IMeeting;
  organizer_conflicts: IConflict[];
  invitee_conflicts: IConflict[];
}

export interface IMeetingsListResponse {
  data: IMeeting[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface IUpcomingMeetingSummary {
  title: string;
  meeting_type: 'in_person' | 'phone_call' | 'video_call';
  proposed_date: string;
  proposed_start_time: string;
  proposed_duration_minutes: number;
  other_participant: {
    name: string;
    company_name?: string;
  };
}

export interface IAddNoteResponse {
  note: INote;
}

// Re-export Google interfaces from google module for convenience
export type {
  IGoogleStatusResponse,
  IGoogleConnectResponse,
  IGoogleDisconnectResponse,
} from '../google/interface';
