# API Patterns & Server Actions

## Architecture Overview

The API layer follows a repository pattern with three main layers:
1. **API Instance** (`api.instance.ts`) - Base fetcher with error handling
2. **Repository** (`services/*/index.ts`) - Service-specific API calls
3. **Server Actions** (`services/*/actions.ts`) - Next.js server actions with validation

## API Instance Layer

### Base Fetcher (`apis/api.instance.ts`)

```typescript
export default async function apiFetcher<T>(
  path: string,
  requestInit?: RequestInit & { skipDefaultHeaders?: boolean },
  retryCount: number = 0,
): Promise<T>
```

**Features:**
- Automatic retry logic (max 2 retries)
- Request timeout (30s default)
- Error handling with `FetchError` class
- Automatic FormData detection
- Configurable headers

**Usage:**
```typescript
// JSON request
const data = await apiFetcher<ResponseType>('/endpoint', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
});

// FormData request (auto-detected)
const formData = new FormData();
formData.append('file', file);
const result = await apiFetcher<UploadResponse>('/upload', {
  method: 'POST',
  body: formData,
});
```

### Authenticated Fetcher (`apis/authInstace.ts`)

```typescript
export async function authFetcher<T>(
  path: string,
  requestInit?: RequestInit & { skipDefaultHeaders?: boolean },
  isRetry: boolean = false,
): Promise<T>
```

**Features:**
- Automatic token injection
- Token refresh on 401
- Session management
- Inherits all `apiFetcher` features

**Usage:**
```typescript
const profile = await authFetcher<ProfileResponse>('/job-seeker/profile');
```

## Repository Layer

### Structure

```
apis/services/
├── service-name/
│   ├── index.ts          # Repository with all API calls
│   ├── interface.ts      # TypeScript interfaces
│   ├── actions.ts        # Server actions (optional)
│   └── helpers.ts        # Utility functions (optional)
```

### Repository Pattern

**File: `services/job-seeker/index.ts`**

```typescript
export const jobSeekerRepository = {
  /**
   * Get job seeker profile
   * @returns Promise with profile data
   */
  getProfile: async (): Promise<IJobSeekerProfileResponse> => {
    return authFetcher<IJobSeekerProfileResponse>('/job-seeker/profile', {
      method: Methods.GET,
      next: {
        tags: ['job-seeker-profile'],
        revalidate: 3600,
      },
    });
  },

  /**
   * Update personal information
   * @param data - Personal info data
   * @returns Promise with updated profile
   */
  updatePersonalInfo: async (
    data: IUpdatePersonalInfoRequest
  ): Promise<IUpdatePersonalInfoResponse> => {
    return authFetcher<IUpdatePersonalInfoResponse>('/job-seeker/profile', {
      method: Methods.PUT,
      body: JSON.stringify(data),
    });
  },

  /**
   * Upload resume file
   * @param file - Resume file (PDF/DOC/DOCX, max 5MB)
   * @returns Promise with upload response
   */
  uploadResume: async (file: File): Promise<IUploadResumeResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    
    return authFetcher<IUploadResumeResponse>('/job-seeker/resume/upload', {
      method: Methods.POST,
      body: formData,
      skipDefaultHeaders: true,
    });
  },
};
```

**Best Practices:**
- ✅ Add JSDoc comments for each method
- ✅ Use TypeScript interfaces for requests/responses
- ✅ Group related methods together
- ✅ Export as object for easy importing
- ✅ Use descriptive method names

### HTTP Methods

```typescript
export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}
```

## TypeScript Interfaces

### Interface Structure

**File: `services/job-seeker/interface.ts`**

```typescript
// Request Interfaces
export interface IUpdatePersonalInfoRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

// Response Interfaces
export interface IUpdatePersonalInfoResponse {
  status: boolean;
  message: string;
  profile: IJobSeekerProfile;
}

// Data Model Interfaces
export interface IJobSeekerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}
```

**Naming Conventions:**
- Request: `I{Action}Request` → `IUpdatePersonalInfoRequest`
- Response: `I{Action}Response` → `IUpdatePersonalInfoResponse`
- Models: `I{ModelName}` → `IJobSeekerProfile`

## Server Actions Layer

### Server Actions Pattern

**File: `services/job-seeker/actions.ts`**

```typescript
'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { jobSeekerRepository } from './index';
import { ActionError } from '@/apis/types/error';

// 1. Define Zod Schema
const updatePersonalInfoSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// 2. Create Server Action
export const updatePersonalInfoAction = actionClient
  .schema(updatePersonalInfoSchema)
  .action(async ({ parsedInput }) => {
    try {
      // 3. Call repository method
      const response = await jobSeekerRepository.updatePersonalInfo(parsedInput);
      
      // 4. Revalidate cache if needed
      revalidateTag('job-seeker-profile', 'max');
      
      // 5. Return success response
      return {
        success: true,
        message: response.message,
        profile: response.profile,
      };
    } catch (error) {
      // 6. Handle errors
      console.error('Update personal info error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update personal information';
      throw new ActionError(errorMessage);
    }
  });
```

**Server Action Structure:**
1. `'use server'` directive at the top
2. Define Zod validation schema
3. Use `actionClient.schema().action()`
4. Call repository method
5. Revalidate cache if needed
6. Return structured response
7. Handle errors properly

### File Upload Server Action

