# Quick Reference Guide

## 🎯 Essential Patterns

### Component Creation Checklist

When creating a new feature component:

1. **[ ] UI Components**
   - Use `ReusableButton` instead of Ant Design Button
   - Use `ReusableDialog` instead of Modal
   - Use `Typography` for text elements
   - Use `Flex` for layout

2. **[ ] Translations**
   - Add translations to `messages/en/*.json`
   - Add translations to `messages/ar/*.json`
   - Update `types/i18n.ts` with new keys
   - Create custom hook if needed (e.g., `useFeatureTranslations`)
   - Use translation hook: `const t = useTranslations('namespace')`

3. **[ ] Forms (if applicable)**
   - Define Zod schema with translated error messages
   - Use `react-hook-form` with `zodResolver`
   - Use `Controller` for Ant Design components
   - Handle loading state with `isSubmitting`
   - Show validation errors inline

4. **[ ] API Integration**
   - Define interfaces in `apis/services/feature/interface.ts`
   - Create repository methods in `apis/services/feature/index.ts`
   - Create server actions in `apis/services/feature/actions.ts`
   - Use `authFetcher` for authenticated requests
   - Handle errors with try-catch and toast notifications

5. **[ ] State Management**
   - Use `useState` for local state
   - Use `useRef` for DOM references and file inputs
   - Group related state together
   - Use functional updates for state that depends on previous value

6. **[ ] Error Handling**
   - Wrap async operations in try-catch
   - Show user-friendly error messages with toast
   - Log errors to console for debugging
   - Use `FetchError` class for API errors

7. **[ ] Loading States**
   - Show loading indicators during async operations
   - Disable form inputs during submission
   - Use `isLoading` prop on ReusableButton

## 📦 Component Templates

### Basic Component

```tsx
"use client";

import { useState } from "react";
import { Typography, ReusableButton, Flex } from "@/components/Reusable-Components";
import { useFeatureTranslations } from "@/hooks/use-feature";
import { toast } from "sonner";

export default function FeatureComponent() {
  const t = useFeatureTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      const result = await someAction();
      toast.success(t('success'));
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h2">{t('title')}</Typography>
      <ReusableButton
        btnText={t('action')}
        onClick={handleAction}
        isLoading={isLoading}
        variant="primary"
      />
    </div>
  );
}
```

### Form Component

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "antd";
import { ReusableButton, Flex } from "@/components/Reusable-Components";
import { useFeatureTranslations } from "@/hooks/use-feature";
import { submitAction } from "@/apis/services/feature/actions";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export default function FormComponent() {
  const t = useFeatureTranslations();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await submitAction(data);
      if (result?.data?.success) {
        toast.success(t('success'));
        reset();
      }
    } catch (error) {
      toast.error(t('error'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('name')} placeholder={t('namePlaceholder')} />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>
      
      <ReusableButton
        type="submit"
        btnText={t('submit')}
        isLoading={isSubmitting}
        variant="primary"
      />
    </form>
  );
}
```

### Dialog Component

```tsx
"use client";

import { useState } from "react";
import { ReusableDialog, ReusableButton, Flex } from "@/components/Reusable-Components";
import { useFeatureTranslations } from "@/hooks/use-feature";
import { deleteAction } from "@/apis/services/feature/actions";
import { toast } from "sonner";

