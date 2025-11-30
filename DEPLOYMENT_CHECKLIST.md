# Production Deployment Checklist

## Pre-Deployment

### Backend (Render)
- [ ] `requirements.txt` is up to date (`pip freeze > requirements.txt`)
- [ ] `render.yaml` configured
- [ ] `.env.example` created for reference
- [ ] Code pushed to GitHub
- [ ] Database connection string ready (NeonDB)
- [ ] Groq API key ready
- [ ] Secret key generated (`openssl rand -hex 32`)

### Frontend (Vercel)
- [ ] `vercel.json` configured with security headers
- [ ] `.env.example` created for reference
- [ ] Code pushed to GitHub
- [ ] Clerk publishable key ready
- [ ] Backend URL ready (after Render deployment)

## Deployment Steps

### 1. Deploy Backend First
1. [ ] Create Render web service
2. [ ] Connect GitHub repository
3. [ ] Set environment variables:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `GROQ_API_KEY`
   - `ALLOWED_ORIGINS` (add frontend URL after step 2)
4. [ ] Deploy and copy backend URL

### 2. Deploy Frontend
1. [ ] Create Vercel project
2. [ ] Connect GitHub repository
3. [ ] Set environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_URL` (use backend URL from step 1)
4. [ ] Deploy and copy frontend URL

### 3. Update CORS
1. [ ] Go back to Render
2. [ ] Update `ALLOWED_ORIGINS` with frontend URL
3. [ ] Save (auto-redeploys)

### 4. Configure Clerk
1. [ ] Add production domain to Clerk
2. [ ] Update redirect URLs
3. [ ] Test authentication

## Post-Deployment

- [ ] Test backend health: `curl https://your-backend.onrender.com/health`
- [ ] Test frontend loads correctly
- [ ] Test user registration
- [ ] Test user login
- [ ] Test sending messages
- [ ] Test image upload
- [ ] Test NSFW detection
- [ ] Test admin panel access
- [ ] Monitor logs for errors

## Environment Variables

### Backend (.env on Render)
```
DATABASE_URL=postgresql://...
SECRET_KEY=<random-32-char-string>
GROQ_API_KEY=gsk_...
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env on Vercel)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

## Troubleshooting

- **CORS errors**: Check `ALLOWED_ORIGINS` includes your Vercel domain
- **Database errors**: Verify `DATABASE_URL` connection string
- **Auth errors**: Check Clerk configuration and publishable key
- **502 errors**: Ensure backend listens on `$PORT` variable

## Files Created

- ✅ `backend/render.yaml` - Render deployment config
- ✅ `backend/.env.example` - Environment variables template
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ `safe-haven-chat/vercel.json` - Vercel deployment config
- ✅ `safe-haven-chat/.env.example` - Frontend env template
- ✅ `DEPLOYMENT.md` - Complete deployment guide

## Ready to Deploy! 🚀

Follow the steps in [DEPLOYMENT.md](file:///d:/Desktop/major-project/CyberSafe/DEPLOYMENT.md) for detailed instructions.