```typescript
const uploadResumeSchema = z.object({
  file: z.instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    )
    .refine(
      (file) => [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.type),
      'File must be PDF, DOC, or DOCX'
    ),
});

export const uploadResumeAction = actionClient
  .schema(uploadResumeSchema)
  .action(async ({ parsedInput: { file } }) => {
    try {
      const response = await jobSeekerRepository.uploadResume(file);
      
      revalidateTag('job-seeker-profile', 'max');
      
      return {
        success: true,
        message: response.message,
        resume_url: response.resume_url,
        profile: response.profile,
        analysis_status: response.analysis_status,
      };
    } catch (error) {
      console.error('Upload resume error:', error);
      
      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to upload resume');
    }
  });
```

## Cache Management

### Revalidation Tags

```typescript
// Set cache tag in repository
return authFetcher<Response>('/endpoint', {
  next: {
    tags: ['profile', 'user-data'],
    revalidate: 3600, // 1 hour
  },
});

// Revalidate in server action
revalidateTag('profile', 'max');
```

### Cache Strategies

```typescript
// No cache (always fresh)
cache: 'no-cache'

// Force cache (default)
cache: 'force-cache'

// Revalidate after time
next: { revalidate: 3600 }

// On-demand revalidation
next: { tags: ['tag-name'] }
```

## Error Handling

### FetchError Class

```typescript
export class FetchError extends Error {
  status?: number;
  info?: unknown;
  type: 'api' | 'network' | 'timeout' | 'unknown';
  
  constructor(
    message?: string,
    info?: unknown,
    status?: number,
    type: 'api' | 'network' | 'timeout' | 'unknown' = 'unknown'
  ) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.info = info;
    this.type = type;
  }
}
```

### Error Handling in Components

```typescript
try {
  const result = await updateProfileAction(data);
  
  if (result?.data?.success) {
    toast.success(result.data.message || t('success'));
  } else {
    toast.error(t('error'));
  }
} catch (error) {
  console.error('Error:', error);
  
  if (error instanceof FetchError) {
    // Handle specific error
    if (error.status === 401) {
      toast.error(t('errors.unauthorized'));
    } else if (error.status === 422) {
      toast.error(t('errors.validation'));
    } else {
      toast.error(error.message || t('errors.default'));
    }
  } else {
    toast.error(t('errors.default'));
  }
}
```

## Request/Response Patterns

### GET Request
```typescript
getProfile: async (): Promise<ProfileResponse> => {
  return authFetcher<ProfileResponse>('/profile', {
    method: Methods.GET,
  });
}
```

### POST Request (JSON)
```typescript
createItem: async (data: CreateRequest): Promise<CreateResponse> => {
  return authFetcher<CreateResponse>('/items', {
    method: Methods.POST,
    body: JSON.stringify(data),
  });
}
```

### PUT Request (Update)
```typescript
updateItem: async (id: string, data: UpdateRequest): Promise<UpdateResponse> => {
  return authFetcher<UpdateResponse>(`/items/${id}`, {
    method: Methods.PUT,
    body: JSON.stringify(data),
  });
}
```

### DELETE Request
```typescript
deleteItem: async (id: string): Promise<DeleteResponse> => {
  return authFetcher<DeleteResponse>(`/items/${id}`, {
    method: Methods.DELETE,
  });
}
```

### FormData Upload
```typescript
uploadFile: async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return authFetcher<UploadResponse>('/upload', {
    method: Methods.POST,
    body: formData,
    skipDefaultHeaders: true, // Let browser set Content-Type with boundary
  });
}
```

### Query Parameters
```typescript
import { buildQueryString } from '@/apis/utils/queryBuilder';

searchJobs: async (filters: JobFilters): Promise<JobsResponse> => {
  const queryString = buildQueryString(filters);
  
  return apiFetcher<JobsResponse>(`/jobs${queryString}`, {
    method: Methods.GET,
  });
}
```

## Best Practices

### 1. Use Repository Pattern
- Group related API calls in repositories
- Keep business logic in server actions
- Keep HTTP logic in repositories

### 2. Type Everything
- Define interfaces for all requests/responses
- Use `z.infer<typeof schema>` for action types
- Export interfaces for reuse

### 3. Error Handling
- Always wrap repository calls in try-catch
- Use `ActionError` for server actions
- Provide meaningful error messages

### 4. Cache Management
- Use revalidation tags for related data
- Set appropriate revalidate times
- Revalidate after mutations

### 5. Validation
- Validate in server actions with Zod
- Validate file uploads (size, type)
- Return validation errors to client

### 6. Documentation
- Add JSDoc comments to repository methods
- Document request/response shapes
- Note special requirements (file size, formats)

### 7. Security
- Always use `authFetcher` for protected endpoints
- Never expose sensitive tokens client-side
- Validate user permissions in server actions

## Testing API Calls

### Mock Repository
```typescript
jest.mock('@/apis/services/job-seeker', () => ({
  jobSeekerRepository: {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  },
}));
```

### Test Server Action
```typescript
it('should update profile successfully', async () => {
  const mockResponse = { success: true, message: 'Updated' };
  jest.spyOn(jobSeekerRepository, 'updateProfile')
    .mockResolvedValue(mockResponse);
  
  const result = await updateProfileAction({ first_name: 'John' });
  
  expect(result.data.success).toBe(true);
});
```
