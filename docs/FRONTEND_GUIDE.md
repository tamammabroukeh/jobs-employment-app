# Meeting Feature - Frontend Implementation Guide

## Overview

This guide provides frontend developers with everything needed to implement the meeting scheduling feature. The platform enables employers and job seekers to schedule interviews with optional Google Meet integration.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Core Concepts](#core-concepts)
3. [API Endpoints](#api-endpoints)
4. [Request/Response Examples](#requestresponse-examples)
5. [Implementation Workflow](#implementation-workflow)
6. [Error Handling](#error-handling)
7. [Google Meet Integration](#google-meet-integration)

---

## Authentication

All meeting endpoints require JWT authentication:

```http
Authorization: Bearer {jwt_token}
```

**Getting the JWT token:**
- User logs in via `POST /api/auth/login`
- Store the returned `access_token`
- Include it in the `Authorization` header for all subsequent requests

---

## Core Concepts

### User Roles
- **employee** (job seeker): Can create meetings with employers, respond to invitations
- **employer**: Can create meetings with job seekers, respond to invitations
- **admin**: Can view all meetings across the platform

### Meeting Types
- `in_person`: Physical location required
- `phone_call`: Phone number required
- `video_call`: Google Meet link auto-generated (if Google connected) or manual entry

### Meeting Status Flow
```
pending → accepted → completed
       ↘ declined
       ↘ cancelled
       ↘ rescheduled → accepted/declined/cancelled
```

### Key Fields
- **organizer_id**: User who created the meeting
- **invitee_id**: User who received the invitation
- **proposed_date**: Format `YYYY-MM-DD`
- **proposed_start_time**: Format `HH:MM` (24-hour)
- **proposed_duration_minutes**: Integer between 15-480

---

## API Endpoints

### 1. Create Meeting Invitation

**Endpoint:** `POST /api/meetings`

**Who can call:** Any authenticated user (employer or employee)

**Request Body:**
```json
{
  "invitee_id": "string (required)",
  "title": "string (required, 1-255 chars)",
  "meeting_type": "in_person|phone_call|video_call (required)",
  "proposed_date": "YYYY-MM-DD (required, future date)",
  "proposed_start_time": "HH:MM (required)",
  "proposed_duration_minutes": "integer (required, 15-480)",
  "location_or_link": "string (optional, max 500 chars)"
}
```

**Response:** `201 Created`
```json
{
  "meeting": {
    "_id": "507f1f77bcf86cd799439011",
    "organizer_id": "current_user_id",
    "invitee_id": "invitee_user_id",
    "title": "Initial Interview",
    "meeting_type": "video_call",
    "proposed_date": "2026-08-25",
    "proposed_start_time": "14:00",
    "proposed_duration_minutes": 60,
    "status": "pending",
    "location_or_link": null,
    "meet_link": null,
    "notes": [],
    "previous_schedules": [],
    "created_at": "2026-08-19T10:30:00Z",
    "updated_at": "2026-08-19T10:30:00Z"
  },
  "organizer_conflicts": [],
  "invitee_conflicts": []
}
```

**Notes:**
- `location_or_link` is ignored for `video_call` type
- Conflicts are warnings, not errors — meeting is still created
- Each conflict entry contains: `id`, `proposed_date`, `proposed_start_time`, `proposed_duration_minutes`

---

### 2. List Meetings (My Meetings)

**Endpoint:** `GET /api/meetings`

**Who can call:** Any authenticated user

**Query Parameters:**
- `page` (integer, default: 1)
- `per_page` (integer, default: 15, max: 100)
- `status` (string, comma-separated: `pending,accepted,declined,cancelled,rescheduled,completed`)
- `from_date` (string, format: `YYYY-MM-DD`)
- `to_date` (string, format: `YYYY-MM-DD`)
- `sort_direction` (string: `asc` or `desc`, default: `asc`)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Initial Interview",
      "meeting_type": "video_call",
      "proposed_date": "2026-08-25",
      "proposed_start_time": "14:00",
      "proposed_duration_minutes": 60,
      "status": "pending",
      "organizer_id": "user_id_1",
      "invitee_id": "user_id_2",
      "meet_link": null,
      "created_at": "2026-08-19T10:30:00Z",
      "other_participant": {
        "id": "user_id_2",
        "name": "John Doe",
        "email": "john@example.com",
        "company_name": "Acme Corp"
      }
    }
  ],
  "current_page": 1,
  "per_page": 15,
  "total": 42,
  "total_pages": 3,
  "next_page": 2,
  "prev_page": null
}
```

---

### 3. Get Meeting Details

**Endpoint:** `GET /api/meetings/{id}`

**Who can call:** Meeting participants (organizer or invitee)

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "organizer_id": "user_id_1",
  "invitee_id": "user_id_2",
  "title": "Initial Interview",
  "meeting_type": "video_call",
  "proposed_date": "2026-08-25",
  "proposed_start_time": "14:00",
  "proposed_duration_minutes": 60,
  "status": "accepted",
  "location_or_link": null,
  "meet_link": "https://meet.google.com/abc-defg-hij",
  "google_calendar_event_id": "event123",
  "decline_reason": null,
  "cancellation_reason": null,
  "notes": [
    {
      "author_id": "user_id_1",
      "content": "Please review the job description before the call.",
      "created_at": "2026-08-20T09:00:00Z"
    }
  ],
  "previous_schedules": [],
  "created_at": "2026-08-19T10:30:00Z",
  "updated_at": "2026-08-20T11:00:00Z",
  "other_participant": {
    "id": "user_id_2",
    "name": "John Doe",
    "email": "john@example.com",
    "company_name": "Acme Corp"
  }
}
```

---

### 4. Accept Meeting Invitation

**Endpoint:** `POST /api/meetings/{id}/accept`

**Who can call:** Invitee only

**Request Body (optional):**
```json
{
  "meet_link": "https://zoom.us/j/123456789 (optional, max 500 chars)"
}
```

**Response:** `200 OK`
```json
{
  "meeting": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "accepted",
    "meet_link": "https://meet.google.com/abc-defg-hij",
    "updated_at": "2026-08-20T11:00:00Z"
  },
  "organizer_conflicts": [],
  "invitee_conflicts": []
}
```

**Notes:**
- For `video_call` type: Google Meet link is auto-generated if organizer has Google connected
- If organizer doesn't have Google connected, invitee can provide manual `meet_link`
- Conflicts are informational warnings

---

### 5. Decline Meeting Invitation

**Endpoint:** `POST /api/meetings/{id}/decline`

**Who can call:** Invitee only

**Request Body (optional):**
```json
{
  "decline_reason": "string (optional, max 500 chars)"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "declined",
  "decline_reason": "Schedule conflict",
  "updated_at": "2026-08-20T11:00:00Z"
}
```

---

### 6. Cancel Meeting

**Endpoint:** `POST /api/meetings/{id}/cancel`

**Who can call:** 
- Organizer (any status except completed/declined/cancelled)
- Invitee (accepted or rescheduled status only)

**Request Body (optional):**
```json
{
  "cancellation_reason": "string (optional, max 500 chars)"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "cancelled",
  "cancellation_reason": "Emergency came up",
  "cancelled_by": "user_id_1",
  "updated_at": "2026-08-20T11:00:00Z"
}
```

**Notes:**
- If Google Calendar event exists, it's automatically deleted
- Invitee cannot cancel a `pending` meeting — must use decline instead

---

### 7. Reschedule Meeting

**Endpoint:** `POST /api/meetings/{id}/reschedule`

**Who can call:** Organizer only

**Request Body:**
```json
{
  "proposed_date": "YYYY-MM-DD (required, future date)",
  "proposed_start_time": "HH:MM (required)",
  "proposed_duration_minutes": "integer (required, 15-480)"
}
```

**Response:** `200 OK`
```json
{
  "meeting": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "rescheduled",
    "proposed_date": "2026-08-26",
    "proposed_start_time": "10:00",
    "proposed_duration_minutes": 45,
    "previous_schedules": [
      {
        "proposed_date": "2026-08-25",
        "proposed_start_time": "14:00",
        "proposed_duration_minutes": 60
      }
    ],
    "updated_at": "2026-08-20T11:00:00Z"
  },
  "organizer_conflicts": [],
  "invitee_conflicts": []
}
```

**Notes:**
- Original schedule is saved in `previous_schedules` array
- Invitee must accept/decline the rescheduled meeting again
- If Google Calendar event exists, it's automatically updated

---

### 8. Mark Meeting as Completed

**Endpoint:** `POST /api/meetings/{id}/complete`

**Who can call:** Organizer only

**Request Body:** None

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "completed",
  "updated_at": "2026-08-26T11:00:00Z"
}
```

**Rules:**
- Meeting must be in `accepted` status
- `proposed_date` must be in the past

---

### 9. Add Note to Meeting

**Endpoint:** `POST /api/meetings/{id}/notes`

**Who can call:** Meeting participants (organizer or invitee)

**Request Body:**
```json
{
  "content": "string (required, non-empty, max 2000 chars)"
}
```

**Response:** `201 Created`
```json
{
  "note": {
    "author_id": "user_id_1",
    "content": "Please bring your portfolio.",
    "created_at": "2026-08-20T09:00:00Z"
  }
}
```

---

### 10. Upcoming Meetings Summary

**Endpoint:** `GET /api/meetings/upcoming`

**Who can call:** Any authenticated user

**Response:** `200 OK`
```json
[
  {
    "title": "Technical Interview",
    "meeting_type": "video_call",
    "proposed_date": "2026-08-25",
    "proposed_start_time": "14:00",
    "proposed_duration_minutes": 60,
    "other_participant": {
      "name": "John Doe",
      "company_name": "Acme Corp"
    }
  }
]
```

**Notes:**
- Returns up to 5 upcoming accepted meetings
- Only includes meetings with `proposed_date` in the future
- Sorted by date/time ascending

---

### 11. Google OAuth - Connect Account

**Endpoint:** `GET /api/google/connect`

**Who can call:** Any authenticated user

**Response:** `200 OK`
```json
{
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

**Implementation:**
1. Call this endpoint to get the Google OAuth URL
2. Redirect user to the `auth_url` in a new window/tab
3. Google redirects back to `/api/google/callback` (handled by backend)
4. Check connection status via `/api/google/status`

---

### 12. Google OAuth - Connection Status

**Endpoint:** `GET /api/google/status`

**Who can call:** Any authenticated user

**Response:** `200 OK`
```json
{
  "connected": true,
  "email": "user@gmail.com"
}
```

or

```json
{
  "connected": false
}
```

---

### 13. Google OAuth - Disconnect

**Endpoint:** `DELETE /api/google/disconnect`

**Who can call:** Any authenticated user

**Response:** `200 OK`
```json
{
  "message": "Google account disconnected successfully"
}
```

---

### 14. Admin - List All Meetings

**Endpoint:** `GET /api/admin/meetings`

**Who can call:** Admin only

**Query Parameters:** Same as regular meeting list

**Response:** Same format as regular meeting list, but includes all platform meetings

---

### 15. Admin - View Meeting Details

**Endpoint:** `GET /api/admin/meetings/{id}`

**Who can call:** Admin only

**Response:** Same format as regular meeting detail

---

## Request/Response Examples

### Example 1: Create In-Person Interview

**Request:**
```http
POST /api/meetings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "invitee_id": "66c1234567890abcdef12345",
  "title": "On-site Technical Interview",
  "meeting_type": "in_person",
  "proposed_date": "2026-08-30",
  "proposed_start_time": "09:00",
  "proposed_duration_minutes": 120,
  "location_or_link": "123 Main St, Building A, 5th Floor, Conference Room 2"
}
```

**Response:**
```json
{
  "meeting": {
    "_id": "66c9876543210fedcba09876",
    "organizer_id": "66c1111111111111111111",
    "invitee_id": "66c1234567890abcdef12345",
    "title": "On-site Technical Interview",
    "meeting_type": "in_person",
    "proposed_date": "2026-08-30",
    "proposed_start_time": "09:00",
    "proposed_duration_minutes": 120,
    "status": "pending",
    "location_or_link": "123 Main St, Building A, 5th Floor, Conference Room 2",
    "meet_link": null,
    "notes": [],
    "previous_schedules": [],
    "created_at": "2026-08-19T15:30:00Z",
    "updated_at": "2026-08-19T15:30:00Z"
  },
  "organizer_conflicts": [],
  "invitee_conflicts": []
}
```

---

### Example 2: Accept Video Call (Auto Google Meet)

**Request:**
```http
POST /api/meetings/66c9876543210fedcba09876/accept
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response (Google Connected):**
```json
{
  "meeting": {
    "_id": "66c9876543210fedcba09876",
    "status": "accepted",
    "meet_link": "https://meet.google.com/xyz-abcd-efg",
    "google_calendar_event_id": "abc123def456",
    "updated_at": "2026-08-20T11:00:00Z"
  },
  "organizer_conflicts": [],
  "invitee_conflicts": []
}
```

**Response (Google Not Connected):**
```json
{
  "meeting": {
    "_id": "66c9876543210fedcba09876",
    "status": "accepted",
    "meet_link": null,
    "updated_at": "2026-08-20T11:00:00Z"
  },
  "google_meet_warning": "Organizer has not connected Google account. Meeting link must be provided manually.",
  "organizer_conflicts": [],
  "invitee_conflicts": []
}
```

---

### Example 3: Reschedule with Conflict Warning

**Request:**
```http
POST /api/meetings/66c9876543210fedcba09876/reschedule
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "proposed_date": "2026-08-31",
  "proposed_start_time": "14:00",
  "proposed_duration_minutes": 60
}
```

**Response:**
```json
{
  "meeting": {
    "_id": "66c9876543210fedcba09876",
    "status": "rescheduled",
    "proposed_date": "2026-08-31",
    "proposed_start_time": "14:00",
    "proposed_duration_minutes": 60,
    "previous_schedules": [
      {
        "proposed_date": "2026-08-30",
        "proposed_start_time": "09:00",
        "proposed_duration_minutes": 120
      }
    ],
    "updated_at": "2026-08-20T16:00:00Z"
  },
  "organizer_conflicts": [],
  "invitee_conflicts": [
    {
      "id": "66c1122334455667788990",
      "proposed_date": "2026-08-31",
      "proposed_start_time": "13:30",
      "proposed_duration_minutes": 90
    }
  ]
}
```

---

## Implementation Workflow

### Step 1: Authentication Setup

1. Implement login flow: `POST /api/auth/login`
2. Store JWT token (localStorage or secure cookie)
3. Add token to all API requests in `Authorization` header
4. Handle 401 errors by redirecting to login

---

### Step 2: Meeting List View

1. Call `GET /api/meetings?status=pending,accepted&sort_direction=asc`
2. Display meetings in a calendar or list view
3. Show participant name, title, date/time, status
4. Add filters for status and date range
5. Implement pagination controls

**UI Components:**
- Meeting card/row: title, participant, date/time, status badge
- Filter dropdowns: status (multi-select), date range picker
- Pagination: previous/next buttons, page numbers

---

### Step 3: Create Meeting Flow

1. Show "Schedule Meeting" button
2. Open modal/form with fields:
   - Invitee selector (search job seekers/employers)
   - Title input
   - Meeting type selector (radio/dropdown)
   - Date picker (disable past dates)
   - Time picker
   - Duration selector (dropdown: 15, 30, 45, 60, 90, 120 min)
   - Location/Link input (conditional: show only for in_person/phone_call)
3. On submit: `POST /api/meetings`
4. Show conflict warnings if present (don't block)
5. Close modal, refresh meeting list

**Validation Rules:**
- Title: 1-255 characters
- Date: Must be in future
- Duration: 15-480 minutes
- Location: Max 500 characters (optional)

---

### Step 4: Meeting Detail View

1. Click meeting from list → navigate to detail page
2. Call `GET /api/meetings/{id}`
3. Display:
   - Full meeting info
   - Participant profile
   - Status badge
   - Action buttons (context-dependent)
   - Notes section
   - Reschedule history (if applicable)

**Action Buttons (conditional):**
- **Pending + I'm invitee**: Accept, Decline
- **Pending + I'm organizer**: Cancel, Reschedule
- **Accepted + I'm organizer**: Cancel, Reschedule, Complete (if past)
- **Accepted + I'm invitee**: Cancel
- **Rescheduled + I'm invitee**: Accept, Decline
- **Any participant**: Add Note

---

### Step 5: Meeting Actions

**Accept:**
1. Button: "Accept"
2. If `meeting_type === 'video_call'`, show optional "Manual Link" input
3. On click: `POST /api/meetings/{id}/accept`
4. Show success message
5. If `meet_link` in response, display it prominently
6. Refresh meeting detail

**Decline:**
1. Button: "Decline"
2. Show optional reason textarea (max 500 chars)
3. On click: `POST /api/meetings/{id}/decline`
4. Show success message, refresh detail

**Cancel:**
1. Button: "Cancel Meeting"
2. Show confirmation modal with optional reason textarea
3. On confirm: `POST /api/meetings/{id}/cancel`
4. Show success message, refresh detail

**Reschedule:**
1. Button: "Reschedule"
2. Show modal with date/time/duration inputs
3. On submit: `POST /api/meetings/{id}/reschedule`
4. Show conflict warnings if present
5. Show success message, refresh detail

**Complete:**
1. Button: "Mark as Completed" (only visible if accepted + date in past)
2. On click: `POST /api/meetings/{id}/complete`
3. Show success message, refresh detail

**Add Note:**
1. Show note input area at bottom of detail view
2. Textarea (max 2000 chars)
3. On submit: `POST /api/meetings/{id}/notes`
4. Append note to list immediately

---

### Step 6: Upcoming Meetings Widget

1. Call `GET /api/meetings/upcoming` on dashboard/home page
2. Display compact list (up to 5 items)
3. Show: title, participant, date/time
4. Link each item to meeting detail

**UI Suggestion:**
- Sidebar widget or dashboard card
- "Next 5 Meetings" heading
- Empty state: "No upcoming meetings"

---

### Step 7: Google Meet Integration

**Connection Flow:**
1. Show "Connect Google Calendar" button in settings
2. On click: Call `GET /api/google/connect`
3. Open `auth_url` in popup window: `window.open(auth_url, 'Google OAuth', 'width=500,height=600')`
4. After redirect completes (callback handled by backend), close popup
5. Call `GET /api/google/status` to verify connection
6. Show "Connected" badge + "Disconnect" button

**Disconnect:**
1. Button: "Disconnect Google"
2. On click: `DELETE /api/google/disconnect`
3. Update UI to show "Not Connected"

**Video Call UX:**
- When creating `video_call` meeting, show info tooltip: "Google Meet link will be auto-generated if you have Google connected"
- When accepting `video_call` without Google connected, show input: "Meeting link (optional)"
- Display `meet_link` prominently if present (clickable link)

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Process response |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show "You don't have permission" message |
| 404 | Not Found | Show "Meeting not found" message |
| 422 | Validation Error | Display field errors |
| 500 | Server Error | Show generic error, log details |

---

### Validation Errors (422)

**Response Format:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["The title field is required."],
    "proposed_date": ["The proposed date must be a future date."],
    "proposed_duration_minutes": ["The proposed duration minutes must be between 15 and 480."]
  }
}
```

**UI Handling:**
- Display errors below each field
- Highlight invalid fields in red
- Show summary message at top: "Please fix the errors below"

---

### Business Logic Errors (422)

**Response Format:**
```json
{
  "message": "Meeting cannot be cancelled in its current state."
}
```

**UI Handling:**
- Show error message in toast/snackbar
- Optionally refresh data to reflect current state

---

### Conflict Warnings

**Response Format:**
```json
{
  "meeting": { ... },
  "organizer_conflicts": [
    {
      "id": "66c1122334455667788990",
      "proposed_date": "2026-08-31",
      "proposed_start_time": "13:30",
      "proposed_duration_minutes": 90
    }
  ],
  "invitee_conflicts": []
}
```

**UI Handling:**
- Show warning banner: "⚠️ You have a scheduling conflict with another meeting"
- List conflicting meetings with times
- Allow user to proceed anyway (conflicts are non-blocking)

---

## Google Meet Integration

### Connection Status Display

**Component:** Settings or Profile page

```jsx
// Pseudo-code
function GoogleIntegrationStatus() {
  const { data } = useFetch('/api/google/status');
  
  if (data.connected) {
    return (
      <div>
        <span>✓ Google Calendar Connected</span>
        <span>{data.email}</span>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }
  
  return <button onClick={initiateConnect}>Connect Google Calendar</button>;
}
```

---

### OAuth Flow

```javascript
async function initiateConnect() {
  const response = await fetch('/api/google/connect', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { auth_url } = await response.json();
  
  // Open popup
  const popup = window.open(auth_url, 'Google OAuth', 'width=500,height=600');
  
  // Poll for completion
  const interval = setInterval(async () => {
    try {
      const status = await fetch('/api/google/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const { connected } = await status.json();
      
      if (connected) {
        clearInterval(interval);
        popup.close();
        // Update UI to show connected state
        showSuccessMessage('Google Calendar connected!');
      }
    } catch (error) {
      // Popup might be closed by user
      clearInterval(interval);
    }
  }, 1000);
}
```

---

### Video Call Meeting Display

```jsx
function MeetingDetail({ meeting }) {
  if (meeting.meeting_type === 'video_call' && meeting.meet_link) {
    return (
      <div>
        <h3>Video Call</h3>
        <a href={meeting.meet_link} target="_blank" className="button-primary">
          Join Google Meet
        </a>
      </div>
    );
  }
  
  if (meeting.meeting_type === 'video_call' && !meeting.meet_link && meeting.status === 'accepted') {
    return (
      <div className="warning">
        <p>⚠️ No meeting link available. Organizer hasn't connected Google Calendar.</p>
      </div>
    );
  }
  
  // ... other meeting types
}
```

---

## Best Practices

### 1. Polling for Updates
- Don't poll aggressively — use WebSockets or long polling if available
- For simple case: refresh meeting list every 30-60 seconds when page is active
- Stop polling when user navigates away

### 2. Optimistic Updates
- When user performs action (accept, cancel), update UI immediately
- If API call fails, revert UI and show error
- Always refresh from server after action completes

### 3. Date/Time Handling
- Store dates in UTC, display in user's timezone
- Use libraries like `date-fns` or `luxon` for formatting
- Show relative times: "in 2 hours", "tomorrow at 2:00 PM"

### 4. Validation
- Validate on frontend before API call (better UX)
- Always handle backend validation errors (source of truth)
- Disable submit buttons during API calls

### 5. Accessibility
- Use semantic HTML: `<time>`, `<button>`, `<a>`
- Provide ARIA labels for screen readers
- Ensure keyboard navigation works
- Use sufficient color contrast for status badges

---

## Testing Checklist

### As Employer:
- [ ] Create meeting with job seeker
- [ ] Accept invitation from job seeker
- [ ] Decline invitation from job seeker
- [ ] Cancel pending meeting
- [ ] Cancel accepted meeting
- [ ] Reschedule pending meeting
- [ ] Reschedule accepted meeting
- [ ] Mark completed meeting
- [ ] Add notes to meeting
- [ ] View upcoming meetings
- [ ] Filter meetings by status
- [ ] Connect Google account
- [ ] Create video call (Google connected)
- [ ] Disconnect Google account

### As Job Seeker:
- [ ] Create meeting with employer
- [ ] Accept invitation from employer
- [ ] Decline invitation from employer
- [ ] Cancel accepted meeting
- [ ] Add notes to meeting
- [ ] View upcoming meetings
- [ ] Filter meetings by status

### Admin:
- [ ] View all meetings
- [ ] View any meeting details

### Edge Cases:
- [ ] Accept video call without Google connected
- [ ] Accept video call with manual link
- [ ] Reschedule with conflicts (see warning)
- [ ] Try to complete future meeting (should fail)
- [ ] Try to cancel already cancelled meeting (should fail)
- [ ] Try to accept someone else's invitation (should fail)
- [ ] View meeting list with no results
- [ ] Page through large meeting list

---

## FAQ

**Q: Can I cancel a pending meeting as invitee?**
A: No. Invitees must use "Decline" for pending meetings. "Cancel" is only for accepted/rescheduled meetings.

**Q: What if Google Meet link generation fails?**
A: The meeting is still accepted successfully. The `meet_link` field will be null and a warning is included in the response. Users can manually add a link later.

**Q: Do conflicts prevent meeting creation?**
A: No. Conflicts are returned as warnings in the response, but the meeting is always created successfully.

**Q: Can I edit a meeting after creation?**
A: Not directly. Use "Reschedule" to change date/time/duration. Other fields (title, type, location) cannot be edited — cancel and create new meeting instead.

**Q: How do I know if someone cancelled vs declined?**
A: Check the `status` field: `declined` means invitee rejected the invitation, `cancelled` means either party cancelled an accepted/pending meeting. The `cancelled_by` field shows who cancelled.

**Q: Can I add multiple notes?**
A: Yes. Each note is appended to the `notes` array with author and timestamp.

**Q: What happens to Google Calendar event when meeting is rescheduled?**
A: The event is automatically updated with new date/time if `google_calendar_event_id` exists.

**Q: Can job seekers send meetings to other job seekers?**
A: No. Meetings are only between employer ↔ job seeker roles.

---

## Support

For backend API issues, refer to:
- Requirements: `.kiro/specs/meetings/requirements.md`
- Design: `.kiro/specs/meetings/design.md`

For feature requests or bugs, contact the backend team.
