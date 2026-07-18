# Talents Search Feature Implementation

## Overview
Implemented a comprehensive talents/workers search page for employee role users with advanced filtering, pagination, and detailed talent profiles.

## What Was Created

### 1. API Integration

**New Service**: `apis/services/search/`

**File**: `apis/services/search/interface.ts`
- `TalentSearchFilters` interface for search parameters
- `Talent` interface for talent data structure
- `Skill`, `Education`, `WorkExperience`, `SocialLinks` supporting interfaces
- `TalentSearchResponse` interface for paginated API response

**File**: `apis/services/search/index.ts`
- Created `searchRepository` with `searchTalents()` method
- Endpoint: `/search/users`
- Supports comprehensive filtering with multiple parameters

### 2. Routes Configuration

**File**: `constants/routes.ts`
- Added `TALENTS` routes object:
  - `LIST: "/talents"`
  - `DETAIL: "/talents/:id"`
  - `getDetail()` helper function
- Added "Talents" link to `NAVBAR_LINKS` for employee role
- Link is public (authRequired: false) but only visible to employees

### 3. Components

**Directory**: `components/talents/`

#### TalentsFilters.tsx
Comprehensive filter component with:
- Search input (name, title, summary)
- Skills input (comma-separated, partial match)
- Location input (partial match)
- Job level dropdown (entry/junior/mid/senior/lead/executive)
- Experience range slider (0-20 years)
- ATS score range slider (0-100)
- Actively seeking checkbox
- Apply & Reset buttons
- Sticky sidebar positioning

#### TalentCard.tsx
Talent display card with:
- Profile image or placeholder
- Full name and current job title
- Location, experience, education level
- Salary range display
- Job roles badges (max 5 visible)
- Skills badges (max 4 visible)
- Experience summary (2-line clamp)
- Social links (LinkedIn, GitHub, Portfolio)
- "Actively Seeking" badge
- Clickable card linking to talent detail page

#### TalentsClient.tsx
Main orchestration component:
- State management for talents, filters, loading, pagination
- API integration with searchRepository
- Filter change handling
- Pagination with smooth scroll to top
- Loading states with spinner
- Empty states with helpful messaging
- Results count display
- Responsive layout with sidebar + main content

### 4. Page

**File**: `app/(website)/talents/page.tsx`
- Route at `/talents`
- Integrates TalentsClient component
- SEO metadata for search engines
- Server component wrapper

### 5. Translations

**Files Created**:
- `messages/en/talents.json` - English translations
- `messages/ar/talents.json` - Arabic translations (RTL support)

**Translation Keys**:
```json
{
  "pageTitle": "Page title",
  "pageDescription": "Page description",
  "filters": { /* All filter labels and hints */ },
  "card": { /* Card display labels */ },
  "resultsCount": "Results count message",
  "noResults": { /* Empty state messages */ },
  "errors": { /* Error messages */ }
}
```

**Hook Updated**: `hooks/use-translations.ts`
- Added `useTalentsTranslations()` helper function

### 6. Index Exports

**File**: `components/talents/index.ts`
- Exports for TalentsClient, TalentsFilters, TalentCard
- Enables clean imports from feature directory

## API Endpoint Details

### Endpoint: `/search/users`

**Method**: GET (with authentication)

**Query Parameters**:
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| search | string | General search (name/title/summary) | "React Developer" |
| skills | string | Comma-separated skills list | "React,TypeScript,Node.js" |
| min_experience | integer | Minimum years of experience | 3 |
| max_experience | integer | Maximum years of experience | 10 |
| min_ats_score | integer | Minimum ATS score (0-100) | 70 |
| max_ats_score | integer | Maximum ATS score (0-100) | 95 |
| location | string | Location search (partial match) | "Beirut" |
| job_level | string | Job level filter | "senior" |
| actively_seeking | boolean | Filter by active seeking status | true |
| per_page | integer | Results per page (max 100, default 15) | 10 |
| page | integer | Page number | 1 |

**Response Structure**:
```typescript
{
  data: Talent[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}
```

## Features

