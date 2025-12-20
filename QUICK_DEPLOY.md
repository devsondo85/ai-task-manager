# Quick Deployment Guide

## 🚀 Fastest Way: Deploy to Vercel (Recommended)

### Step 1: Deploy Backend to Render (Free)

1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `devsondo85/ai-task-manager`
4. Configure:
   - **Name**: `ai-task-manager-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=production
   PORT=10000
   ```
6. Click "Create Web Service"
7. **Wait for deployment** and copy the URL (e.g., `https://ai-task-manager-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "Add New Project"
3. Import repository: `devsondo85/ai-task-manager`
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Add Environment Variable:
   ```
   VITE_API_URL=https://ai-task-manager-backend.onrender.com/api
   ```
   (Replace with your actual Render backend URL)
6. Click "Deploy"
7. **Done!** Your app is live! 🎉

---

## 🔧 Alternative: Deploy Both to Vercel

### Option A: Separate Projects (Easier)

**Backend:**
1. Vercel → New Project → Select repo
2. Root Directory: `backend`
3. Framework: Other
4. Add environment variables
5. Deploy

**Frontend:**
1. Vercel → New Project → Select repo
2. Root Directory: `frontend`
3. Framework: Vite
4. Add `VITE_API_URL` = your backend URL
5. Deploy

### Option B: Monorepo (Advanced)

Use the `vercel.json` in the root directory (already created).

---

## 📝 Environment Variables Checklist

### Backend (Render/Vercel)
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `OPENAI_API_KEY`
- ✅ `NODE_ENV=production`
- ✅ `PORT=10000` (Render) or auto (Vercel)

### Frontend (Vercel)
- ✅ `VITE_API_URL=https://your-backend-url.com/api`

---

## 🧪 Test Your Deployment

1. **Backend Health Check**: Visit `https://your-backend-url.com/api/health`
2. **Frontend**: Visit your Vercel URL
3. **Test Features**:
   - Create a task
   - Move tasks between columns
   - Use AI suggestions

---

## 🐛 Troubleshooting

**CORS Errors?**
- Update `backend/server.js` CORS to include your frontend URL:
  ```javascript
  origin: ['https://your-frontend.vercel.app']
  ```

**404 on Frontend Routes?**
- Vercel handles this automatically with `vercel.json`

**API Not Working?**
- Check `VITE_API_URL` is set correctly
- Verify backend is running (check Render/Vercel logs)
- Test backend URL directly in browser

---

## 💰 Cost

- **Render**: Free (spins down after 15 min inactivity)
- **Vercel**: Free (generous limits)
- **Total**: $0/month

---

## 🎯 Next Steps After Deployment

1. Update CORS in backend to include your frontend URL
2. Test all features
3. Share your live URL! 🚀

