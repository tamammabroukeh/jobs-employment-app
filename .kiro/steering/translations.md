# Internationalization (i18n) Guide

## Overview

The project uses `next-intl` for internationalization with support for English (en) and Arabic (ar) locales.

## File Structure

```
messages/
├── en/
│   ├── auth.json
│   ├── home.json
│   ├── jobs.json
│   ├── companies.json
│   ├── profile.json
│   ├── footer.json
│   ├── errors.json
│   └── ...
└── ar/
    └── (same structure)
```

## Translation Hooks

### useTranslations Hook

Import and use for general translations:
```tsx
import { useTranslations } from 'next-intl';

const Component = () => {
  const t = useTranslations('namespace');
  
  return <div>{t('key')}</div>;
};
```

### Custom Translation Hooks

Located in `/hooks/` directory:

#### useProfileTranslations
```tsx
import { useProfileTranslations } from '@/hooks/use-profile';

const ProfileComponent = () => {
  const t = useProfileTranslations();
  
  return <div>{t('userInfo.title')}</div>;
};
```

**Purpose:** Pre-configured for `profile` namespace translations.

#### Create Custom Hooks
For frequently used namespaces, create custom hooks:

```tsx
// hooks/use-jobs.ts
import { useTranslations } from 'next-intl';

export const useJobsTranslations = () => {
  return useTranslations('jobs');
};
```

## Translation File Structure

### Namespace Organization

Organize by feature/section:
```json
{
  "section": {
    "subsection": {
      "key": "Translation value",
      "anotherKey": "Another value"
    }
  }
}
```

### Example: Profile Translations
```json
{
  "title": "My Profile",
  "documents": {
    "title": "Documents",
    "resume": {
      "title": "Resume / CV",
      "upload": "Upload Resume",
      "delete": "Delete",
      "uploadSuccess": "Resume uploaded successfully",
      "uploadError": "Failed to upload resume"
    },
    "coverLetter": {
      "title": "Default Cover Letter",
      "edit": "Edit",
      "save": "Save",
      "cancel": "Cancel"
    }
  }
}
```

## TypeScript Type Definitions

### Update types/i18n.ts

When adding new translation namespaces:

```typescript
export type Messages = {
  auth: typeof import("../messages/en/auth.json")
  profile: typeof import("../messages/en/profile.json")
  // Add new namespace here
  newNamespace: typeof import("../messages/en/newNamespace.json")
}

export type IntlKeys =
  | keyof Messages
  | `profile.documents.${keyof Messages["profile"]["documents"]}`
  | `profile.documents.resume.${keyof Messages["profile"]["documents"]["resume"]}`
  // Add new namespace keys here
```

## Translation Patterns

### Basic Translation
```tsx
{t('key')}
```

### Nested Translation
```tsx
{t('section.subsection.key')}
```

### Dynamic Values
```tsx
// In translation file
"greeting": "Hello, {name}!"

// In component
{t('greeting', { name: userName })}
```

### Pluralization
```tsx
// In translation file
"items": "{count, plural, =0 {No items} =1 {One item} other {# items}}"

// In component
{t('items', { count: itemCount })}
```

### Rich Text
```tsx
{t.rich('key', {
  b: (chunks) => <strong>{chunks}</strong>,
})}
```

## Best Practices

### 1. Always Use Translations
❌ **Bad:**
```tsx
<Typography variant="h2">Documents</Typography>
<button>Delete</button>
```

✅ **Good:**
```tsx
<Typography variant="h2">{t('documents.title')}</Typography>
<ReusableButton btnText={t('documents.delete')} />
```

### 2. Organize by Feature
Group related translations together:
```json
{
  "documents": {
    "resume": { /* all resume-related */ },
    "coverLetter": { /* all cover letter-related */ },
    "aiAnalysis": { /* all AI analysis-related */ }
  }
}
```

### 3. Consistent Naming
- Use camelCase for keys: `uploadSuccess`, `deleteError`
- Use descriptive names: `uploadError` not `err1`
- Group related messages: `resume.upload`, `resume.delete`

### 4. Include All User-Facing Text
Translate:
- ✅ Labels, titles, descriptions
- ✅ Button text
- ✅ Error messages
- ✅ Success messages
- ✅ Placeholder text
- ✅ Empty state messages
- ✅ Confirmation dialogs

Don't translate:
- ❌ API endpoints
- ❌ Configuration values
- ❌ Developer logs (console.log)

### 5. Toast Notifications
Always translate toast messages:
```tsx
// ❌ Bad
toast.success("Resume uploaded successfully");
toast.error("Failed to upload resume");

// ✅ Good
toast.success(result.data.message || t('documents.resume.uploadSuccess'));
toast.error(t('documents.resume.uploadError'));
```

### 6. Form Validation Messages
```tsx
// Zod schema with translations
const schema = z.object({
  email: z.string()
    .email(t('validation.invalidEmail'))
    .min(1, t('validation.required')),
});
```

### 7. Dialog Content
```tsx
<ReusableDialog
  dialogHeader={{
    title: t('confirmDeleteTitle'),
    description: t('confirmDeleteMessage'),
  }}
  dialogFooter={
    <Flex classes="gap-2 justify-end">
      <ReusableButton btnText={t('cancel')} />
      <ReusableButton btnText={t('delete')} />
    </Flex>
  }
/>
```

## RTL Support

### Arabic Language Support
The app automatically switches to RTL layout for Arabic:

```tsx
// utils/isRTL.ts
export const isRTL = (locale: string) => locale === 'ar';
```

### RTL-Aware Styling
Use logical properties when possible:
```tsx
// ❌ Avoid
className="ml-4 text-left"

// ✅ Use
className="ms-4 text-start"
```

## Common Translation Keys

### Standard Action Keys
Include in every namespace that needs them:
```json
{
  "save": "Save",
  "cancel": "Cancel",
  "delete": "Delete",
  "edit": "Edit",
  "add": "Add",
  "update": "Update",
  "close": "Close",
  "confirm": "Confirm",
  "yes": "Yes",
  "no": "No"
}
```

### Standard Message Keys
```json
{
  "success": "Operation completed successfully",
  "error": "An error occurred",
  "loading": "Loading...",
  "noData": "No data available",
  "notFound": "Not found"
}
```

## Testing Translations

### Check All Languages
When adding new translations:
1. Add to `en` files first
2. Add corresponding translations to `ar` files
3. Test both languages in the UI

### Verify Keys
Ensure all translation keys are:
- Defined in the JSON files
- Added to TypeScript types
- Used correctly in components

## Migration Guide

### Converting Hardcoded Text

**Before:**
```tsx
const Component = () => {
  return (
    <div>
      <h2>Documents</h2>
      <button onClick={handleUpload}>Upload Resume</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};
```

**After:**
```tsx
const Component = () => {
  const t = useProfileTranslations();
  
  return (
    <div>
      <Typography variant="h2">{t('documents.title')}</Typography>
      <ReusableButton 
        btnText={t('documents.resume.upload')} 
        onClick={handleUpload} 
      />
      <ReusableButton 
        btnText={t('documents.resume.delete')} 
        onClick={handleDelete} 
      />
    </div>
  );
};
```

## Checklist for New Features

When implementing a new feature:
- [ ] Create translation namespace file in `messages/en/`
- [ ] Add all user-facing text to translations
- [ ] Create corresponding `messages/ar/` file
- [ ] Update `types/i18n.ts` with new namespace
- [ ] Create custom hook if needed (optional)
- [ ] Use translations in components
- [ ] Test both languages
- [ ] Verify RTL layout for Arabic
