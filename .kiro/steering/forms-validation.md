# Forms & Validation Guide

## Form Libraries

The project uses:
- **react-hook-form 7.67.0** - Form state management
- **zod 4.1.13** - Schema validation
- **@hookform/resolvers** - Form validation integration

## Basic Form Setup

### 1. Import Required Dependencies

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
```

### 2. Define Zod Schema

```tsx
const formSchema = z.object({
  email: z.string()
    .min(1, t('validation.required'))
    .email(t('validation.invalidEmail')),
  password: z.string()
    .min(8, t('validation.minLength', { min: 8 })),
  age: z.number()
    .min(18, t('validation.minAge'))
    .optional(),
});

type FormData = z.infer<typeof formSchema>;
```

### 3. Initialize Form

```tsx
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
  setValue,
  watch,
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: '',
    password: '',
  },
});
```

### 4. Handle Form Submission

```tsx
const onSubmit = async (data: FormData) => {
  try {
    const result = await submitAction(data);
    
    if (result?.data?.success) {
      toast.success(t('form.submitSuccess'));
      reset(); // Clear form after success
    } else {
      toast.error(t('form.submitError'));
    }
  } catch (error) {
    toast.error(t('form.submitError'));
  }
};
```

### 5. Form JSX

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div>
    <label>{t('form.email')}</label>
    <Input
      {...register('email')}
      placeholder={t('form.emailPlaceholder')}
    />
    {errors.email && (
      <span className="text-red-500 text-sm">
        {errors.email.message}
      </span>
    )}
  </div>

  <ReusableButton
    type="submit"
    btnText={t('form.submit')}
    isLoading={isSubmitting}
    variant="primary"
  />
</form>
```

## Common Validation Patterns

### Required Fields
```tsx
field: z.string().min(1, t('validation.required'))
```

### Email Validation
```tsx
email: z.string()
  .min(1, t('validation.required'))
  .email(t('validation.invalidEmail'))
```

### Min/Max Length
```tsx
password: z.string()
  .min(8, t('validation.minLength', { min: 8 }))
  .max(50, t('validation.maxLength', { max: 50 }))
```

### Number Validation
```tsx
age: z.number()
  .min(18, t('validation.minAge'))
  .max(100, t('validation.maxAge'))
```

### Optional Fields
```tsx
middleName: z.string().optional()
// or
middleName: z.string().min(1).optional()
```

### Array Validation
```tsx
skills: z.array(z.string()).min(1, t('validation.atLeastOne'))
```

### Object Validation
```tsx
address: z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(5).max(10),
})
```

### Conditional Validation
```tsx
const schema = z.object({
  hasExperience: z.boolean(),
  yearsExperience: z.number().optional(),
}).refine(
  (data) => !data.hasExperience || data.yearsExperience,
  {
    message: t('validation.experienceRequired'),
    path: ['yearsExperience'],
  }
);
```

### Custom Validation
```tsx
phone: z.string()
  .min(1, t('validation.required'))
  .refine(
    (val) => /^\+?[1-9]\d{1,14}$/.test(val),
    t('validation.invalidPhone')
  )
```

## Form Patterns

### Controlled Ant Design Components

For Ant Design components, use controlled approach:

```tsx
import { Controller } from 'react-hook-form';
import { Select, DatePicker } from 'antd';

<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      placeholder={t('form.selectCategory')}
      options={categories}
    />
  )}
/>

<Controller
  name="birthDate"
  control={control}
  render={({ field }) => (
    <DatePicker
      {...field}
      placeholder={t('form.selectDate')}
      format="YYYY-MM-DD"
    />
  )}
/>
```

### File Upload

```tsx
const schema = z.object({
  file: z.instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      t('validation.fileSize')
    )
    .refine(
      (file) => ['image/jpeg', 'image/png'].includes(file.type),
      t('validation.fileType')
    ),
});

// In component
<input
  type="file"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file);
    }
  }}
/>
```

### Multi-Step Forms

```tsx
const [step, setStep] = useState(1);

const schema1 = z.object({ /* Step 1 fields */ });
const schema2 = z.object({ /* Step 2 fields */ });

const currentSchema = step === 1 ? schema1 : schema2;

const form = useForm({
  resolver: zodResolver(currentSchema),
});

const onNext = async () => {
  const isValid = await form.trigger(); // Validate current step
  if (isValid) setStep(2);
};
```

### Dynamic Fields

```tsx
import { useFieldArray } from 'react-hook-form';

const schema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1),
    level: z.string(),
  })),
});

const { fields, append, remove } = useFieldArray({
  control,
  name: 'skills',
});

// Add field
<ReusableButton
  btnText={t('form.addSkill')}
  onClick={() => append({ name: '', level: '' })}
/>

// Render fields
{fields.map((field, index) => (
  <div key={field.id}>
    <Input {...register(`skills.${index}.name`)} />
    <ReusableButton
      icon={<DeleteOutlined />}
      onClick={() => remove(index)}
    />
  </div>
))}
```

