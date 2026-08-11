# Employer Profile Translations

## Overview
Complete i18n implementation for the employer profile feature with English and Arabic translations.

## Files Created

### 1. Translation Files
- ✅ `messages/en/employerProfile.json` - English translations
- ✅ `messages/ar/employerProfile.json` - Arabic translations

### 2. Custom Hook
- ✅ `hooks/use-employer-profile.ts` - Translation hook for employer profile namespace

### 3. Type Definitions
- ✅ Updated `types/i18n.ts` with employerProfile namespace and keys

## Translation Structure

### Namespace: `employerProfile`

#### 1. Header Section
```json
{
  "header": {
    "title": "Company Profile",
    "description": "Manage your company information and settings"
  }
}
```

#### 2. Public Information Section
```json
{
  "publicInfo": {
    "title": "Public Company Information",
    "edit": "Edit",
    "companyName": "Company Name",
    "description": "Description",
    "industry": "Industry",
    "companySize": "Company Size",
    "city": "City",
    "country": "Country",
    "primaryPhone": "Primary Phone",
    "secondaryPhone": "Secondary Phone (Optional)",
    "contactEmail": "Contact Email",
    "phoneVisibility": "Display primary phone number publicly to job seekers",
    "cancel": "Cancel",
    "saveChanges": "Save Changes",
    "updateSuccess": "Company profile updated successfully!",
    "updateError": "Failed to update company profile",
    // ... more fields
  }
}
```

#### 3. Company Size Options
```json
{
  "companySize": {
    "lessThan10": "Less than 10",
    "10to50": "10-50",
    "51to200": "51-200",
    "201to500": "201-500",
    "501to1000": "501-1000",
    "1001to5000": "1001-5000",
    "moreThan5000": "More than 5000"
  }
}
```

#### 4. Private Information Section
```json
{
  "privateInfo": {
    "title": "Private Company Information",
    "subtitle": "This information is only visible to you unless you enable \"Expose to Applicants\"",
    "exposeToApplicants": "Expose to Applicants",
    "exposeDescription": "When enabled, safe private fields will be visible on your public company profile",
    "fullAddress": "Full Address",
    "foundedYear": "Founded Year",
    "website": "Website",
    "industryTags": "Industry Tags",
    "industryTagsDescription": "Add multiple tags for internal classification",
    // ... more fields
  }
}
```

#### 5. Social Media Section
```json
{
  "socialMedia": {
    "title": "Social Media Links",
    "linkedin": "LinkedIn",
    "github": "GitHub",
    "twitter": "Twitter",
    "facebook": "Facebook",
    "instagram": "Instagram",
    "telegram": "Telegram",
    "behance": "Behance",
    "label": "Social Media"
  }
}
```

#### 6. Images Section
```json
{
  "images": {
    "title": "Company Images",
    "logo": {
      "title": "Company Logo",
      "description": "JPEG, PNG, or WebP • Max 2MB",
      "noLogo": "No logo",
      "uploadLogo": "Upload Logo",
      "changeLogo": "Change Logo",
      "uploading": "Uploading...",
      "errorType": "Logo must be JPEG, PNG, or WebP",
      "errorSize": "Logo file size must be less than 2MB",
      "uploadSuccess": "Logo uploaded successfully!",
      "uploadError": "Failed to upload logo"
    },
    "cover": {
      "title": "Cover Image",
      "description": "JPEG, PNG, or WebP • Max 4MB • Recommended: 1200x400px",
      // ... more fields
    }
  }
}
```

#### 7. Statistics Section
```json
{
  "statistics": {
    "title": "Company Statistics",
    "openPositions": "Open Positions",
    "averageRating": "Average Rating",
    "totalReviews": "Total Reviews",
    "wouldRecommend": "Would Recommend"
  }
}
```

#### 8. Category Ratings
```json
{
  "categoryRatings": {
    "title": "Category Ratings",
    "compensation": "Compensation",
    "culture": "Culture",
    "workLife": "Work Life",
    "diversity": "Diversity",
    "management": "Management"
  }
}
```

## Usage in Components

### Import the Hook
```typescript
import { useEmployerProfileTranslations } from '@/hooks/use-translations';

const Component = () => {
  const t = useEmployerProfileTranslations();
  
  return <div>{t('header.title')}</div>;
};
```

### Translation Keys Format
- Header: `t('header.title')`, `t('header.description')`
- Public Info: `t('publicInfo.companyName')`, `t('publicInfo.edit')`
- Private Info: `t('privateInfo.title')`, `t('privateInfo.exposeToApplicants')`
- Social Media: `t('socialMedia.linkedin')`, `t('socialMedia.github')`
- Images: `t('images.logo.title')`, `t('images.cover.uploadSuccess')`
- Statistics: `t('statistics.openPositions')`, `t('statistics.averageRating')`
- Category Ratings: `t('categoryRatings.compensation')`, `t('categoryRatings.culture')`

## Arabic Translation Highlights

