# Vercel Environment Variables Guide

## Required Environment Variables for Vercel

When deploying to Vercel, you need to set these environment variables in your Vercel project settings.

---

## How to Add Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable below

---

## Environment Variables

### 1. VITE_API_URL
**Description**: Backend API URL (your Render deployment)  
**Value**: `https://your-backend-name.onrender.com/api/v1`  
**Example**: `https://cybersafe-backend.onrender.com/api/v1`

> **Important**: Replace `your-backend-name` with your actual Render service name  
> **Note**: Must include `/api/v1` at the end  
> **Scope**: Production, Preview, Development

---

### 2. VITE_CLERK_PUBLISHABLE_KEY
**Description**: Clerk authentication publishable key  
**Value**: Your Clerk publishable key from Clerk Dashboard  
**Example**: `pk_test_d29ya2FibGUtbWFybW90LTM4LmNsZXJrLmFjY291bnRzLmRldiQ`

> **Where to find**: [Clerk Dashboard](https://dashboard.clerk.com/) → Your App → API Keys  
> **Note**: This is a public key, safe to expose in frontend  
> **Scope**: Production, Preview, Development

---

## Step-by-Step Setup

### Step 1: Deploy Backend First
Before setting Vercel variables, deploy your backend to Render:
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Create new Web Service
3. Connect your GitHub repository
4. Deploy backend
5. **Copy the backend URL** (e.g., `https://cybersafe-backend.onrender.com`)

### Step 2: Set Vercel Environment Variables
1. Go to Vercel Dashboard
2. Click on your project (or create new)
3. Go to **Settings** → **Environment Variables**
4. Add variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api/v1` | Production, Preview, Development |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | Production, Preview, Development |

### Step 3: Deploy Frontend
1. In Vercel, click **Deployments**
2. Click **Deploy** or push to GitHub (auto-deploys)
3. Wait for deployment to complete
4. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 4: Update Backend CORS
1. Go back to Render
2. Open your backend service
3. Go to **Environment**
4. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   https://your-app.vercel.app,https://your-app-git-main.vercel.app
   ```
5. Save (backend will auto-redeploy)

---

## Verification

### Test Backend Connection
After deployment, test if frontend can reach backend:

1. Open browser console on your Vercel site
2. Check Network tab
3. Look for API calls to your Render backend
4. Should see 200 OK responses (not CORS errors)

### Test Clerk Authentication
1. Click "Sign In" on your Vercel site
2. Clerk modal should open
3. Complete authentication
4. Should redirect to `/chat`

---

## Common Issues

### Issue: CORS Error
**Symptom**: "Access to fetch at ... has been blocked by CORS policy"  
**Solution**: 
1. Check `ALLOWED_ORIGINS` in Render includes your Vercel URL
2. Make sure URL doesn't have trailing slash
3. Redeploy backend after changing

### Issue: "Failed to fetch"
**Symptom**: API calls fail with network error  
**Solution**:
1. Check `VITE_API_URL` is correct
2. Verify backend is running (visit backend URL in browser)
3. Check backend URL includes `/api/v1`

### Issue: Clerk not loading
**Symptom**: Clerk buttons don't work  
**Solution**:
1. Verify `VITE_CLERK_PUBLISHABLE_KEY` is correct
2. Check Clerk Dashboard → Domains includes your Vercel URL
3. Clear browser cache and try again

---

## Environment Variable Template

Copy this template for quick setup:

```bash
# Vercel Environment Variables

# Backend API (Replace with your Render URL)
VITE_API_URL=https://your-backend-name.onrender.com/api/v1

# Clerk Authentication (Replace with your Clerk key)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
```

---

## Production Checklist

Before going live:

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] `VITE_API_URL` set in Vercel
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` set in Vercel
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied
- [ ] `ALLOWED_ORIGINS` updated in Render
- [ ] Clerk domain configured
- [ ] Test authentication works
- [ ] Test API calls work
- [ ] No CORS errors in console

---

## Security Notes

✅ **Safe to expose**:
- `VITE_API_URL` - Public API endpoint
- `VITE_CLERK_PUBLISHABLE_KEY` - Public key designed for frontend

❌ **Never expose**:
- Database credentials
- Secret keys
- API keys (backend only)
- Clerk secret key

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables
- **Render Docs**: https://render.com/docs/environment-variables
- **Clerk Docs**: https://clerk.com/docs/deployments/overview

---

**Last Updated**: 2025-11-30  
**Status**: ✅ Ready for Production
