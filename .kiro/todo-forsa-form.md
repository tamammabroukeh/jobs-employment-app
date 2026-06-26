# ForsaForm Completion TODO

## Current Status
The form schema and handlers are updated for the new API structure, but the JSX still references old fields causing TypeScript errors.

## Errors to Fix

### 1. **Undefined Variables**
- `setReceiveMethod` and `receiveMethod` - should be `setCommunicationMethod` and `communicationMethod`
- Need to connect communication method buttons to the form's `communication_method` field using Controller

### 2. **Fields Not in Schema** (Remove these entirely)
- `experience_level` - Replaced by `job_level`
- `experience_required` - Replaced by `experience_years` (number)
- `location` - Split into `city` and `address`
- `company_name` - No longer in API
- `company_logo` - No longer in API  
- `salary_range.min/max/currency` - Replaced by `salary_from`, `salary_to`, `currency` (flat fields)

### 3. **New Fields Missing** (Add these to the JSX)
- `portfolio_required` - Checkbox
- `cover_letter_required` - Checkbox
- `gender` - Select (no_preference, male, female)
- `age_from` - Number input
- `age_to` - Number input
- `education_level` - Select
- `job_level` - Select (replaces experience_level)
- `experience_years` - Number input (replaces experience_required)
- `languages` - Text input (comma-separated)
- `vacancies` - Number input
- `city` - Text input
- `address` - Text input
- `salary_from` - Text input
- `salary_to` - Text input
- `display_salary` - Checkbox
- `incentives` - Textarea
- `questions` - Textarea (special format: question|required per line)
- `expires_at` - Date input

## Implementation Steps

### Step 1: Fix Communication Method Section
```typescript
// Update button handlers to use Controller
<Controller
  name="communication_method"
  control={control}
  render={({ field }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        type="button"
        onClick={() => {
          field.onChange('by_forsa');
          setCommunicationMethod('by_forsa');
        }}
        className={communicationMethod === 'by_forsa' ? 'active' : ''}
      >
        {/* ... */}
      </button>
      {/* Same for by_email and by_website */}
    </div>
  )}
/>

// Add conditional communication_value input
{communicationMethod !== 'by_forsa' && (
  <Controller
    name="communication_value"
    control={control}
    render={({ field }) => (
      <ReusableInput
        {...field}
        value={field.value || ''}
        placeholder={t('placeholders.communicationValue')}
        hasError={!!errors.communication_value}
      />
    )}
  />
)}
```

### Step 2: Remove Old Employee Specification Fields
Remove entirely:
- Experience Level field (experience_level)
- Experience Required field (experience_required)  
- Location field (location)

### Step 3: Add New Employee Specification Fields
After the existing fields, add:

**Portfolio Required (Checkbox)**
```typescript
<Controller
  name="portfolio_required"
  control={control}
  render={({ field }) => (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={field.value}
        onChange={field.onChange}
        className="w-4 h-4"
      />
      <Typography variant="p">{t('employeeSpec.portfolioRequired')}</Typography>
    </label>
  )}
/>
```

**Similar for:** cover_letter_required

**Gender (Select)**
```typescript
<Controller
  name="gender"
  control={control}
  render={({ field }) => (
    <ReusableSelect
      label={`${t('employeeSpec.gender')} *`}
      value={field.value}
      onValueChange={field.onChange}
      selectValues={[
        { title: t('genders.noPreference'), value: 'no_preference' },
        { title: t('genders.male'), value: 'male' },
        { title: t('genders.female'), value: 'female' },
      ]}
    />
  )}
/>
```

**Age Range (Number Inputs)**
```typescript
<Controller
  name="age_from"
  control={control}
  render={({ field }) => (
    <ReusableInput
      {...field}
      type="number"
      value={field.value?.toString() || ''}
      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
      placeholder={t('placeholders.ageFrom')}
    />
  )}
/>
```

**Similar for:** age_to

**Education Level (Select)**
```typescript
<Controller
  name="education_level"
  control={control}
  render={({ field }) => (
    <ReusableSelect
      label={`${t('employeeSpec.educationLevel')} *`}
      value={field.value}
      onValueChange={field.onChange}
      selectValues={[
        { title: t('educationLevels.highSchool'), value: 'high_school' },
        { title: t('educationLevels.diploma'), value: 'diploma' },
        { title: t('educationLevels.bachelor'), value: 'bachelor' },
        { title: t('educationLevels.master'), value: 'master' },
        { title: t('educationLevels.phd'), value: 'phd' },
      ]}
    />
  )}
/>
```

**Job Level (Select)** - Replaces experience_level
```typescript
<Controller
  name="job_level"
  control={control}
  render={({ field }) => (
    <ReusableSelect
      label={`${t('employeeSpec.jobLevel')} *`}
      value={field.value}
      onValueChange={field.onChange}
      selectValues={[
        { title: t('jobLevels.junior'), value: 'junior' },
        { title: t('jobLevels.mid'), value: 'mid' },
        { title: t('jobLevels.senior'), value: 'senior' },
        { title: t('jobLevels.lead'), value: 'lead' },
        { title: t('jobLevels.manager'), value: 'manager' },
      ]}
    />
  )}
/>
```