### RTL-Friendly
- All Arabic text properly formatted for RTL display
- Numbers and technical terms preserved in English where appropriate
- Cultural adaptation for social media platform names

### Key Translations
- "Company Profile" → "ملف الشركة"
- "Public Company Information" → "معلومات الشركة العامة"
- "Private Company Information" → "معلومات الشركة الخاصة"
- "Social Media Links" → "روابط وسائل التواصل الاجتماعي"
- "Company Images" → "صور الشركة"
- "Company Statistics" → "إحصائيات الشركة"

## Validation Messages

### English
- "Company name is required"
- "Company name must be at most 150 characters"
- "Invalid email format"
- "Invalid year"
- "Year cannot be in the future"
- "Invalid URL"
- "Logo must be JPEG, PNG, or WebP"
- "Logo file size must be less than 2MB"
- "Cover image file size must be less than 4MB"

### Arabic
- "اسم الشركة مطلوب"
- "يجب أن لا يتجاوز اسم الشركة 150 حرفاً"
- "صيغة البريد الإلكتروني غير صحيحة"
- "سنة غير صحيحة"
- "لا يمكن أن تكون السنة في المستقبل"
- "رابط غير صحيح"
- "يجب أن يكون الشعار بصيغة JPEG أو PNG أو WebP"
- "يجب أن يكون حجم ملف الشعار أقل من 2 ميجابايت"
- "يجب أن يكون حجم ملف صورة الغلاف أقل من 4 ميجابايت"

## Success/Error Messages

### English
- "Company profile updated successfully!"
- "Failed to update company profile"
- "Private information updated successfully!"
- "Failed to update private information"
- "Logo uploaded successfully!"
- "Failed to upload logo"
- "Cover image uploaded successfully!"
- "Failed to upload cover image"

### Arabic
- "تم تحديث ملف الشركة بنجاح!"
- "فشل تحديث ملف الشركة"
- "تم تحديث المعلومات الخاصة بنجاح!"
- "فشل تحديث المعلومات الخاصة"
- "تم رفع الشعار بنجاح!"
- "فشل رفع الشعار"
- "تم رفع صورة الغلاف بنجاح!"
- "فشل رفع صورة الغلاف"

## Component Integration Checklist

To integrate translations into the components:

### EmployerProfileClient.tsx
- [ ] Import `useEmployerProfileTranslations`
- [ ] Replace "Company Profile" with `t('header.title')`
- [ ] Replace "Manage your company information and settings" with `t('header.description')`
- [ ] Replace "Company Statistics" with `t('statistics.title')`
- [ ] Replace statistics labels with translation keys
- [ ] Replace "Category Ratings" with `t('categoryRatings.title')`
- [ ] Replace category names with translation keys

### CompanyPublicInfoSection.tsx
- [ ] Import `useEmployerProfileTranslations`
- [ ] Replace all form labels with translation keys
- [ ] Replace all placeholders with translation keys
- [ ] Replace all button text with translation keys
- [ ] Replace all validation messages with translation keys
- [ ] Replace all toast messages with translation keys
- [ ] Replace company size options with translation keys

### CompanyPrivateInfoSection.tsx
- [ ] Import `useEmployerProfileTranslations`
- [ ] Replace all form labels with translation keys
- [ ] Replace all placeholders with translation keys
- [ ] Replace all descriptions with translation keys
- [ ] Replace social media labels with translation keys
- [ ] Replace all validation messages with translation keys
- [ ] Replace all toast messages with translation keys

### CompanyImagesSection.tsx
- [ ] Import `useEmployerProfileTranslations`
- [ ] Replace section titles with translation keys
- [ ] Replace descriptions with translation keys
- [ ] Replace button text with translation keys
- [ ] Replace validation messages with translation keys
- [ ] Replace toast messages with translation keys

## Testing Checklist

- [ ] All English text displays correctly
- [ ] All Arabic text displays correctly
- [ ] RTL layout works properly for Arabic
- [ ] All form validations show translated messages
- [ ] All success/error toasts show translated messages
- [ ] All placeholders show translated text
- [ ] All button labels show translated text
- [ ] Company size dropdown shows translated options
- [ ] Social media labels show translated text
- [ ] Statistics labels show translated text
- [ ] Category ratings show translated text

## Notes

- All translations are context-aware and professionally written
- Arabic translations maintain technical accuracy
- Validation messages are clear and user-friendly in both languages
- Social media platform names are kept in English/Latin script for recognition
- File format specifications (JPEG, PNG, WebP) kept in English
- File sizes use appropriate units (MB → ميجابايت in Arabic)

## Next Steps

The translation files are ready. To complete the integration:

1. Update each component to import and use the translation hook
2. Replace all hardcoded strings with translation keys
3. Test both English and Arabic versions
4. Verify RTL layout for Arabic
5. Test form validation messages
6. Test toast notifications
7. Test image upload messages

Would you like me to update the components now to use these translations?
