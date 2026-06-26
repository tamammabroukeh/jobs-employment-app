# Employer Feature Guide

## Overview

The employer feature allows companies to manage their job postings through a dedicated interface. Employers have a separate role (`employer`) and access to protected routes.

## Routes

### Employer-Specific Routes
- `/manage-jobs` - View all posted jobs (current and archived)
- `/forsa` - Create a new job posting
- `/forsa/[id]` - Edit an existing job posting

### Access Control
- Middleware checks authentication and role for employer routes
- Only users with `role: "employer"` can access these routes
- Unauthenticated users are redirected to login
- Non-employer users are redirected to `/unauthorized`

## User Flow

1. **Login as Employer**: User logs in with employer credentials
   - API returns `roles: ["employer"]` in response
   - Auth config maps "employer" role to session
   - User is redirected to `/manage-jobs` after login

2. **Manage Jobs Page**: Displays employer's job postings
   - Shows empty state with "Add New Job" button when no jobs exist
   - Shows list of jobs with search and filter functionality
   - Each job card has an "Edit" button
   - Tabs for "Current Jobs" and "Archived Jobs"

3. **Create Job (Forsa)**: Multi-section form
   - Communication method selection (by_forsa, by_email, by_website)
   - Communication value (email/website URL) - conditional based on method
   - Employee specification fields (NEW STRUCTURE)
   - Location details (city, address)
   - Salary information (salary_from, salary_to, currency, display_salary, incentives)
   - Job vacancy information (description, requirements, questions, tags, expires_at)

4. **Edit Job**: Pre-filled form with existing job data
   - Submits to `/employer/jobs/{id}` PUT endpoint
   - Returns to manage-jobs after successful update

## API Integration

### Employer API Service
Location: `apis/services/employer/`

**Files:**
- `interface.ts` - TypeScript interfaces for requests/responses
- `actions.ts` - Server actions for create, update, delete, get jobs
- `index.ts` - Barrel exports

**Endpoints:**
- `GET /employer/jobs` - Fetch employer's jobs (with pagination)
- `POST /employer/jobs` - Create new job
- `PUT /employer/jobs/{id}` - Update existing job
- `DELETE /employer/jobs/{id}` - Delete job
- `GET /employer/jobs/{id}` - Get single job details

### Server Actions
All actions use `next-safe-action` for type-safe server actions with Zod validation:
- `createJobAction` - Create job with validation
- `updateJobAction` - Update job with validation
- `deleteJobAction` - Delete job
- `getEmployerJobs` - Fetch jobs for server components
- `getEmployerJob` - Fetch single job for editing

## Data Structure (NEW)

### Create/Update Job Request
```typescript
{
  // Communication
  communication_method: string; // 'by_forsa' | 'by_email' | 'by_website'
  communication_value: string | null; // email or website URL (conditional)
  
  // Basic Info
  title: string;
  category: string;
  
  // Employee Requirements
  roles: string[]; // e.g., ["Frontend", "React"]
  portfolio_required: boolean;
  cover_letter_required: boolean;
  gender: string; // 'no_preference' | 'male' | 'female'
  age_from: number | null;
  age_to: number | null;
  education_level: string; // 'high_school' | 'diploma' | 'bachelor' | 'master' | 'phd'
  job_level: string; // 'junior' | 'mid' | 'senior' | 'lead' | 'manager'
  experience_years: number; // numeric value (not string like before)
  languages: string[]; // e.g., ["English", "Arabic"]
  vacancies: number;
  
  // Job Details
  job_type: string; // 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
  work_mode: string; // 'on_site' | 'remote' | 'hybrid'
  
  // Location
  city: string; // NEW - replaces single 'location' field
  address: string; // NEW - full address
  
  // Salary (NEW STRUCTURE)
  salary_from: string; // NEW - replaces salary_range.min
  salary_to: string; // NEW - replaces salary_range.max
  currency: string;
  display_salary: boolean; // NEW
  incentives: string; // NEW - additional benefits
  
  // Content
  description: string;
  requirements: string;
  questions: Array<{
    question: string;
    required: string; // 'true' | 'false'
  }>;
  tags: string[]; // e.g., ["Laravel", "PHP"]
  
  // Expiry
  expires_at: string; // NEW - Date string (YYYY-MM-DD)
}
```

