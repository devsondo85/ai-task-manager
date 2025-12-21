# Deploy to Vercel - Step by Step Guide

## 🚀 Complete Vercel Deployment Guide

This guide will help you deploy both your frontend and backend to Vercel.

---

## Prerequisites

- ✅ GitHub account (you have: `devsondo85`)
- ✅ Repository on GitHub: `devsondo85/ai-task-manager`
- ✅ Supabase credentials (already set up)
- ✅ OpenAI API key (if using AI features)

---

## Step 1: Sign Up / Log In to Vercel

1. Go to **[https://vercel.com](https://vercel.com)**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. You'll be redirected to Vercel dashboard

---

## Step 2: Deploy Backend First

### 2.1 Create Backend Project

1. In Vercel dashboard, click **"Add New Project"**
2. You'll see your GitHub repositories
3. Find and select **`devsondo85/ai-task-manager`**
4. Click **"Import"**

### 2.2 Configure Backend Project

**Project Settings:**
- **Project Name**: `ai-task-manager-backend` (or any name you like)
- **Framework Preset**: Select **"Other"** or **"Other (no framework)"**
- **Root Directory**: Click **"Edit"** and set to: `backend`
- **Build Command**: Leave empty (or `npm install`)
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add these:

```
SUPABASE_URL
```
Value: Your Supabase project URL (from Supabase dashboard)

```
SUPABASE_ANON_KEY
```
Value: Your Supabase anon/public key

```
OPENAI_API_KEY
```
Value: Your OpenAI API key (if you have one)

```
NODE_ENV
```
Value: `production`

```
PORT
```
Value: `5000` (or leave empty, Vercel handles this)

### 2.4 Deploy Backend

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Once deployed, you'll see a URL like: `https://ai-task-manager-backend.vercel.app`
4. **Copy this URL** - you'll need it for the frontend!

### 2.5 Test Backend

1. Visit: `https://your-backend-url.vercel.app/api/health`
2. You should see: `{"status":"ok","message":"AI Task Manager API is running",...}`
3. ✅ If this works, backend is deployed successfully!

---

## Step 3: Deploy Frontend

### 3.1 Create Frontend Project

1. In Vercel dashboard, click **"Add New Project"** again
2. Select the same repository: **`devsondo85/ai-task-manager`**
3. Click **"Import"**

### 3.2 Configure Frontend Project

**Project Settings:**
- **Project Name**: `ai-task-manager-frontend` (or any name)
- **Framework Preset**: Select **"Vite"** (should auto-detect)
- **Root Directory**: Click **"Edit"** and set to: `frontend`
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### 3.3 Add Environment Variable

Click **"Environment Variables"** and add:

```
VITE_API_URL
```
Value: `https://your-backend-url.vercel.app/api`

**Important**: Replace `your-backend-url` with your actual backend URL from Step 2.4!

Example:
```
VITE_API_URL=https://ai-task-manager-backend.vercel.app/api
```

### 3.4 Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Once deployed, you'll get a URL like: `https://ai-task-manager-frontend.vercel.app`
4. **This is your live app!** 🎉

---

## Step 4: Update CORS (If Needed)

If you get CORS errors when using the app:

1. Go to your **backend project** in Vercel
2. Go to **Settings** → **Environment Variables**
3. Add a new variable:

```
FRONTEND_URL
```
Value: Your frontend Vercel URL (e.g., `https://ai-task-manager-frontend.vercel.app`)

4. Go to **Deployments** → Click **"Redeploy"** (three dots menu)

Or update `backend/server.js` to include your frontend URL in CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

Then commit and push - Vercel will auto-deploy.

---

## Step 5: Test Your Deployment

1. **Visit your frontend URL**
2. **Test these features:**
   - ✅ View tasks (should load from database)
   - ✅ Create a new task
   - ✅ Move tasks between columns (drag & drop)
   - ✅ Edit a task
   - ✅ Use search and filters
   - ✅ View analytics dashboard
   - ✅ Test AI features (if OpenAI key is set)

---

## 🎯 Quick Reference

### Backend URL Format
```
https://your-backend-name.vercel.app
```

### Frontend URL Format
```
https://your-frontend-name.vercel.app
```

### API Endpoints
- Health: `https://your-backend-url.vercel.app/api/health`
- Tasks: `https://your-backend-url.vercel.app/api/tasks`
- AI: `https://your-backend-url.vercel.app/api/ai/*`

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch tasks"

**Solution:**
1. Check `VITE_API_URL` is set correctly in frontend environment variables
2. Verify backend is deployed and accessible
3. Check browser console for CORS errors
4. Update CORS settings (Step 4)

### Issue: "Database not configured"

**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in backend environment variables
2. Check Supabase project is active
3. Redeploy backend after adding variables

### Issue: "404 on routes"

**Solution:**
- Vercel handles SPA routing automatically with `vercel.json`
- If issues persist, check `frontend/vercel.json` exists

### Issue: Build fails

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Check Node.js version compatibility
4. Ensure root directory is set correctly

---

## 📝 Environment Variables Checklist

### Backend (Vercel)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `OPENAI_API_KEY` (optional)
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL` (for CORS)

### Frontend (Vercel)
- [ ] `VITE_API_URL` (your backend URL + `/api`)

---

## 🔄 Auto-Deployment

Vercel automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

**No need to manually redeploy!** Just push your code.

---

## 💰 Cost

**Vercel Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Automatic SSL certificates
- ✅ Custom domains

**Perfect for your project!** 🎉

---

## 🎉 You're Done!

Your AI Task Manager is now live on Vercel!

**Share your app:**
- Frontend URL: `https://your-frontend.vercel.app`
- Backend URL: `https://your-backend.vercel.app`

---

## Need Help?

1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

Happy deploying! 🚀

