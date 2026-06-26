# Technology Stack

## Framework & Runtime

- **Next.js 16.0.10** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development
- **Node.js 20+** - Runtime environment

## Core Libraries

### UI & Styling
- **Ant Design (antd) 6.0.0** - Primary UI component library
- **Tailwind CSS 4** - Utility-first CSS framework
- **tailwind-merge** - Merging Tailwind classes utility

### Authentication
- **NextAuth 4.24.13** - Authentication framework
- **next-auth/jwt** - JWT token handling
- Session strategy: JWT-based with 1-hour maxAge
- Custom callbacks for token refresh logic

### Forms & Validation
- **react-hook-form 7.67.0** - Form state management
- **zod 4.1.13** - Schema validation
- **@hookform/resolvers** - Form validation integration
- **validator 13.15.23** - String validation utilities

### Internationalization
- **next-intl 4.5.6** - i18n support with en/ar locales
- RTL support for Arabic
- Cookie-based locale persistence

### Server Actions
- **next-safe-action 8.0.11** - Type-safe server actions

### Notifications
- **sonner 2.0.7** - Toast notifications

## API Architecture

### API Layer Structure
- **Base URL**: Configured via `BASE_URL` environment variable
- **Timeout**: 30 seconds (configurable via `NEXT_PUBLIC_API_TIMEOUT`)
- **Retry Logic**: Maximum 2 retries with exponential backoff
- **Error Handling**: Custom `FetchError` class for consistent error responses

### API Features
- Automatic retry for timeout/network errors
- Request timeout with AbortController
- JSON response handling with fallbacks
- Server-side API calls with `"use server"` directive

### API Services Organization
```
apis/
├── api.instance.ts       # Main API fetcher with retry logic
├── authInstance.ts       # Authenticated API instance
├── cookie.ts             # Cookie management
├── services/
│   ├── auth/            # Authentication endpoints
│   ├── companies/       # Company data endpoints
│   ├── job-seeker/      # Job seeker endpoints
│   └── jobs/            # Job listings endpoints
├── types/               # Shared API types
└── utils/               # API utilities (error helpers, query builder, token manager)
```

## Build System

### Package Manager
Uses npm (package-lock.json present)

### Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Production
npm run build           # Create production build
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
```

### Environment Variables
Required in `.env`:
- `BASE_URL` - Backend API base URL
- `NEXT_PUBLIC_API_TIMEOUT` - API request timeout (default: 30000ms)
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application URL for NextAuth

## Configuration

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Path aliases: `@/*` maps to project root
- JSX: react-jsx (React 19 new transform)

### Next.js Configuration
- Logging: Full URL logging for fetches
- Images: Accept all HTTPS/HTTP hostnames
- Server Actions: 10MB body size limit for file uploads
- i18n: next-intl plugin integration

### Build Output
- `.next/` - Next.js build output (gitignored)
- Static optimization enabled
- Server and client components architecture

## Development Patterns

### Server Components by Default
- Use `"use client"` directive only when needed
- Server actions for mutations
- Client components for interactivity

### API Calls
- Server-side: Use `apiFetcher` from `apis/api.instance.ts`
- Client-side: Use custom hooks with react-query patterns
- Always handle errors with try-catch and toast notifications

### Code Organization
- Route groups: `(website)` for public pages, `auth` for auth pages
- Parallel routes and intercepting routes support
- Centralized constants in `/constants` directory