**Experience Years (Number)** - Replaces experience_required
```typescript
<Controller
  name="experience_years"
  control={control}
  render={({ field }) => (
    <ReusableInput
      {...field}
      type="number"
      value={field.value?.toString() || '0'}
      onChange={(e) => field.onChange(Number(e.target.value))}
      placeholder={t('placeholders.experienceYears')}
    />
  )}
/>
```

**Languages (Text Input)**
```typescript
<Controller
  name="languages"
  control={control}
  render={({ field }) => (
    <ReusableInput
      {...field}
      placeholder={t('placeholders.languages')}
      hasError={!!errors.languages}
    />
  )}
/>
```

**Vacancies (Number)**
```typescript
<Controller
  name="vacancies"
  control={control}
  render={({ field }) => (
    <ReusableInput
      {...field}
      type="number"
      value={field.value?.toString() || '1'}
      onChange={(e) => field.onChange(Number(e.target.value))}
      placeholder={t('placeholders.vacancies')}
    />
  )}
/>
```

### Step 4: Remove Company Details Section Entirely
Delete the entire "Company Work Details" section - these fields no longer exist in the API.

### Step 5: Add Location Details Section
```typescript
<div className="auth-card p-6">
  <Typography variant="h2">{t('locationDetails.title')}</Typography>
  
  {/* City */}
  <Controller
    name="city"
    control={control}
    render={({ field }) => (
      <ReusableInput {...field} placeholder={t('placeholders.city')} />
    )}
  />
  
  {/* Address */}
  <Controller
    name="address"
    control={control}
    render={({ field }) => (
      <ReusableInput {...field} placeholder={t('placeholders.address')} />
    )}
  />
</div>
```

### Step 6: Add Salary Details Section
```typescript
<div className="auth-card p-6">
  <Typography variant="h2">{t('salaryDetails.title')}</Typography>
  
  {/* salary_from */}
  <Controller
    name="salary_from"
    control={control}
    render={({ field }) => (
      <ReusableInput {...field} placeholder={t('placeholders.salaryFrom')} />
    )}
  />
  
  {/* salary_to */}
  <Controller
    name="salary_to"
    control={control}
    render={({ field }) => (
      <ReusableInput {...field} placeholder={t('placeholders.salaryTo')} />
    )}
  />
  
  {/* currency */}
  <Controller
    name="currency"
    control={control}
    render={({ field }) => (
      <ReusableSelect
        label={`${t('salaryDetails.currency')} *`}
        value={field.value}
        onValueChange={field.onChange}
        selectValues={[
          { title: t('currencies.usd'), value: 'USD' },
          { title: t('currencies.eur'), value: 'EUR' },
          { title: t('currencies.gbp'), value: 'GBP' },
          { title: t('currencies.lbp'), value: 'LBP' },
        ]}
      />
    )}
  />
  
  {/* display_salary */}
  <Controller
    name="display_salary"
    control={control}
    render={({ field }) => (
      <label>
        <input type="checkbox" checked={field.value} onChange={field.onChange} />
        <Typography>{t('salaryDetails.displaySalary')}</Typography>
      </label>
    )}
  />
  
  {/* incentives */}
  <Controller
    name="incentives"
    control={control}
    render={({ field }) => (
      <TextArea {...field} placeholder={t('placeholders.incentives')} />
    )}
  />
</div>
```

### Step 7: Add Missing Job Info Fields
After description and requirements, add:

**Tags (move from old Company Details section)**
```typescript
<Controller
  name="tags"
  control={control}
  render={({ field }) => (
    <ReusableInput {...field} placeholder={t('placeholders.tags')} />
  )}
/>
```

**Questions**
```typescript
<Controller
  name="questions"
  control={control}
  render={({ field }) => (
    <div>
      <TextArea {...field} rows={4} placeholder={t('placeholders.questions')} />
      <Typography variant="small" className="text-muted-foreground mt-1">
        {t('jobInfo.questionsHelp')}
      </Typography>
    </div>
  )}
/>
```

**Expires At**
```typescript
<Controller
  name="expires_at"
  control={control}
  render={({ field }) => (
    <ReusableInput {...field} placeholder={t('placeholders.expiresAt')} />
  )}
/>
```

### Step 8: Update Translation References
Replace old translation keys:
- `cvReceive.email` → `cvReceive.byEmail`
- `cvReceive.talent` → `cvReceive.byForsa`
- `cvReceive.website` → `cvReceive.byWebsite`
- `workModes.onsite` → `workModes.onSite`

### Step 9: Clean Up
- Remove unused `salaryRangeSchema`
- Remove unused `watch` from useForm
- Update `defaultValues` to remove fields not in form

## Testing Checklist
- [ ] Form loads without TypeScript errors
- [ ] All new fields are visible
- [ ] Communication method selection works
- [ ] Communication value input shows/hides correctly
- [ ] Form submission creates correct payload
- [ ] Edit mode populates all fields correctly
- [ ] Validation works on all fields
- [ ] Translation keys work for both en and ar
