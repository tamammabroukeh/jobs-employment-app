# Translation Autocomplete Setup for VS Code / Kiro IDE

## ✅ Your Setup is Ready!

The autocomplete system is already configured and should work out of the box.

## How to Use Autocomplete

### Step 1: Type the translation function
```tsx
const t = useTranslations("auth.signin");
// or
const t = await getTranslations();
```

### Step 2: Call the function with empty quotes
```tsx
t("")
```

### Step 3: Trigger autocomplete
- **Windows/Linux**: Press `Ctrl + Space` inside the quotes
- **Mac**: Press `Cmd + Space` inside the quotes

### Step 4: See suggestions
You should see a dropdown list with all available translation keys:
- `title`
- `description`
- `email`
- `emailPlaceholder`
- `password`
- `passwordPlaceholder`
- `submit`
- etc.

## Example in Your Code

```tsx
// In hooks/auth/useLogin.ts
const t = useTranslations("auth.signin");

// Type t("") and press Ctrl+Space
const inputs = [
  {
    name: "email",
    label: t("email"), // ← Autocomplete works here
    //       ^ Place cursor here and press Ctrl+Space
    type: "email",
    placeholder: t("emailPlaceholder"),
  },
];
```

## Autocomplete for Different Namespaces

### Auth Signin Keys
```tsx
const t = useTranslations("auth.signin");
t("") // Shows: title, description, email, password, submit, etc.
```

### Auth Signup Keys
```tsx
const t = useTranslations("auth.signup");
t("") // Shows: title, description, name, email, role, etc.
t("roles.") // Shows: employee, company, owner, admin
```

### Auth Validation Keys
```tsx
const t = useTranslations("auth.validation");
t("") // Shows: emailInvalid, passwordMinLength, etc.
```

### Full Keys (All Namespaces)
```tsx
const t = useTypedTranslations();
t("") // Shows ALL keys: auth.signin.title, errors.noPermission, etc.
```

## Troubleshooting

### Autocomplete Not Working?

1. **Restart TypeScript Server**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "TypeScript: Restart TS Server"
   - Press Enter

2. **Check TypeScript Version**
   - Open terminal
   - Run: `npx tsc --version`
   - Should be 4.5 or higher

3. **Verify JSON Files**
   - Check `messages/en/auth.json` is valid JSON
   - No syntax errors or trailing commas

4. **Clear Cache**
   - Delete `.next` folder
   - Run: `npm run dev` again

5. **Reload IDE**
   - Close and reopen VS Code / Kiro IDE
   - Or press `Ctrl+Shift+P` → "Developer: Reload Window"

### Still Not Working?

Check these files exist and are correct:
- ✅ `types/i18n.ts` - Defines Messages type
- ✅ `types/i18n-types.ts` - Defines AllTranslationKeys
- ✅ `types/next-intl.d.ts` - Global IntlMessages declaration
- ✅ `tsconfig.json` - Has `resolveJsonModule: true`

## Testing Autocomplete

Open `examples/autocomplete-test.tsx` and try the autocomplete in different scenarios.

## Available Translation Keys

### Auth Keys
```
auth.signin.title
auth.signin.description
auth.signin.email
auth.signin.emailPlaceholder
auth.signin.password
auth.signin.passwordPlaceholder
auth.signin.submit
auth.signin.forgotPassword
auth.signin.noAccount
auth.signin.signup
auth.signin.invalidCredentials
auth.signin.unexpectedError
auth.signin.success

auth.signup.title
auth.signup.description
auth.signup.username
auth.signup.usernamePlaceholder
auth.signup.name
auth.signup.email
auth.signup.emailPlaceholder
auth.signup.role
auth.signup.password
auth.signup.passwordPlaceholder
auth.signup.confirmPassword
auth.signup.confirmPasswordPlaceholder
auth.signup.submit
auth.signup.hasAccount
auth.signup.signin
auth.signup.success
auth.signup.redirecting
auth.signup.roles.employee
auth.signup.roles.company
auth.signup.roles.owner
auth.signup.roles.admin

auth.validation.usernameRequired
auth.validation.nameRequired
auth.validation.emailInvalid
auth.validation.passwordMinLength
auth.validation.passwordRequired
auth.validation.passwordsNoMatch
auth.validation.codeRequired
auth.validation.codeLength

auth.logout.button
auth.logout.success
```

### Error Keys
```
errors.unauthorized.title
errors.unauthorized.description
errors.unauthorized.contact
errors.unauthorized.goToDashboard
errors.unauthorized.signIn
errors.noPermission
errors.noPermissionAction
errors.signInRequired
```

### Dashboard Keys
```
dashboard.admin.title
dashboard.admin.description
dashboard.admin.totalUsers
dashboard.admin.companies
dashboard.admin.systemHealth
dashboard.admin.settings
dashboard.admin.uptime
dashboard.admin.operational

dashboard.employee.title
dashboard.employee.description
dashboard.employee.profile
dashboard.employee.hoursToday
dashboard.employee.tasks
dashboard.employee.nextMeeting
dashboard.employee.profileComplete
dashboard.employee.hoursRemaining
dashboard.employee.tasksRemaining
dashboard.employee.teamStandup
```

### Session Keys
```
session.expired
session.expiredDescription
session.expiringSoon
session.expiringSoonDescription
```

## Quick Tips

1. **Use namespaced translations** for better autocomplete filtering
2. **Start typing** to filter suggestions (e.g., type "email" to see email-related keys)
3. **Arrow keys** to navigate suggestions
4. **Enter** to select a suggestion
5. **Escape** to close autocomplete menu

## Related Documentation

- `lib/translation-autocomplete.md` - Detailed autocomplete guide
- `lib/translations.md` - Server vs Client translations
- `examples/autocomplete-test.tsx` - Test component
- `examples/translation-examples.tsx` - Usage examples
