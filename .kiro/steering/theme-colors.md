# Theme Colors & Dark Mode Pattern

## Overview

This project uses **semantic CSS custom properties** for all colors to ensure consistent light/dark mode support without inline conditional classes.

## ❌ BAD - Avoid Inline Dark Mode Classes

```tsx
// DON'T DO THIS
<div className="text-gray-900 dark:text-gray-100">
<div className="bg-white dark:bg-gray-800">
<span className="text-blue-500 dark:text-blue-400">
```

## ✅ GOOD - Use Semantic Color Tokens

```tsx
// DO THIS INSTEAD
<div className="text-doc-section-text">
<div className="bg-doc-section-bg">
<span className="text-primary">
```

## Adding New Semantic Colors

### Step 1: Define CSS Variables in `app/globals.css`

Add your color tokens to both `:root` (light mode) and `:root.dark` (dark mode):

```css
:root {
  /* Existing colors... */
  
  /* Your Feature Semantic Colors */
  --my-feature-bg: #ffffff;
  --my-feature-text: #0f172a;
  --my-feature-border: #e2e8f0;
  --my-feature-accent: #2563eb;
}

:root.dark {
  /* Existing colors... */
  
  /* Your Feature Semantic Colors */
  --my-feature-bg: #1e293b;
  --my-feature-text: #f1f5f9;
  --my-feature-border: #334155;
  --my-feature-accent: #3b82f6;
}
```

### Step 2: Register Tailwind Classes

Add the new CSS variables to the `@theme inline` block:

```css
@theme inline {
  /* Existing... */
  --color-my-feature-bg: var(--my-feature-bg);
  --color-my-feature-text: var(--my-feature-text);
  --color-my-feature-border: var(--my-feature-border);
  --color-my-feature-accent: var(--my-feature-accent);
}
```

### Step 3: Use in Components

Now use the semantic class names in your components:

```tsx
<div className="bg-my-feature-bg text-my-feature-text border border-my-feature-border">
  <span className="text-my-feature-accent">Themed content</span>
</div>
```

## Existing Semantic Color Tokens

### General Tokens
- `bg-background` / `text-foreground` - Page-level background and text
- `bg-card` / `border-card-border` - Card backgrounds and borders
- `bg-muted` / `text-muted-foreground` - Muted/secondary content
- `text-primary` / `bg-primary` - Primary brand colors
- `text-destructive` / `bg-destructive` - Error/destructive actions
- `text-success` / `bg-success` - Success states
- `text-warning` / `bg-warning` - Warning states
- `border-border` - Standard borders
- `ring-ring` - Focus rings

### Document Section Tokens
- `bg-doc-section-bg` - Document card backgrounds
- `border-doc-section-border` - Document card borders
- `text-doc-section-text` - Main text in document sections
- `text-doc-section-text-muted` - Secondary/muted text
- `text-doc-icon-pdf` - PDF icon color
- `text-doc-icon-file` - File icon color
- `bg-doc-analysis-bg` / `border-doc-analysis-border` - Analysis result boxes
- `bg-doc-evaluation-bg` / `border-doc-evaluation-border` - Evaluation/warning boxes
- `text-doc-evaluation-text` / `text-doc-evaluation-icon` - Evaluation text and icons
- `border-doc-work-history-border` - Work history timeline border
- `border-doc-education-border` - Education timeline border

## Naming Conventions

When creating new semantic tokens, follow these patterns:

### Component-Specific Colors
```
--{component}-{element}-{property}
--doc-section-bg
--card-header-text
--sidebar-nav-active
```

### State-Based Colors
```
--{component}-{state}-{property}
--button-hover-bg
--input-error-border
--link-visited-text
```

### Context Colors
```
--{context}-{element}
--success-icon
--error-message
--warning-banner
```

## Why This Approach?

### Benefits
1. **Single Source of Truth**: Colors defined once in CSS variables
2. **Automatic Dark Mode**: Theme switches without component changes
3. **Better Performance**: No runtime class conditionals
4. **Easier Maintenance**: Update colors in one place
5. **Type Safety**: Tailwind autocomplete works with registered tokens
6. **Readable Code**: Semantic names are self-documenting

### Anti-Pattern Example
```tsx
// ❌ This creates maintenance burden
<div className={`
  ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}
  ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
`}>
```

### Correct Pattern
```tsx
// ✅ Clean, maintainable, automatic
<div className="bg-card text-foreground border-border">
```

## Migration Checklist

When refactoring existing components:

- [ ] Identify all inline `dark:` classes
- [ ] Group related colors semantically
- [ ] Add CSS variables to `globals.css` for both light and dark
- [ ] Register in `@theme inline` block
- [ ] Replace inline classes with semantic tokens
- [ ] Test in both light and dark modes
- [ ] Update component documentation

## Common Patterns

### Cards and Containers
```tsx
<Card className="bg-card border-border">
  <div className="text-foreground">
    <h2 className="text-foreground font-semibold">Title</h2>
    <p className="text-muted-foreground">Description</p>
  </div>
</Card>
```

### Icons
```tsx
<FileIcon className="text-doc-icon-pdf" />
<CheckIcon className="text-success" />
<AlertIcon className="text-warning" />
```

### Interactive Elements
```tsx
<button className="bg-primary text-primary-foreground hover:opacity-90">
  Action
</button>
```

### Status Indicators
```tsx
<span className="text-success">Active</span>
<span className="text-warning">Pending</span>
<span className="text-destructive">Error</span>
```

## Testing Dark Mode

Always test your components in both modes:

```tsx
// Toggle dark mode for testing
document.documentElement.classList.toggle('dark');
```

Or use the theme switcher in your app's header.

## Anti-Patterns to Avoid

### ❌ Hardcoded Hex Colors
```tsx
<div style={{ color: '#1e293b' }}> // Never do this
```

### ❌ Inline Dark Classes
```tsx
<div className="bg-white dark:bg-gray-800"> // Use semantic tokens
```

### ❌ Theme-Aware Logic in Components
```tsx
const bg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'; // Let CSS handle it
```

### ❌ Non-Semantic Names
```tsx
--color-1: #fff;  // What is color-1?
--doc-bg: #fff;   // Better, but not semantic enough
--doc-section-bg: #fff;  // ✅ Clear and semantic
```

## Resources

- CSS Variables: All defined in `app/globals.css`
- Tailwind Config: Auto-generated from `@theme inline` block
- Theme Context: `context/ThemeContext.tsx`
- Theme Hook: `themes/useThemeMode.ts`
