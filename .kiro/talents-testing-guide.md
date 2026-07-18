# Talents Feature - Testing Guide

## Quick Start

### Access the Page
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/talents`
3. Or click "Talents" in the navbar (visible to employees)

## Test Scenarios

### 1. Page Load & Initial State
**Steps**:
1. Navigate to `/talents`
2. Wait for initial load

**Expected**:
- ✓ Page title: "Discover Talented Professionals"
- ✓ Page description visible
- ✓ Loading spinner appears briefly
- ✓ Talents list loads (or empty state if no data)
- ✓ Filters sidebar visible on left
- ✓ Default filters: all ranges at max, no search terms

### 2. Search Functionality
**Test General Search**:
1. Enter "React" in search field
2. Click "Apply Filters"

**Expected**:
- ✓ Loading spinner appears
- ✓ Results filtered to talents with "React" in name/title/summary
- ✓ Results count updates
- ✓ Page resets to 1

**Test Skills Search**:
1. Enter "React,TypeScript,Node.js" in skills field
2. Click "Apply Filters"

**Expected**:
- ✓ Results show only talents with those skills
- ✓ Partial matching works (case-insensitive)

### 3. Filter Combinations
**Test Location Filter**:
1. Enter "Beirut" in location
2. Click "Apply Filters"

**Expected**:
- ✓ Results show talents from Beirut area
- ✓ Partial matching works

**Test Job Level Filter**:
1. Select "Senior" from dropdown
2. Click "Apply Filters"

**Expected**:
- ✓ Results show only senior-level talents

**Test Experience Range**:
1. Adjust sliders to 3-10 years
2. Click "Apply Filters"

**Expected**:
- ✓ Results show talents with 3-10 years experience
- ✓ Slider values display correctly

**Test ATS Score Range**:
1. Adjust sliders to 70-100
2. Click "Apply Filters"

**Expected**:
- ✓ Results show talents with ATS score 70+

**Test Actively Seeking**:
1. Check "Actively seeking opportunities"
2. Click "Apply Filters"

**Expected**:
- ✓ Results show only talents with is_actively_seeking = true
- ✓ Cards display "Actively Seeking" badge

### 4. Reset Filters
**Steps**:
1. Apply multiple filters
2. Click "Reset All" button

**Expected**:
- ✓ All inputs cleared
- ✓ Sliders reset to full range
- ✓ Checkbox unchecked
- ✓ Results refresh with no filters
- ✓ Page resets to 1

### 5. Talent Card Display
**Check Card Elements**:
- ✓ Profile image or default avatar
- ✓ Full name displayed prominently
- ✓ Current job title (if available)
- ✓ Location (city, region)
- ✓ Years of experience
- ✓ Education level
- ✓ Salary range or "Not specified"
- ✓ Job roles badges (max 5 + overflow)
- ✓ Skills badges (max 4 + overflow)
- ✓ Experience summary (2-line clamp)
- ✓ Social links visible (if available)
- ✓ "Actively Seeking" badge (if applicable)

**Hover Effects**:
- ✓ Card shadow increases on hover
- ✓ Cursor changes to pointer
- ✓ Transition is smooth

### 6. Social Links
**Steps**:
1. Find talent with social links
2. Click LinkedIn icon
3. Click GitHub icon
4. Click Portfolio icon

**Expected**:
- ✓ Links open in new tab
- ✓ Click doesn't navigate card
- ✓ Correct URLs open
- ✓ Icons have hover effects

### 7. Pagination
**Test Page Navigation** (if total > 15):
1. Scroll to bottom
2. Click page 2

**Expected**:
- ✓ New set of talents loads
- ✓ Page scrolls to top smoothly
- ✓ Current page indicator updates
- ✓ Pagination numbers adjust
- ✓ Results count updates correctly

**Test Page Size**:
- ✓ Default: 15 per page
- ✓ Total pages calculated correctly
- ✓ Next/Previous buttons work
- ✓ First/Last page buttons work

### 8. Empty State
**Steps**:
1. Enter filter that matches nothing (e.g., "XXXXXXX")
2. Click "Apply Filters"

**Expected**:
- ✓ No results message appears
- ✓ Icon displayed (users icon)
- ✓ Title: "No Talents Found"
- ✓ Description: "Try adjusting your filters..."
- ✓ No pagination shown

### 9. Loading State
**Steps**:
1. Apply filters
2. Observe loading transition

**Expected**:
- ✓ Spinner appears immediately
- ✓ Previous results hidden during load
- ✓ Filters remain visible
- ✓ Spinner centers in content area
- ✓ No layout shift

### 10. Navigation
**From Navbar**:
1. Login as employee
2. Check navbar links
3. Click "Talents"

**Expected**:
- ✓ "Talents" link visible for employees
- ✓ Link NOT visible for employers
- ✓ Link works for unauthenticated users
- ✓ Active state highlights on talents page
- ✓ Redirects to `/talents`

**From Card Click**:
1. Click on a talent card
2. Check navigation

**Expected**:
- ✓ Navigates to `/talents/[user_id]`
- ✓ Browser back returns to talents page
- ✓ Filter state preserved (if possible)

### 11. Responsive Design
**Mobile (< 768px)**:
- ✓ Sidebar stacks on top or hidden
- ✓ Cards stack vertically
- ✓ Touch-friendly tap targets
- ✓ Filters accessible
- ✓ Pagination works

**Tablet (768px - 1024px)**:
- ✓ Sidebar visible or toggleable
- ✓ Cards display properly
- ✓ All content readable

**Desktop (> 1024px)**:
- ✓ Sidebar + content side-by-side
- ✓ Optimal spacing
- ✓ Full feature visibility

### 12. Translations
**English (EN)**:
1. Switch locale to English
2. Check all text

**Expected**:
- ✓ Page title in English
- ✓ Filter labels in English
- ✓ Button text in English
- ✓ Card content in English
- ✓ Empty/error states in English

**Arabic (AR)**:
1. Switch locale to Arabic
2. Check all text and layout

**Expected**:
- ✓ Page title in Arabic
- ✓ All text in Arabic
- ✓ RTL layout applied
- ✓ Icons/badges positioned correctly for RTL
- ✓ Numbers formatted correctly

### 13. Error Handling
**API Error**:
1. Disconnect network
2. Try to load page

**Expected**:
- ✓ Toast error message appears
- ✓ Empty state or error message shown
- ✓ Page doesn't crash
- ✓ User can retry

**Invalid Filter Values**:
1. Try edge cases (e.g., max exp < min exp)

**Expected**:
- ✓ Validation prevents submission OR
- ✓ API handles gracefully

### 14. Performance
**Load Time**:
- ✓ Initial page load < 2s
- ✓ Filter application < 500ms
- ✓ Pagination < 300ms

**Network**:
- ✓ Only one API call on mount
- ✓ New call on filter change
- ✓ New call on page change
- ✓ No duplicate requests

**Browser Console**:
- ✓ No errors
- ✓ No warnings
- ✓ No memory leaks

## API Testing

### cURL Examples

**Basic Search**:
```bash
curl -X GET "http://localhost:3000/api/search/users" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**With Filters**:
```bash
curl -X GET "http://localhost:3000/api/search/users?search=React&skills=React,TypeScript&min_experience=3&location=Beirut&actively_seeking=true&page=1&per_page=15" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "data": [
    {
      "user_id": "6a1225d9f1b2e5b53c015442",
      "full_name": "Tammam Smith",
      "current_job_title": "Backend Web Developer",
      "city": "Beirut",
      "location": "Beirut",
      "years_of_experience": 3,
      "education_level": "bachelor",
      "skills": [
        {"name": "Laravel", "level": "expert"},
        {"name": "MongoDB", "level": "intermediate"}
      ],
      "job_roles": ["backend", "fullstack"],
      "is_actively_seeking": true,
      ...
    }
  ],
  "current_page": 1,
  "per_page": 15,
  "total": 11,
  "total_pages": 1,
  "next_page": null,
  "prev_page": null
}
```