### Advanced Search & Filtering
- **Text Search**: Search by name, current title, or experience summary
- **Skills Filter**: Comma-separated skills with partial matching
- **Location Filter**: Partial match on location field
- **Job Level**: Filter by experience level (entry to executive)
- **Experience Range**: Slider for min/max years (0-20)
- **ATS Score Range**: Slider for applicant tracking score (0-100)
- **Active Seeking**: Toggle for actively seeking candidates only

### UI/UX Features
- **Responsive Design**: Sidebar filters + main content grid
- **Loading States**: Spinner during data fetch
- **Empty States**: Helpful message when no results
- **Pagination**: Full pagination with page size control
- **Smooth Scroll**: Auto-scroll to top on page change
- **Sticky Sidebar**: Filters stay visible while scrolling
- **Badge Overflow**: Shows "+N more" for skills/roles overflow
- **Social Links**: Direct links to LinkedIn, GitHub, Portfolio
- **Status Indicators**: Visual badge for actively seeking talents

### Card Information Display
- Profile photo or default avatar
- Full name and current job title
- Location (city + region)
- Years of experience
- Education level
- Expected salary range
- Job roles (with overflow handling)
- Top skills (with overflow handling)
- Experience summary preview
- Social media links
- Active seeking status

## Navigation & Access Control

### Navbar Integration
- "Talents" link visible to employee role users
- Public access (no authentication required)
- Only shown to employees (not employers)
- Active state highlighting on current page

### Link Position
Appears in navbar between:
- "Companies" (before)
- "Profile" (after)

## Reused Components
- `Typography` - Text components
- `ReusableBadge` - Tag/badge display
- `ReusableButton` - Action buttons
- `ReusableInput` - Text inputs with icons
- `ReusableSelect` - Dropdown selections
- `ReusablePagination` - Pagination controls
- Ant Design `Slider` - Range sliders

## File Structure
```
apis/services/search/
├── interface.ts (NEW)
└── index.ts (NEW)

components/talents/
├── TalentsClient.tsx (NEW)
├── TalentsFilters.tsx (NEW)
├── TalentCard.tsx (NEW)
└── index.ts (NEW)

app/(website)/talents/
└── page.tsx (NEW)

constants/
└── routes.ts (UPDATED)

hooks/
└── use-translations.ts (UPDATED)

messages/
├── en/talents.json (NEW)
└── ar/talents.json (NEW)
```

## Usage

### For Employees
1. Navigate to "Talents" from navbar
2. Use sidebar filters to refine search
3. Enter skills, location, experience criteria
4. Click "Apply Filters" to search
5. Browse paginated results
6. Click on talent card to view full profile

### For Developers
```typescript
// Import and use the search API
import { searchRepository } from '@/apis/services/search';

const response = await searchRepository.searchTalents({
  search: 'React Developer',
  skills: 'React,TypeScript',
  location: 'Beirut',
  min_experience: 3,
  max_experience: 10,
  actively_seeking: true,
  page: 1,
  per_page: 15
});
```

## Testing Checklist
- [ ] Page loads at `/talents`
- [ ] Navbar link appears for employees
- [ ] Filters apply correctly
- [ ] Search returns relevant results
- [ ] Pagination works properly
- [ ] Cards display all information
- [ ] Social links open in new tabs
- [ ] Empty state shows when no results
- [ ] Loading spinner appears during fetch
- [ ] Responsive on mobile/tablet/desktop
- [ ] Translations work (EN/AR)
- [ ] RTL layout correct for Arabic
- [ ] Reset button clears all filters
- [ ] Talent detail link works

## Performance Considerations
- Debouncing not implemented (apply on button click)
- Results cached at API level (no-store mode)
- Default page size: 15 (configurable up to 100)
- Smooth scroll on page change
- Optimized image loading with Next.js Image

## Future Enhancements (Optional)
1. **Save Searches**: Allow users to save filter combinations
2. **Export Results**: Download talent list as CSV/PDF
3. **Bulk Actions**: Select multiple talents for batch operations
4. **Comparison View**: Compare skills/experience side-by-side
5. **Advanced Matching**: AI-powered talent recommendations
6. **Messaging**: Direct messaging to talents
7. **Bookmarks**: Save favorite talents for later review
8. **Notifications**: Alert when new matching talents sign up
9. **Filter Presets**: Quick filters for common searches
10. **Analytics**: Track most searched skills/locations
