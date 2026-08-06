# Vercel Deployment Quick Fix Guide

## 🚨 Current Issue: Session Error After Login

You're getting redirected to `/api/auth/error` with this error:
```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## ✅ Step-by-Step Fix

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `jobs-employment-app`
3. Go to: **Settings** → **Environment Variables**
4. Add these THREE variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXTAUTH_SECRET` | `dd55d2830b4e4c925c62fb41b791c917be25bbd7f6254d1cddb12ccfc4c86e5f6836aa136786d86014635fc9993d9b7659a2b050f270a2c9d44f525c54cbae87` | Production |
| `NEXTAUTH_URL` | `https://jobs-employment-app.vercel.app` | Production |
| `BASE_URL` | `https://joboffers-main-uj2ehj.laravel.cloud/api` | Production |

**IMPORTANT:**
- Variable names are CASE SENSITIVE
- Use `NEXTAUTH_SECRET` NOT `AUTH_SECRET`
- `NEXTAUTH_URL` must match your Vercel domain EXACTLY
- No trailing slash on URLs

### Step 2: Redeploy

After adding the variables:

**Option A: Redeploy from Dashboard**
1. Go to: **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"** button
4. Wait for deployment to complete

**Option B: Push a New Commit**
```bash
git add .
git commit -m "Fix: Add NextAuth configuration"
git push
```

### Step 3: Verify Deployment

1. **Check Health Endpoint:**
   Visit: https://jobs-employment-app.vercel.app/api/health
   
   Should show:
   ```json
   {
     "status": "ok",
     "env": {
       "hasNextAuthSecret": true,
       "hasNextAuthUrl": true,
       "nextAuthUrl": "https://jobs-employment-app.vercel.app",
       "hasBaseUrl": true,
       "nodeEnv": "production"
     }
   }
   ```

2. **Test Auth Session:**
   Visit: https://jobs-employment-app.vercel.app/api/auth/session
   
   Should return JSON (not HTML):
   ```json
   {}  // or user session if logged in
   ```

3. **Test Login:**
   - Go to: https://jobs-employment-app.vercel.app/auth/login
   - Log in with credentials
   - Should redirect to homepage (not error page)

### Step 4: Clear Browser Cache

After successful deployment:
1. Open DevTools (F12)
2. Right-click on refresh button → **Empty Cache and Hard Reload**
3. Or try in **Incognito/Private Mode**

## 🔍 Debugging

### If It Still Doesn't Work:

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click on deployment → View Logs
   - Look for any errors

2. **Check Function Logs:**
   - Vercel Dashboard → Logs tab
   - Filter by: `/api/auth`
   - Look for errors when accessing session

3. **Verify Environment Variables:**
   ```bash
   # In Vercel CLI (if installed)
   vercel env ls
   ```

4. **Check Browser Console:**
   - Open DevTools → Console tab
   - Look for detailed error messages

### Common Mistakes:

❌ **Wrong:** `AUTH_SECRET` (should be `NEXTAUTH_SECRET`)
❌ **Wrong:** `http://localhost:3000` in production
❌ **Wrong:** `https://jobs-employment-app.vercel.app/` (trailing slash)
✅ **Correct:** `https://jobs-employment-app.vercel.app`

## 📝 Environment Variables Checklist

After setting variables, verify:
- [ ] `NEXTAUTH_SECRET` is set (not AUTH_SECRET)
- [ ] `NEXTAUTH_URL` matches your Vercel domain exactly
- [ ] `BASE_URL` points to your API
- [ ] All variables are set for "Production" environment
- [ ] Redeployed after adding variables
- [ ] Health endpoint shows all values as `true`
- [ ] Session endpoint returns JSON (not HTML)

## 🎯 Expected Behavior

**Before Fix:**
- Login → Redirect to `/api/auth/error`
- Console error: "Unexpected token '<'"
- Session endpoint returns HTML

**After Fix:**
- Login → Redirect to homepage
- No console errors
- Session endpoint returns JSON
- Authentication works correctly

## 🆘 Still Having Issues?

If the problem persists after following all steps:

1. **Check Vercel Status:** https://www.vercel-status.com/
2. **Try Different Browser:** Test in Chrome, Firefox, Safari
3. **Check Network Tab:** DevTools → Network → Look for failed requests
4. **Contact Support:** Include:
   - Deployment URL
   - Build logs
   - Browser console errors
   - Network request/response

## 📞 Quick Reference

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your App:** https://jobs-employment-app.vercel.app
- **Health Check:** https://jobs-employment-app.vercel.app/api/health
- **Session Check:** https://jobs-employment-app.vercel.app/api/auth/session
- **Login Page:** https://jobs-employment-app.vercel.app/auth/login

---

**Last Updated:** Based on current deployment issue
**Project:** jobs-employment-app.vercel.app
