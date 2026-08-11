# Notifications Feature Guide

## Overview

The notifications feature provides real-time in-app notifications for all authenticated users (employee, employer, admin). Users can view, manage, and mark notifications as read through a dropdown popover in the navbar.

## Architecture

### API Layer
Location: `apis/services/notifications/`

**Files:**
- `interface.ts` - TypeScript interfaces for requests/responses
- `index.ts` - Repository methods for API calls
- `actions.ts` - Server actions with Zod validation

**Endpoints:**
- `GET /notifications` - Get paginated list of notifications
- `GET /notifications/unread-count` - Get unread notifications count
- `POST /notifications/read-all` - Mark all notifications as read
- `POST /notifications/{id}/read` - Mark single notification as read

### Components
Location: `components/notifications/`

**NotificationsPopover.tsx**
- Main notification dropdown component
- Handles fetching and display of notifications
- Implements infinite scroll pagination
- Manages unread count badge
- Auto-refreshes unread count every 30 seconds

**NotificationItem.tsx**
- Individual notification list item
- Displays notification type, message, and timestamp
- Shows unread indicator
- Handles click to mark as read

### Translations
Location: `messages/{locale}/notifications.json`

**Supported Languages:**
- English (`en`)
- Arabic (`ar`)

**Translation Keys:**
- `title` - Popover title
- `empty` - Empty state messages
- `markAllAsRead` - Mark all button text
- `timeAgo.*` - Relative time formats
- `types.*` - Notification type labels
- `messages.*` - Success/error messages

### Custom Hooks
Location: `hooks/use-notifications.ts`

**useNotificationsTranslations()**
- Pre-configured hook for notifications namespace
- Returns translation function for notifications

### Utilities
Location: `utils/timeAgo.ts`

**getTimeAgo(dateString)**
- Formats ISO date string to relative time
- Returns type and value for translation
- Supports: justNow, minutesAgo, hoursAgo, daysAgo, weeksAgo, monthsAgo, yearsAgo

## Data Structure

### Notification Object
```typescript
{
  id: string;                    // Unique notification ID
  type: string;                  // Notification type (e.g., "application_status_changed")
  message: string;               // Notification message text
  read_at: string | null;        // Timestamp when read (null if unread)
  related_entity_id: string;     // ID of related entity
  related_entity_type: string;   // Type of related entity (e.g., "Application")
  created_at: string;            // ISO timestamp of creation
}
```

### Notification Types
- `application_status_changed` - Application status updated
- `new_job_match` - New job matches user profile
- `interview_scheduled` - Interview appointment scheduled
- `offer_received` - Job offer received
- `message_received` - New message in inbox
- `profile_viewed` - Profile viewed by employer
- `default` - Generic notification

## Features

### Unread Count Badge
- Displays count of unread notifications
- Shows "99+" for counts over 99
- Auto-updates every 30 seconds
- Updates immediately after marking as read

### Infinite Scroll
- Loads 15 notifications per page
- Automatically loads more on scroll to bottom
- Shows loading indicator while fetching
- Displays "no more" message when all loaded

### Mark as Read
- **Single:** Click notification to mark as read
- **All:** Click "Mark all as read" button in header
- Updates local state immediately
- Revalidates server cache

### Empty State
- Displays when no notifications exist
- Shows friendly message and description
- Uses Ant Design Empty component

### Time Formatting
- Shows relative time (e.g., "2h ago", "3d ago")
- Supports multiple languages
- Handles edge cases (just now, years ago)

### Theme Support
- Follows global theme (light/dark)
- Uses semantic color tokens
- Unread notifications highlighted with blue tint
- Smooth transitions on theme change

### RTL Support
- Fully supports Arabic RTL layout
- All UI elements properly mirrored
- Icons positioned correctly

## UI/UX Patterns

### Popover Design
- Width: 400px (max 90vw for mobile)
- Max height: 500px with scroll
- Positioned bottom-right of bell icon
- Dismisses on outside click

### Visual Indicators
- **Unread:** Blue background tint + blue dot
- **Read:** Normal background + no dot
- **Loading:** Centered spinner
- **Empty:** Ant Design empty state

### Interactions
- **Click bell:** Open/close popover
- **Click notification:** Mark as read (if unread)
- **Scroll to bottom:** Load more notifications
- **Click "Mark all":** Mark all as read

