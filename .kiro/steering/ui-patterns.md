# UI Patterns & Components

## Reusable Components

### Location
All reusable components are in `/components/Reusable-Components/`

### Available Components

#### ReusableButton
```typescript
interface IReusableButton {
  btnText?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'default' | 'text' | 'link';
  danger?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

**Usage:**
```tsx
<ReusableButton
  btnText="Save"
  variant="primary"
  onClick={handleSave}
  isLoading={isSaving}
/>
```

#### ReusableDialog
```typescript
interface IReusableDialog {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  dialogHeader?: { 
    title?: string | React.ReactNode; 
    description?: string; 
  };
  dialogBody?: React.ReactNode;
  dialogFooter?: React.ReactNode;
  contentClassName?: string;
}
```

**Usage:**
```tsx
<ReusableDialog
  isOpen={isOpen}
  setIsOpen={setIsOpen}
  dialogHeader={{
    title: "Confirm Delete",
    description: "Are you sure you want to delete this item?"
  }}
  dialogFooter={
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText="Cancel"
        onClick={() => setIsOpen(false)}
        variant="default"
      />
      <ReusableButton
        btnText="Delete"
        onClick={handleDelete}
        variant="primary"
      />
    </Flex>
  }
/>
```

**Important:** 
- Always use `ReusableDialog` instead of Ant Design `Modal`
- Always use `ReusableButton` instead of Ant Design `Button`
- For complex modal content, pass JSX to `dialogBody`
- For custom footers, use `Flex` component with buttons

#### Typography
```typescript
interface ITypography {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'text' | 'span';
  className?: string;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Typography variant="h2" className="text-xl font-semibold">
  Section Title
</Typography>
```

#### Flex
```typescript
interface IFlex {
  children: React.ReactNode;
  classes?: string;
}
```

**Usage:**
```tsx
<Flex classes="gap-4 items-center justify-between">
  <div>Content</div>
  <ReusableButton btnText="Action" />
</Flex>
```

#### ReusableCard
Use for consistent card styling across the application.

#### Reusable-Pagination
Use for list pagination with consistent styling.

## Dialog Patterns

### Confirmation Dialogs
Always use for destructive actions (delete, discard changes):

```tsx
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

<ReusableDialog
  isOpen={isDeleteDialogOpen}
  setIsOpen={setIsDeleteDialogOpen}
  dialogHeader={{
    title: t("confirmDeleteTitle"),
    description: t("confirmDeleteMessage"),
  }}
  dialogFooter={
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t("cancel")}
        onClick={() => setIsDeleteDialogOpen(false)}
        variant="default"
      />
      <ReusableButton
        btnText={t("delete")}
        onClick={handleConfirmDelete}
        variant="primary"
      />
    </Flex>
  }
/>
```

### Form Dialogs
For editing or creating data:

```tsx
<ReusableDialog
  isOpen={isFormOpen}
  setIsOpen={setIsFormOpen}
  dialogHeader={{
    title: t("editTitle"),
    description: t("editDescription"),
  }}
  dialogBody={
    <FormContent /> // Your form JSX here
  }
  dialogFooter={
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t("cancel")}
        onClick={() => setIsFormOpen(false)}
        variant="default"
      />
      <ReusableButton
        btnText={t("save")}
        onClick={handleSave}
        variant="primary"
        isLoading={isSaving}
      />
    </Flex>
  }
/>
```

### Display Dialogs
For showing information (like AI analysis results):

```tsx
<ReusableDialog
  isOpen={isInfoOpen}
  setIsOpen={setIsInfoOpen}
  contentClassName="w-[800px]" // Custom width
  dialogHeader={{
    title: (
      <div className="flex items-center gap-2">
        <Icon />
        <span>{t("title")}</span>
      </div>
    ) as unknown as string,
  }}
  dialogBody={
    <div className="space-y-6">
      {/* Content */}
    </div>
  }
  dialogFooter={
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t("close")}
        onClick={() => setIsInfoOpen(false)}
        variant="primary"
      />
    </Flex>
  }
/>
```

## Ant Design Components

### When to Use
Use Ant Design components for:
- **Form inputs**: Input, TextArea, Select, DatePicker, Checkbox, Radio
- **Data display**: Table, Tag, Badge, Progress, Tooltip
- **Feedback**: Notification (via sonner/toast), Spin
- **Layout**: Card (or ReusableCard), Divider

### When NOT to Use
- ❌ Modal → Use ReusableDialog
- ❌ Button → Use ReusableButton
- ❌ Alert for user feedback → Use toast from sonner

## Styling Patterns

### Tailwind CSS Classes
- Use utility classes for spacing, colors, sizing
- Prefer Tailwind over custom CSS when possible
- Use `className` prop for custom styling

### Common Patterns
```tsx
// Card sections
<div className="border rounded-lg p-4">

// Grid layouts
<div className="grid grid-cols-2 gap-4">

// Timeline items
<div className="border-l-2 border-blue-500 pl-4">

// Alert/info boxes
<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">

// Gradient backgrounds
<div className="bg-linear-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
```

### Color Coding
- **Blue**: Primary actions, work-related items
- **Green**: Success, completed items, education
- **Yellow**: Warnings, evaluations, information
- **Red**: Errors, destructive actions
- **Orange**: Medium priority, needs attention

## Icon Usage

### Ant Design Icons
Import from `@ant-design/icons`:
```tsx
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
```

### Common Icon Patterns
- Edit: `<EditOutlined />`
- Delete: `<DeleteOutlined />`
- Add: `<PlusOutlined />`
- Success: `<CheckCircleOutlined />`
- Info: `<InfoCircleOutlined />`
- Warning: `<ExclamationCircleOutlined />`

## Loading States

### Button Loading
```tsx
<ReusableButton
  btnText="Save"
  onClick={handleSave}
  isLoading={isSaving}
/>
```

### Content Loading
```tsx
import { Spin } from 'antd';

{isLoading ? <Spin /> : <Content />}
```

## Empty States

Always provide helpful empty states:
```tsx
{items.length === 0 ? (
  <div className="text-center py-8">
    <Typography variant="text" className="text-gray-500">
      {t("noItemsFound")}
    </Typography>
    <ReusableButton
      btnText={t("addItem")}
      onClick={handleAdd}
      variant="primary"
      className="mt-4"
    />
  </div>
) : (
  <ItemsList items={items} />
)}
```

## Responsive Design

### Mobile-First Approach
- Start with mobile layout
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on different screen sizes

### Common Breakpoints
```tsx
// Stack on mobile, grid on desktop
<div className="flex flex-col md:grid md:grid-cols-2 gap-4">
```