export default function FeatureWithDialog() {
  const t = useFeatureTranslations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const result = await deleteAction({});
      if (result?.data?.success) {
        toast.success(t('deleteSuccess'));
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error(t('deleteError'));
    }
  };

  return (
    <>
      <ReusableButton
        btnText={t('delete')}
        onClick={() => setIsDialogOpen(true)}
        variant="primary"
      />

      <ReusableDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        dialogHeader={{
          title: t('confirmTitle'),
          description: t('confirmMessage'),
        }}
        dialogFooter={
          <Flex classes="gap-2 justify-end">
            <ReusableButton
              btnText={t('cancel')}
              onClick={() => setIsDialogOpen(false)}
              variant="default"
            />
            <ReusableButton
              btnText={t('confirm')}
              onClick={handleDelete}
              variant="primary"
            />
          </Flex>
        }
      />
    </>
  );
}
```

### Repository Method

```typescript
// apis/services/feature/index.ts
export const featureRepository = {
  /**
   * Get feature data
   * @returns Promise with feature data
   */
  getData: async (): Promise<IFeatureResponse> => {
    return authFetcher<IFeatureResponse>('/feature', {
      method: Methods.GET,
      next: {
        tags: ['feature-data'],
        revalidate: 3600,
      },
    });
  },

  /**
   * Update feature
   * @param data - Update data
   * @returns Promise with updated data
   */
  update: async (data: IUpdateRequest): Promise<IUpdateResponse> => {
    return authFetcher<IUpdateResponse>('/feature', {
      method: Methods.PUT,
      body: JSON.stringify(data),
    });
  },
};
```

### Server Action

```typescript
// apis/services/feature/actions.ts
'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { featureRepository } from './index';
import { ActionError } from '@/apis/types/error';

const updateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.string().optional(),
});

export const updateAction = actionClient
  .schema(updateSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await featureRepository.update(parsedInput);
      
      revalidateTag('feature-data', 'max');
      
      return {
        success: true,
        message: response.message,
        data: response.data,
      };
    } catch (error) {
      console.error('Update error:', error);
      
      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to update');
    }
  });
```

## 🔍 Common Tasks

### Add a New Translation
1. Open `messages/en/namespace.json`
2. Add key-value pair
3. Open `messages/ar/namespace.json`
4. Add Arabic translation
5. Update `types/i18n.ts` if needed
6. Use in component: `t('key')`

### Add a New API Endpoint
1. Define interfaces in `interface.ts`
2. Add repository method in `index.ts`
3. Create server action in `actions.ts`
4. Use in component

### Add a New Form
1. Define Zod schema with validation
2. Use `react-hook-form` with `zodResolver`
3. Add form JSX with error display
4. Handle submission with server action
5. Show success/error toasts

### Add a New Dialog
1. Create state: `const [isOpen, setIsOpen] = useState(false)`
2. Add `ReusableDialog` component
3. Add header, body, and footer
4. Handle actions in footer buttons

### File Upload
1. Create file input with ref
2. Validate file on change
3. Pass File to server action
4. Server action creates FormData
5. Repository sends with `skipDefaultHeaders: true`

## 🚫 Common Mistakes to Avoid

❌ Using Ant Design Modal instead of ReusableDialog
❌ Using Ant Design Button instead of ReusableButton
❌ Hardcoding text instead of using translations
❌ Not validating forms with Zod
❌ Not handling loading states
❌ Not showing error messages to users
❌ Setting `Content-Type` header for FormData uploads
❌ Not wrapping async operations in try-catch
❌ Not using functional updates for dependent state
❌ Creating global state for local data

## ✅ Best Practices

✅ Always use translations for user-facing text
✅ Use ReusableButton and ReusableDialog
✅ Validate all forms with Zod
✅ Show loading states during async operations
✅ Provide user feedback with toast notifications
✅ Type everything with TypeScript
✅ Use repository pattern for API calls
✅ Document API methods with JSDoc
✅ Group related state together
✅ Use `authFetcher` for authenticated requests
✅ Revalidate cache after mutations
✅ Clean up side effects in useEffect
✅ Use functional state updates
✅ Extract reusable logic into custom hooks

## 📚 File Locations

- **Components**: `/components/`
- **Reusable Components**: `/components/Reusable-Components/`
- **API Services**: `/apis/services/`
- **Hooks**: `/hooks/`
- **Translations**: `/messages/`
- **Types**: `/types/`
- **Utils**: `/utils/`
- **Constants**: `/constants/`

## 🔗 Related Documentation

- [UI Patterns Guide](./ui-patterns.md)
- [Translations Guide](./translations.md)
- [Forms & Validation Guide](./forms-validation.md)
- [API Patterns Guide](./api-patterns.md)
- [Hooks & State Guide](./hooks-state.md)
- [Project Structure](./structure.md)
- [Technology Stack](./tech.md)
