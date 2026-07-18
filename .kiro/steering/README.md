# Project Documentation

## 📚 Documentation Index

This directory contains comprehensive guides for development patterns and best practices used in this Next.js jobs & employment platform.

### Quick Start
- **[Quick Reference](./quick-reference.md)** ⭐ - Essential patterns, templates, and common tasks

### Core Guides
1. **[UI Patterns](./ui-patterns.md)** - Reusable components, dialogs, styling conventions
2. **[Translations](./translations.md)** - i18n implementation, RTL support, translation workflows
3. **[Forms & Validation](./forms-validation.md)** - react-hook-form, Zod schemas, form patterns
4. **[API Patterns](./api-patterns.md)** - Repository pattern, server actions, API integration
5. **[Hooks & State](./hooks-state.md)** - Custom hooks, state management, React patterns

### Project Information
- **[Technology Stack](./tech.md)** - Libraries, frameworks, and tools overview
- **[Project Structure](./structure.md)** - File organization and architecture
- **[Product Overview](./product.md)** - Business context and user flows
- **[Employer Feature](./employer-feature.md)** - Employer-specific functionality guide

## 🎯 For New Developers

**Start here:**
1. Read [Quick Reference](./quick-reference.md) for essential patterns
2. Review [UI Patterns](./ui-patterns.md) to understand component usage
3. Check [Translations](./translations.md) to learn i18n implementation
4. Study [API Patterns](./api-patterns.md) for backend integration

## 🔍 For Specific Tasks

**Need to...**
- **Create a form?** → [Forms & Validation Guide](./forms-validation.md)
- **Add translations?** → [Translations Guide](./translations.md)
- **Call an API?** → [API Patterns Guide](./api-patterns.md)
- **Build a dialog?** → [UI Patterns Guide](./ui-patterns.md)
- **Manage state?** → [Hooks & State Guide](./hooks-state.md)
- **Find a file?** → [Project Structure Guide](./structure.md)

## 📖 Key Conventions

### Component Standards
- ✅ Use `ReusableButton` instead of Ant Design Button
- ✅ Use `ReusableDialog` instead of Modal
- ✅ Use `Typography` for text elements
- ✅ Use translations for all user-facing text

### Code Organization
```
/components/           # UI components
  /Reusable-Components/  # Shared components
  /feature/              # Feature-specific components
/apis/                 # API layer
  /services/           # Service repositories
/hooks/                # Custom React hooks
/messages/             # Translation files (en, ar)
/types/                # TypeScript definitions
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useProfile.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.ts` (e.g., `userTypes.ts`)

### Import Patterns
```typescript
// Reusable components
import { ReusableButton, ReusableDialog, Flex } from "@/components/Reusable-Components";

// Translations
import { useProfileTranslations } from "@/hooks/use-profile";

// API
import { featureRepository } from "@/apis/services/feature";
import { updateAction } from "@/apis/services/feature/actions";

// Types
import type { IFeatureData } from "@/apis/services/feature/interface";
```

## 🛠️ Development Workflow

### 1. New Feature Development
```
1. Plan component structure
2. Add translations (en + ar)
3. Define TypeScript interfaces
4. Create repository methods
5. Build server actions
6. Implement UI components
7. Add form validation (if needed)
8. Test both languages
9. Verify error handling
```

### 2. Component Development Pattern
```typescript
"use client";                    // Client component directive
import { useState } from "react"; // React hooks
import { Components } from "@/";  // UI components
import { useTranslations } from "@/hooks"; // Translations
import { actions } from "@/apis"; // Server actions
import { toast } from "sonner";   // User feedback

export default function MyComponent() {
  const t = useTranslations('namespace');
  const [state, setState] = useState(initialValue);
  
  const handleAction = async () => {
    try {
      const result = await action();
      toast.success(t('success'));
    } catch (error) {
      toast.error(t('error'));
    }
  };
  
  return (/* JSX */);
}
```

### 3. API Integration Pattern
```typescript
// 1. Define interface (interface.ts)
export interface IUpdateRequest {
  field: string;
}

// 2. Create repository method (index.ts)
update: async (data: IUpdateRequest) => {
  return authFetcher('/endpoint', {
    method: Methods.PUT,
    body: JSON.stringify(data),
  });
}

// 3. Create server action (actions.ts)
export const updateAction = actionClient
  .schema(updateSchema)
  .action(async ({ parsedInput }) => {
    const response = await repository.update(parsedInput);
    revalidateTag('cache-tag', 'max');
    return { success: true, data: response };
  });

// 4. Use in component
const result = await updateAction(data);
```

## 🎨 UI Component Hierarchy

```
ReusableButton       → All buttons (replaces Ant Button)
ReusableDialog       → All modals (replaces Ant Modal)
Typography           → All text elements (h1-h6, text, span)
Flex                 → Layout container with gap/alignment
ReusableCard         → Card wrapper
Reusable-Pagination  → Pagination component

Ant Design Components (still used):
├─ Input, TextArea, Select     → Form inputs
├─ DatePicker, Checkbox, Radio → Form controls
├─ Tag, Badge, Progress        → Data display
├─ Table, Tooltip, Spin        → Complex components
└─ Card, Divider              → Layout (optional)
```

## 🌍 Internationalization

### Supported Languages
- **English (en)** - Default
- **Arabic (ar)** - RTL support

### Translation Workflow
1. Add to `messages/en/namespace.json`
2. Add to `messages/ar/namespace.json`
3. Update `types/i18n.ts` (if new namespace)
4. Use in component: `const t = useTranslations('namespace')`
5. Apply: `{t('key')}`

## 🔐 Authentication & Security

- **Session-based** authentication with NextAuth
- **JWT tokens** with 1-hour expiry
- **Automatic token refresh** on 401 errors
- **Protected routes** via middleware
- **Role-based access** (admin, employer, employee)

## 📦 State Management Approach

- **Local State First** - Use `useState` for component state
- **Lift State Up** - Only when multiple components need it
- **Server State** - Fetch from API, cache with Next.js
- **Form State** - Managed by react-hook-form
- **No Global State Library** - Keep it simple with React

## 🧪 Testing Philosophy

- **Type Safety** - TypeScript for compile-time checks
- **Form Validation** - Zod schemas for runtime validation
- **Error Handling** - Try-catch with user feedback
- **Manual Testing** - Test both languages (en/ar)
- **Component Testing** - Test hooks and utilities

## 📝 Code Review Checklist

- [ ] Uses ReusableButton/ReusableDialog
- [ ] All text is translated
- [ ] Forms use react-hook-form + Zod
- [ ] Loading states handled
- [ ] Error handling with toast
- [ ] TypeScript types defined
- [ ] API uses repository pattern
- [ ] Server actions use safe-action
- [ ] Cache tags for revalidation
- [ ] Both languages tested (en/ar)

## 🚀 Performance Considerations

- **Server Components** by default
- **Client Components** only when needed (`'use client'`)
- **Memoization** for expensive calculations (`useMemo`, `useCallback`)
- **Code Splitting** via dynamic imports
- **Image Optimization** via Next.js Image
- **API Caching** with revalidation tags

## 🔗 External Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-intl](https://next-intl-docs.vercel.app/)

## 📞 Need Help?

1. Check the relevant guide in this directory
2. Search the codebase for similar examples
3. Review component/API implementation patterns
4. Check the Quick Reference for templates

---

**Last Updated:** Based on current project implementation
**Maintained By:** Development Team
