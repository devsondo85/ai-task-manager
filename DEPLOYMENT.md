# Deployment Guide for AI Task Manager

This guide will help you deploy your AI Task Manager application to production.

## Architecture Overview

- **Frontend**: React + Vite (deploy to Vercel/Netlify)
- **Backend**: Express.js (deploy to Render/Railway/Vercel)
- **Database**: Supabase (already cloud-hosted)

## Prerequisites

1. GitHub account (you already have this)
2. Vercel account (free) - for frontend
3. Render account (free) - for backend
4. Supabase project (already set up)

---

## Option 1: Deploy to Vercel (Recommended - Easiest)

### Frontend Deployment (Vercel)

1. **Go to [Vercel](https://vercel.com)** and sign up/login with GitHub

2. **Import your repository**:
   - Click "Add New Project"
   - Select `devsondo85/ai-task-manager`
   - Set **Root Directory** to `frontend`
   - Framework Preset: **Vite**

3. **Configure Environment Variables**:
   - Add: `VITE_API_URL` = `https://your-backend-url.vercel.app/api`
   - (You'll get this after deploying the backend)

4. **Deploy**: Click "Deploy"

### Backend Deployment (Vercel)

1. **Create a new project** in Vercel
   - Select the same repository
   - Set **Root Directory** to `backend`
   - Framework Preset: **Other**

2. **Configure Environment Variables**:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   PORT=5000
   NODE_ENV=production
   ```

3. **Deploy**: Click "Deploy"

---

## Option 2: Deploy to Render (Alternative)

### Frontend Deployment (Render - Static Site)

1. **Go to [Render](https://render.com)** and sign up/login

2. **Create New Static Site**:
   - Connect your GitHub repository
   - Name: `ai-task-manager-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

3. **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`

### Backend Deployment (Render - Web Service)

1. **Create New Web Service**:
   - Connect your GitHub repository
   - Name: `ai-task-manager-backend`
   - Environment: **Node**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`

2. **Environment Variables**:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=production
   PORT=10000
   ```

3. **Important**: Render provides a free tier but services spin down after inactivity. Consider upgrading for always-on service.

---

## Option 3: Deploy to Railway (Alternative)

### Both Frontend and Backend

1. **Go to [Railway](https://railway.app)** and sign up/login with GitHub

2. **Deploy Backend**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add service → Select `backend` folder
   - Add environment variables (same as Render)
   - Railway auto-detects Node.js

3. **Deploy Frontend**:
   - Add another service → Select `frontend` folder
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview` (or use static hosting)
   - Add environment variable: `VITE_API_URL` = your backend URL

---

## Step-by-Step: Vercel Deployment (Recommended)

### Step 1: Deploy Backend First

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import `devsondo85/ai-task-manager`
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty or `npm install`)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`
6. Add Environment Variables:
   ```
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   ```
7. Click "Deploy"
8. **Copy the deployment URL** (e.g., `https://ai-task-manager-backend.vercel.app`)

### Step 2: Deploy Frontend

1. In Vercel, click "Add New Project" again
2. Import the same repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   (Replace with your actual backend URL from Step 1)
5. Click "Deploy"

### Step 3: Update CORS (if needed)

If you get CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

---

## Environment Variables Reference

### Backend (.env)
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## Post-Deployment Checklist

- [ ] Backend is accessible at the deployment URL
- [ ] Frontend can connect to backend API
- [ ] Database connection works (test by creating a task)
- [ ] AI features work (test priority suggestion)
- [ ] CORS is configured correctly
- [ ] Environment variables are set correctly

---

## Troubleshooting

### CORS Errors
- Make sure your backend CORS configuration includes your frontend URL
- Check that `VITE_API_URL` is set correctly

### 404 Errors on Frontend Routes
- Ensure your hosting platform is configured for SPA routing (Vercel handles this automatically)

### Database Connection Errors
- Verify Supabase credentials are correct
- Check that Supabase project is active
- Ensure database schema is applied

### Build Failures
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs for specific errors

---

## Quick Deploy Commands

### Test Production Build Locally

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

---

## Support

If you encounter issues:
1. Check deployment logs in your hosting platform
2. Verify all environment variables are set
3. Test API endpoints directly
4. Check browser console for frontend errors

---

## Cost Estimate

- **Vercel**: Free tier (sufficient for small projects)
- **Render**: Free tier (with limitations)
- **Railway**: $5/month for always-on service
- **Supabase**: Free tier (up to 500MB database)
- **OpenAI**: Pay-as-you-go (very cheap for small usage)

**Total**: $0-5/month depending on platform choice

