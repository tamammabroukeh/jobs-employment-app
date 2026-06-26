# Project Structure

## Root Directory Layout

```
jobs-employment-project/
├── app/                    # Next.js App Router pages
├── apis/                   # API layer and service integrations
├── auth/                   # Authentication configuration
├── components/             # React components
├── constants/              # Application constants
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization config
├── lib/                    # Shared utilities and libraries
├── messages/               # i18n translation files
├── middleware/             # Next.js middleware
├── public/                 # Static assets
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── .kiro/                  # Kiro AI configuration
```

## App Directory (Next.js App Router)

### Route Groups

```
app/
├── (website)/              # Public-facing pages (main layout)
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Website layout with header/footer
│   ├── jobs/              # Job listings and details
│   ├── companies/         # Company listings and details
│   └── profile/           # User profile pages
├── auth/                   # Authentication pages
│   ├── layout.tsx         # Auth-specific layout
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   └── verify-code/
├── dashboard/              # Protected dashboard pages
│   ├── layout.tsx         # Dashboard layout
│   └── page.tsx           # Dashboard home
├── unauthorized/           # Unauthorized access page
└── api/                    # API routes
    └── auth/[...nextauth]/ # NextAuth API handler
```

### Routing Conventions
- Route groups use parentheses: `(website)`, not included in URL
- Dynamic routes use brackets: `[id]`, `[...nextauth]`
- Parallel layouts via `layout.tsx` at each level
- Special files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

## APIs Directory Structure

Centralized API integration layer following service-oriented architecture:

```
apis/
├── api.instance.ts         # Base API fetcher with error handling
├── authInstance.ts         # Authenticated API instance
├── cookie.ts               # Cookie utilities
├── services/
│   ├── auth/
│   │   ├── index.ts       # Auth service exports
│   │   ├── actions.ts     # Server actions for auth
│   │   └── interface.ts   # Auth API interfaces
│   ├── companies/
│   │   ├── index.ts       # Company service exports
│   │   ├── helpers.ts     # Company data helpers
│   │   └── interface.ts   # Company API interfaces
│   ├── job-seeker/
│   │   ├── index.ts       # Job seeker service
│   │   ├── actions.ts     # Server actions
│   │   └── interface.ts   # Type definitions
│   └── jobs/
│       └── interfaces.ts  # Job-related types
├── types/
│   ├── error.ts           # Custom error types (FetchError)
│   └── index.ts           # Shared API types
└── utils/
    ├── errorHelpers.ts    # Error handling utilities
    ├── queryBuilder.ts    # URL query string builder
    └── tokenManager.ts    # Token management utilities
```

### Service Pattern
Each service follows this structure:
- `index.ts` - Main service exports
- `interface.ts` - TypeScript interfaces for requests/responses
- `actions.ts` - Server actions (when applicable)
- `helpers.ts` - Service-specific helper functions

## Components Directory

Feature-based component organization:

```
components/
├── Reusable-Components/    # Shared UI components
│   ├── Typography.tsx
│   ├── ReusableButton.tsx
│   ├── Reusable-Pagination.tsx
│   └── ...
├── auth/                   # Authentication components
│   └── LoginForm.tsx
├── companies/              # Company-related components
│   ├── CompaniesList.tsx
│   ├── CompanyCard.tsx
│   ├── CompanySearch.tsx
│   ├── detail/            # Company detail sub-components
│   └── index.ts           # Barrel exports
├── jobs/                   # Job-related components
├── profile/                # Profile components
│   ├── UserInfoSection.tsx
│   ├── ExperienceSection.tsx
│   └── EducationSection.tsx
├── home/                   # Homepage sections
│   ├── hero/
│   ├── categories/
│   ├── top-companies/
│   ├── recent-jobs/
│   └── ...
├── footer/                 # Footer components
├── header/                 # Header/navigation components
└── layout/                 # Layout components
```

### Component Conventions
- Use `index.ts` for barrel exports within feature folders
- Separate detail/sub-components into subdirectories
- Client components: Add `'use client'` directive at top
- Server components: Default (no directive needed)

## Hooks Directory

Custom React hooks organized by feature:

```
hooks/
├── auth/
│   ├── useLogin.ts
│   └── useAuthSchemas.ts
├── use-translations.ts     # i18n hooks
└── ...
```

### Hook Naming Convention
- Prefix with `use`: `useLogin`, `useJobFilters`
- Group by feature in subdirectories
- Co-locate with related components when tightly coupled

## Constants & Configuration

```
constants/
├── routes.ts              # Application routes (centralized)
├── errors.ts              # Error messages
└── ...
```

### Routes Pattern
- Centralized `ROUTES` object with nested structure
- Helper functions for dynamic routes: `getDetail(id)`
- Separate `NAVBAR_LINKS` array with visibility flags

## Internationalization

```
i18n/
├── request.ts             # i18n configuration
└── ...

messages/
├── en/                    # English translations
│   ├── auth.json
│   ├── home.json
│   ├── jobs.json
│   └── ...
└── ar/                    # Arabic translations
    ├── auth.json
    └── ...
```

### i18n Pattern
- Locale stored in cookies
- Supported locales: `en`, `ar`
- RTL support for Arabic via `isRTL()` helper
- Translation files split by feature
- Use `useTranslations()` hook in components

## Types Directory

```
types/
├── i18n-types.ts          # i18n type definitions
├── auth.ts                # Auth-related types
└── ...
```

### TypeScript Patterns
- Shared types in `/types` directory
- Feature-specific types co-located with features
- Interface over type for object shapes
- Use type for unions and primitives

## File Naming Conventions

- **Components**: PascalCase - `CompanyCard.tsx`, `UserInfoSection.tsx`
- **Hooks**: camelCase with `use` prefix - `useLogin.ts`
- **Utils**: camelCase - `normalizeUrl.ts`, `errorHelpers.ts`
- **Constants**: camelCase - `routes.ts`, `errors.ts`
- **Server Actions**: camelCase - `actions.ts`
- **Types/Interfaces**: camelCase files, PascalCase exports - `interface.ts`

## Path Aliases

Use `@/*` for absolute imports from project root:

```typescript
import { Typography } from '@/components/Reusable-Components'
import ROUTES from '@/constants/routes'
import { apiFetcher } from '@/apis/api.instance'
```

Avoid relative imports beyond one level: `../../../` ❌

## Special Directories

- `.next/` - Build output (auto-generated, gitignored)
- `public/` - Static assets served from root URL
- `.kiro/` - Kiro AI configuration and steering rules
- `node_modules/` - Dependencies (gitignored)