## Common Issues & Solutions

### Issue: Talents not loading
**Solutions**:
- Check network tab for API errors
- Verify authentication token
- Check API endpoint is correct
- Verify backend is running

### Issue: Filters not applying
**Solutions**:
- Check filter state updates
- Verify API called with correct params
- Check query string building
- Console log filter values

### Issue: Pagination not working
**Solutions**:
- Verify onPageChange callback
- Check API page parameter
- Verify state updates
- Check scroll behavior

### Issue: Social links not working
**Solutions**:
- Check stopPropagation on links
- Verify URLs are valid
- Check target="_blank" attribute
- Test link opening

### Issue: Images not loading
**Solutions**:
- Check image URLs valid
- Verify Next.js Image config
- Check placeholder fallback
- Review image domains whitelist

## Browser Compatibility
Test in:
- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Mobile Safari (iOS)
- ✓ Chrome Mobile (Android)

## Accessibility
- ✓ Keyboard navigation works
- ✓ Tab order logical
- ✓ Focus indicators visible
- ✓ Screen reader compatible
- ✓ ARIA labels present
- ✓ Color contrast sufficient

## Success Criteria
- [ ] All filter combinations work
- [ ] Pagination functions correctly
- [ ] Cards display all information
- [ ] Social links open properly
- [ ] Loading/empty states show
- [ ] Translations complete (EN/AR)
- [ ] Responsive on all sizes
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Navigation works properly