### REMOVED FIELDS (no longer in API)
- `company_name` - removed
- `company_logo` - removed
- `experience_required` - replaced by `experience_years` (number)
- `experience_level` - replaced by `job_level`
- `location` - split into `city` and `address`
- `salary_range` object - replaced by `salary_from`, `salary_to` flat fields

## Components

### Employer Components
Location: `components/employer/`

**ManageJobsClient.tsx**
- Client component for jobs list page
- Search and filter functionality
- Empty state with illustration
- Job cards with edit actions
- Tabs for current/archived jobs
- **NOTE**: Must be updated to use new Job structure (city/address instead of location, salary_from/salary_to instead of salary_range)

**ForsaForm.tsx**
- Multi-section form for creating/editing jobs
- Communication method selection (by_forsa, by_email, by_website)
- Conditional communication_value input
- All new fields as per API structure
- Form validation with Zod
- Handles both create and edit modes
- Auto-fills data in edit mode
- Converts comma-separated strings to arrays on submit
- Parses questions from textarea format (question|required per line)

## Navigation

### Navbar Integration
- "Manage Jobs" link appears only for employers
- Uses role-based filtering in `navbar-actions.tsx`
- `NAVBAR_LINKS` array includes `roles` property
- Links without roles or with empty roles array are visible to all

### NAVBAR_LINKS Structure
```typescript
{
  label: "Manage Jobs",
  href: ROUTES.EMPLOYER.MANAGE_JOBS,
  showInNavbar: true,
  authRequired: true,
  roles: ["employer"], // Only visible to employers
}
```

## Role Mapping

The authentication system maps API roles to NextAuth roles:

**API Response:**
```json
{
  "user": {
    "roles": ["employer"]
  }
}
```

**Mapped to Session:**
```typescript
session.user.role = "employer"
```

**Role Types:**
- `"admin"` - Admin users
- `"owner"` - Platform owners
- `"employer"` - Company employers (job posters)
- `"employee"` - Job seekers

## Styling & UI

- Uses existing component library (`Reusable-Components`)
- Follows Tailwind CSS conventions
- Uses Ant Design for complex UI elements (Select, TextArea)
- Empty state uses custom SVG illustration at `/images/no-jobs.svg`
- Form follows multi-section card layout pattern

## Error Handling

- Server actions throw errors caught by safe-action
- Toast notifications for success/error states
- Form validation with Zod schemas
- API errors handled by `FetchError` class

## Security

- All employer routes protected by middleware
- Server actions verify authentication and role
- Bearer token authentication for API calls
- Session-based authorization checks

## Form Field Mapping

### Section 1: Communication Method
- `communication_method` - Radio buttons styled as cards
- `communication_value` - Input (conditional based on method)

### Section 2: Employee Specification
- `title` - Text input
- `category` - Select dropdown
- `roles` - Text input (comma-separated, converted to array)
- `portfolio_required` - Checkbox
- `cover_letter_required` - Checkbox
- `gender` - Select dropdown
- `age_from` - Number input
- `age_to` - Number input
- `education_level` - Select dropdown
- `job_level` - Select dropdown
- `experience_years` - Number input
- `languages` - Text input (comma-separated, converted to array)
- `vacancies` - Number input
- `job_type` - Select dropdown
- `work_mode` - Select dropdown

### Section 3: Location & Address
- `city` - Text input
- `address` - Text input

### Section 4: Salary Information
- `salary_from` - Text input
- `salary_to` - Text input
- `currency` - Select dropdown
- `display_salary` - Checkbox
- `incentives` - Textarea

### Section 5: Job Details
- `description` - Textarea (Ant Design)
- `requirements` - Textarea (Ant Design)
- `questions` - Textarea (format: question|required per line)
- `tags` - Text input (comma-separated, converted to array)
- `expires_at` - Text input (date format YYYY-MM-DD)

## Translation Keys

All form text must use `employer.forsa` namespace with next-intl.

Required translation sections:
- `title` - Form titles
- `cvReceive` - Communication method section
- `employeeSpec` - Employee specification fields
- `locationDetails` - Location fields
- `salaryDetails` - Salary fields
- `jobInfo` - Job description fields
- `placeholders` - All input placeholders
- `categories`, `genders`, `educationLevels`, `jobLevels`, `jobTypes`, `workModes`, `currencies` - Dropdown options
- `buttons` - Form actions
- `messages` - Success/error messages