## Form State Management

### Watch Values
```tsx
const watchEmail = watch('email');
const watchAll = watch(); // Watch all fields

// Use in useEffect
useEffect(() => {
  console.log('Email changed:', watchEmail);
}, [watchEmail]);
```

### Set Values Programmatically
```tsx
setValue('email', 'user@example.com');
setValue('email', 'user@example.com', { 
  shouldValidate: true,
  shouldDirty: true,
});
```

### Reset Form
```tsx
// Reset to default values
reset();

// Reset with new values
reset({
  email: 'new@example.com',
  password: '',
});
```

### Trigger Validation
```tsx
// Validate all fields
await trigger();

// Validate specific field
await trigger('email');

// Validate multiple fields
await trigger(['email', 'password']);
```

### Get Form Values
```tsx
const currentValues = getValues();
const emailValue = getValues('email');
```

## Error Display

### Inline Errors
```tsx
{errors.email && (
  <Typography variant="text" className="text-red-500 text-sm">
    {errors.email.message}
  </Typography>
)}
```

### Error Summary
```tsx
{Object.keys(errors).length > 0 && (
  <div className="bg-red-50 border border-red-200 rounded p-4">
    <Typography variant="h4" className="text-red-700 mb-2">
      {t('form.errorSummary')}
    </Typography>
    <ul className="list-disc list-inside">
      {Object.entries(errors).map(([key, error]) => (
        <li key={key} className="text-red-600 text-sm">
          {error.message}
        </li>
      ))}
    </ul>
  </div>
)}
```

## Loading States

### Disable Form During Submit
```tsx
<Input
  {...register('email')}
  disabled={isSubmitting}
/>

<ReusableButton
  type="submit"
  btnText={t('form.submit')}
  isLoading={isSubmitting}
  disabled={isSubmitting}
/>
```

## Form Dialog Pattern

Combine forms with ReusableDialog:

```tsx
const [isFormOpen, setIsFormOpen] = useState(false);
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

const handleOpen = () => {
  form.reset(); // Reset form when opening
  setIsFormOpen(true);
};

const onSubmit = async (data: FormData) => {
  try {
    await submitAction(data);
    toast.success(t('form.success'));
    setIsFormOpen(false);
  } catch (error) {
    toast.error(t('form.error'));
  }
};

<ReusableDialog
  isOpen={isFormOpen}
  setIsOpen={setIsFormOpen}
  dialogHeader={{
    title: t('form.title'),
    description: t('form.description'),
  }}
  dialogBody={
    <form id="myForm" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  }
  dialogFooter={
    <Flex classes="gap-2 justify-end">
      <ReusableButton
        btnText={t('cancel')}
        onClick={() => setIsFormOpen(false)}
        variant="default"
      />
      <ReusableButton
        type="submit"
        form="myForm"
        btnText={t('save')}
        variant="primary"
        isLoading={form.formState.isSubmitting}
      />
    </Flex>
  }
/>
```

## Best Practices

### 1. Always Validate
- Define Zod schemas for all forms
- Use zodResolver for validation
- Show clear error messages

### 2. Use TypeScript
```tsx
type FormData = z.infer<typeof schema>;
const form = useForm<FormData>({...});
```

### 3. Translate Everything
- Validation messages
- Labels and placeholders
- Error messages
- Success messages

### 4. Handle Loading States
- Disable inputs during submission
- Show loading on submit button
- Prevent multiple submissions

### 5. Reset After Success
```tsx
if (result?.data?.success) {
  reset();
  setIsFormOpen(false);
}
```

### 6. Provide Feedback
```tsx
toast.success(t('form.success'));
toast.error(t('form.error'));
```

### 7. Default Values
Always provide default values:
```tsx
defaultValues: {
  email: '',
  name: '',
  age: undefined,
}
```

## Common Validation Messages

Add to `messages/en/validation.json`:
```json
{
  "required": "This field is required",
  "invalidEmail": "Invalid email address",
  "minLength": "Minimum {min} characters required",
  "maxLength": "Maximum {max} characters allowed",
  "minAge": "Must be at least {min} years old",
  "fileSize": "File size must be less than {size}MB",
  "fileType": "Invalid file type"
}
```

## Testing Forms

### Test Validation
```tsx
// Submit empty form
await form.handleSubmit(onSubmit)();
// Check errors
expect(form.formState.errors.email).toBeDefined();
```

### Test Submission
```tsx
form.setValue('email', 'test@example.com');
await form.handleSubmit(onSubmit)();
// Check success
```
