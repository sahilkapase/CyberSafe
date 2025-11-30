# Production Deployment Guide

Complete guide for deploying CyberSafe to production using Render (backend) and Vercel (frontend).

---

## Prerequisites

- [ ] GitHub account
- [ ] Render account (free tier available)
- [ ] Vercel account (free tier available)
- [ ] NeonDB PostgreSQL database
- [ ] Clerk account (for authentication)
- [ ] Groq API key (for AI detection)

---

## Part 1: Database Setup (NeonDB)

### 1. Create NeonDB Database

1. Go to [NeonDB](https://neon.tech/)
2. Create a new project
3. Copy your connection string (format: `postgresql://user:password@host/database`)
4. Save it for later use

### 2. Database Schema

The database tables will be created automatically on first run via SQLAlchemy migrations in [main.py](file:///d:/Desktop/major-project/CyberSafe/backend/main.py#L23).

---

## Part 2: Backend Deployment (Render)

### 1. Prepare Repository

**Push your code to GitHub:**
```bash
cd d:/Desktop/major-project/CyberSafe/backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cybersafe-backend.git
git push -u origin main
```

### 2. Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**
   - Select `cybersafe-backend` repository
   - Branch: `main`

4. **Configure Service:**
   - **Name**: `cybersafe-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `backend` if monorepo)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. **Set Environment Variables:**

Click "Advanced" → "Add Environment Variable":

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | From NeonDB |
| `SECRET_KEY` | Generate random string | Use: `openssl rand -hex 32` |
| `GROQ_API_KEY` | Your Groq API key | From groq.com |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Update after frontend deploy |
| `PYTHON_VERSION` | `3.12.0` | Optional |

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy your backend URL**: `https://cybersafe-backend.onrender.com`

### 3. Verify Backend

Visit: `https://your-backend.onrender.com/`

Should see:
```json
{
  "message": "CyberShield API",
  "version": "1.0.0",
  "status": "running"
}
```

---

## Part 3: Frontend Deployment (Vercel)

### 1. Prepare Repository

**Push frontend to GitHub:**
```bash
cd d:/Desktop/major-project/CyberSafe/safe-haven-chat
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cybersafe-frontend.git
git push -u origin main
```

### 2. Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New..." → "Project"**

3. **Import Git Repository**
   - Select `cybersafe-frontend`
   - Click "Import"

4. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or `safe-haven-chat` if monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Set Environment Variables:**

Click "Environment Variables":

| Key | Value |
|-----|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Your Clerk publishable key |
| `VITE_API_URL` | `https://your-backend.onrender.com/api/v1` |

6. **Click "Deploy"**

7. **Wait for deployment** (2-5 minutes)

8. **Copy your frontend URL**: `https://your-app.vercel.app`

### 3. Update Backend CORS

Go back to Render → Your Backend Service → Environment:

Update `ALLOWED_ORIGINS`:
```
https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

Click "Save Changes" (backend will redeploy)

---

## Part 4: Clerk Configuration

### 1. Update Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **"Paths"** or **"Domains"**
4. Add your production domain: `https://your-app.vercel.app`

### 2. Update Redirect URLs

In Clerk Dashboard → **"Paths"**:
- **Sign-in URL**: `https://your-app.vercel.app/login`
- **Sign-up URL**: `https://your-app.vercel.app/signup`
- **After sign-in**: `https://your-app.vercel.app/chat`
- **After sign-up**: `https://your-app.vercel.app/chat`

---

## Part 5: Testing Production Deployment

### 1. Test Backend

```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

### 2. Test Frontend

1. Visit `https://your-app.vercel.app`
2. Click "Get Started" or "Sign In"
3. Complete authentication
4. Verify redirect to `/chat`
5. Send a test message
6. Upload a test image

### 3. Test Admin Panel

1. Set your user as admin in database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
2. Visit `https://your-app.vercel.app/admin`
3. Verify all tabs load correctly

---

## Part 6: Post-Deployment Configuration

### 1. Database Migrations

If you make schema changes:

```bash
# Connect to your Render service shell
# Or run locally pointing to production DB
alembic upgrade head
```

### 2. Monitor Logs

**Render:**
- Dashboard → Your Service → Logs

**Vercel:**
- Dashboard → Your Project → Deployments → View Function Logs

### 3. Set Up Custom Domain (Optional)

**Vercel:**
1. Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Render:**
1. Dashboard → Your Service → Settings → Custom Domain
2. Add your custom domain
3. Update DNS records

---

## Environment Variables Reference

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
SECRET_KEY=your-secret-key-min-32-characters
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env.local)
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

---

## Troubleshooting

### Backend Issues

**Problem**: "Module not found" error
- **Solution**: Ensure `requirements.txt` is up to date
  ```bash
  pip freeze > requirements.txt
  git add requirements.txt
  git commit -m "Update requirements"
  git push
  ```

**Problem**: Database connection fails
- **Solution**: Check `DATABASE_URL` format and NeonDB connection string

**Problem**: CORS errors
- **Solution**: Verify `ALLOWED_ORIGINS` includes your Vercel domain

### Frontend Issues

**Problem**: "Failed to fetch" errors
- **Solution**: Check `VITE_API_URL` points to correct backend URL

**Problem**: Clerk authentication fails
- **Solution**: Verify `VITE_CLERK_PUBLISHABLE_KEY` and Clerk domain settings

**Problem**: Blank page after deployment
- **Solution**: Check Vercel build logs for errors

### Common Issues

**Problem**: 502 Bad Gateway on Render
- **Solution**: Check if backend is listening on `$PORT` environment variable

**Problem**: Environment variables not updating
- **Solution**: Redeploy after changing env vars (Render auto-redeploys, Vercel needs manual redeploy)

---

## Performance Optimization

### Backend (Render)

1. **Enable connection pooling** in database settings
2. **Add caching** for frequently accessed data
3. **Upgrade to paid plan** for better performance (if needed)

### Frontend (Vercel)

1. **Enable Edge Functions** for faster response times
2. **Optimize images** using Vercel Image Optimization
3. **Use CDN** for static assets

---

## Security Checklist

- [ ] All environment variables set correctly
- [ ] `SECRET_KEY` is random and secure (32+ characters)
- [ ] CORS origins restricted to your domains only
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] Database credentials secured
- [ ] API keys not exposed in frontend code
- [ ] `.env` files in `.gitignore`

---

## Monitoring & Maintenance

### Set Up Monitoring

1. **Render**: Built-in metrics in dashboard
2. **Vercel**: Analytics available in dashboard
3. **Database**: NeonDB monitoring dashboard

### Regular Maintenance

- Monitor error logs weekly
- Review incident reports in admin panel
- Update dependencies monthly
- Backup database regularly (NeonDB has automatic backups)

---

## Rollback Procedure

### Render Rollback

1. Dashboard → Your Service → Events
2. Find previous successful deployment
3. Click "Rollback to this version"

### Vercel Rollback

1. Dashboard → Your Project → Deployments
2. Find previous deployment
3. Click "..." → "Promote to Production"

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Configure environment variables
4. ✅ Update Clerk settings
5. ✅ Test production deployment
6. ⚠️ Set up custom domain (optional)
7. ⚠️ Configure monitoring alerts
8. ⚠️ Set up CI/CD pipeline (optional)

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **NeonDB Docs**: https://neon.tech/docs
- **Clerk Docs**: https://clerk.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Vite Docs**: https://vitejs.dev/

---

## Summary

Your application is now deployed to production! 🎉

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: NeonDB PostgreSQL
- **Auth**: Clerk
- **AI**: Groq

Monitor your logs and enjoy your deployed application!
