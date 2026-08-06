# Deployment Guide

## Environment Variables Configuration

### Required Environment Variables

The application requires the following environment variables to be set:

#### Backend API Configuration
```
BASE_URL=https://your-api-domain.com/api
```

#### NextAuth Configuration
```
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-production-domain.com
```

### Development vs Production

#### Development (`.env` or `.env.local`)
```env
BASE_URL=https://joboffers-main-uj2ehj.laravel.cloud/api
NEXTAUTH_SECRET=dd55d2830b4e4c925c62fb41b791c917be25bbd7f6254d1cddb12ccfc4c86e5f6836aa136786d86014635fc9993d9b7659a2b050f270a2c9d44f525c54cbae87
NEXTAUTH_URL=http://localhost:3000
```

#### Production (`.env.production`)
```env
BASE_URL=https://joboffers-main-uj2ehj.laravel.cloud/api
NEXTAUTH_SECRET=dd55d2830b4e4c925c62fb41b791c917be25bbd7f6254d1cddb12ccfc4c86e5f6836aa136786d86014635fc9993d9b7659a2b050f270a2c9d44f525c54cbae87
NEXTAUTH_URL=https://your-production-domain.com
```

**⚠️ IMPORTANT:** Replace `https://your-production-domain.com` with your actual production domain!

Examples:
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- Custom domain: `https://jobs.yourdomain.com`

## Common Deployment Issues

### Error: "Unexpected token '<', \"<!DOCTYPE \"... is not valid JSON"

**Cause:** This error occurs when:
1. `NEXTAUTH_URL` is not set correctly in production
2. `NEXTAUTH_URL` is set to `localhost` in production
3. `NEXTAUTH_SECRET` environment variable is missing
4. NextAuth route is not being recognized in production build

**Solution:**

1. **Set Environment Variables in Vercel:**
   - Go to: Project Settings → Environment Variables
   - Add these variables for **Production** environment:
     ```
     NEXTAUTH_SECRET=dd55d2830b4e4c925c62fb41b791c917be25bbd7f6254d1cddb12ccfc4c86e5f6836aa136786d86014635fc9993d9b7659a2b050f270a2c9d44f525c54cbae87
     NEXTAUTH_URL=https://jobs-employment-app.vercel.app
     BASE_URL=https://joboffers-main-uj2ehj.laravel.cloud/api
     ```
   
2. **Redeploy After Setting Variables:**
   - Vercel: Go to Deployments → Click on latest deployment → Redeploy
   - Or push a new commit to trigger deployment

3. **Verify Health Endpoint:**
   - Visit: `https://jobs-employment-app.vercel.app/api/health`
   - Check that all environment variables show as `true`

4. **Clear Browser Cache:**
   - Clear cookies and site data
   - Try in incognito/private mode

5. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments → View Build Logs
   - Look for any errors during build

**Important for Vercel Deployment:**
- Use the EXACT Vercel domain: `https://jobs-employment-app.vercel.app`
- No trailing slash
- Must be HTTPS
- Environment variables must be set BEFORE deploying

### NextAuth Session Issues

If you're experiencing authentication issues:

1. **Check Environment Variables:**
   ```bash
   # In your deployment platform (Vercel, Netlify, etc.)
   echo $NEXTAUTH_URL
   echo $NEXTAUTH_SECRET
   ```

2. **Verify API Route:**
   - Visit: `https://your-domain.com/api/auth/session`
   - Should return JSON, not HTML

3. **Clear Browser Cache:**
   - Clear cookies and local storage
   - Try in incognito mode

## Deployment Platforms

### Vercel

1. **Add Environment Variables:**
   - Go to: Project Settings → Environment Variables
   - Add:
     - `BASE_URL`: `https://joboffers-main-uj2ehj.laravel.cloud/api`
     - `NEXTAUTH_SECRET`: (your secret)
     - `NEXTAUTH_URL`: `https://your-app.vercel.app`

2. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

### Netlify

1. **Add Environment Variables:**
   - Go to: Site Settings → Environment Variables
   - Add the same variables as above
   - Set `NEXTAUTH_URL` to your Netlify domain

2. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### Custom Server (Docker, VPS, etc.)

1. **Create `.env.production`:**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Build and Start:**
   ```bash
   npm run build
   NODE_ENV=production npm start
   ```

## Generating NEXTAUTH_SECRET

To generate a new secret:

```bash
openssl rand -base64 32
```

Or use this online tool: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

## Health Check

After deployment, verify:

1. ✅ Homepage loads: `https://your-domain.com`
2. ✅ API route works: `https://your-domain.com/api/auth/session`
3. ✅ Login works: Try logging in
4. ✅ Session persists: Refresh page, should stay logged in

## Troubleshooting

### Still Getting HTML Instead of JSON?

1. Check browser console for the exact error
2. Verify environment variables are set in deployment platform
3. Ensure build completed successfully
4. Check deployment logs for errors
5. Try hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Session Not Persisting?

1. Check if cookies are being set (DevTools → Application → Cookies)
2. Ensure `NEXTAUTH_URL` matches your domain exactly
3. Check if HTTPS is enabled (required for production)
4. Verify no CORS issues in browser console

## Support

If issues persist:
1. Check browser console errors
2. Check server logs
3. Verify all environment variables are set correctly
4. Ensure domain configuration is correct