### Colors (Theme-Aware)
- Primary: Blue (#2563eb in light, #3b82f6 in dark)
- Success: Green (#22c55e in light, #4ade80 in dark)
- Destructive: Red (#ef4444 in light, #f87171 in dark)
- Warning: Orange/Yellow
- Muted: Gray variants

## Server Actions

### getNotificationsAction
```typescript
getNotificationsAction({
  page?: number;      // Page number (default: 1)
  per_page?: number;  // Items per page (default: 15, max: 50)
})
```

### getUnreadCountAction
```typescript
getUnreadCountAction()
// Returns: { unread_count: number }
```

### markAllAsReadAction
```typescript
markAllAsReadAction()
// Returns: { success: boolean, message: string }
```

### markAsReadAction
```typescript
markAsReadAction({
  notificationId: string;  // Notification ID
})
// Returns: { success: boolean, message: string }
```

## Integration

### Navbar Integration
The notification bell icon is added to the navbar in `components/navbar/navbar-actions.tsx`:

```tsx
{isAuthenticated && <NotificationsPopover />}
```

**Positioning:**
- Appears only for authenticated users
- Positioned between locale switcher and logout button
- Consistently styled with other navbar icons

### Cache Management
- **Tags:** `notifications-list`, `notifications-unread-count`
- **Revalidation:** 60s for list, 30s for count
- **Manual Revalidation:** After mark as read actions

### Error Handling
- All API errors caught and logged
- User-friendly toast notifications
- Graceful fallback to empty state

## Best Practices

### Performance
- ✅ Lazy load notifications (only on popover open)
- ✅ Paginate with infinite scroll
- ✅ Auto-refresh count (not full list)
- ✅ Cache API responses
- ✅ Debounce scroll events

### Accessibility
- ✅ Keyboard navigation support (via Ant Design)
- ✅ ARIA labels on interactive elements
- ✅ Screen reader friendly
- ✅ Focus management

### User Experience
- ✅ Immediate visual feedback
- ✅ Optimistic UI updates
- ✅ Clear loading states
- ✅ Helpful empty states
- ✅ Smooth animations

### Code Quality
- ✅ TypeScript for type safety
- ✅ Proper error handling
- ✅ JSDoc comments
- ✅ Consistent naming conventions
- ✅ Follows project patterns

## Future Enhancements

### Potential Features
- [ ] Push notifications via WebSockets
- [ ] Notification preferences/settings
- [ ] Filter by notification type
- [ ] Search notifications
- [ ] Delete individual notifications
- [ ] Group notifications by date
- [ ] Click to navigate to related entity
- [ ] Desktop browser notifications
- [ ] Sound on new notification
- [ ] Notification history page

### Navigation to Related Entities
To implement navigation when clicking notifications:

```typescript
const handleNotificationClick = async (notification: INotification) => {
  // Mark as read first
  if (!notification.read_at) {
    await markAsRead(notification.id);
  }

  // Navigate based on entity type
  switch (notification.related_entity_type) {
    case "Application":
      router.push(`/applications/${notification.related_entity_id}`);
      break;
    case "Job":
      router.push(`/jobs/${notification.related_entity_id}`);
      break;
    case "Message":
      router.push(`/messages/${notification.related_entity_id}`);
      break;
    // Add more cases as needed
  }
  
  setIsOpen(false);
};
```

## Testing

### Manual Testing Checklist
- [ ] Bell icon appears for authenticated users
- [ ] Badge shows correct unread count
- [ ] Popover opens/closes correctly
- [ ] Notifications load on open
- [ ] Infinite scroll works
- [ ] Mark single as read works
- [ ] Mark all as read works
- [ ] Empty state displays correctly
- [ ] Loading states appear
- [ ] Time formatting is correct
- [ ] Both themes work (light/dark)
- [ ] Both languages work (en/ar)
- [ ] RTL layout correct for Arabic
- [ ] Mobile responsive
- [ ] Error handling works

### Test Scenarios
1. **No notifications:** Should show empty state
2. **Few notifications:** Should display without scroll
3. **Many notifications:** Should enable scroll and pagination
4. **All read:** Badge should not appear
5. **Mix read/unread:** Badge shows unread count only
6. **Mark all:** All should update to read immediately
7. **Network error:** Should show error toast
8. **Slow connection:** Should show loading states

## Troubleshooting

### Badge not showing
- Check if unread_count > 0
- Verify getUnreadCountAction is being called
- Check authentication status

### Notifications not loading
- Verify API endpoints are correct
- Check authentication token
- Review console for errors
- Verify repository methods

### Infinite scroll not working
- Check hasMore state
- Verify scroll event handler attached
- Review pagination logic
- Check API response structure

### Translations missing
- Verify translation files exist for both locales
- Check i18n types are updated
- Verify translation keys match usage
- Review useTranslations namespace

