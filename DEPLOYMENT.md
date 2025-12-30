# Deployment Guide

This guide will help you deploy the SVG Processor application to production using free hosting services.

## Architecture

- **Frontend**: Vercel (React/Vite app)
- **Backend**: Render (Node.js/Express API)
- **Database**: MongoDB Atlas (Cloud database)

All services offer free tiers with GitHub integration for automatic deployments.

---

## Step 1: Set Up MongoDB Atlas (Database)

### Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email or GitHub account
3. Choose the **FREE** tier (M0 Sandbox)
4. Select a cloud provider and region (choose one closest to you)
5. Click **Create Cluster** (takes 3-5 minutes)

### Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your actual credentials
5. Add `/svg-processor` before the `?` to specify the database name:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/svg-processor?retryWrites=true&w=majority
   ```

### Whitelist IP Addresses

1. Go to **Network Access** in MongoDB Atlas
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
4. Click **Confirm**

**Save your connection string** - you'll need it for both Render and local development.

---

## Step 2: Deploy Backend to Render

### Create Render Account

1. Go to https://render.com
2. Sign up with your **GitHub account**
3. Authorize Render to access your repositories

### Deploy Backend

1. From Render Dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository (`home_assignment`)
3. Configure the service:
   - **Name**: `svg-processor-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `claude/svg-upload-processing-fKQRg` (or your main branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. Add **Environment Variables**:
   - Click **Advanced** → **Add Environment Variable**
   - Add these:
     ```
     NODE_ENV = production
     PORT = 10000
     MONGODB_URI = <your MongoDB Atlas connection string>
     ```

5. Click **Create Web Service**

6. Wait for deployment (3-5 minutes)

7. **Copy your backend URL** (looks like):
   ```
   https://svg-processor-backend.onrender.com
   ```

**Important**: Free tier sleeps after 15 min of inactivity. First request may take 30-60 seconds to wake up.

---

## Step 3: Deploy Frontend to Vercel

### Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with your **GitHub account**
3. Authorize Vercel to access your repositories

### Deploy Frontend

1. From Vercel Dashboard, click **Add New** → **Project**
2. Import your GitHub repository (`home_assignment`)
3. Configure the project:
   - **Project Name**: `svg-processor` (or your choice)
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. Add **Environment Variables**:
   - Click **Environment Variables**
   - Add:
     ```
     VITE_API_URL = <your Render backend URL>
     ```
     Example: `https://svg-processor-backend.onrender.com`

5. Click **Deploy**

6. Wait for deployment (1-2 minutes)

7. **Your app is live!** Vercel will show you the URL (looks like):
   ```
   https://svg-processor-abc123.vercel.app
   ```

---

## Step 4: Test Your Deployment

1. Open your Vercel URL in a browser
2. Upload one of the example SVG files from `examples/`
3. View the design details and Canvas preview
4. Test hover interactions on rectangles

**Note**: The first request to the backend may take 30-60 seconds if Render has put it to sleep.

---

## Automatic Deployments

Both Vercel and Render will automatically deploy when you push to your GitHub repository:

```bash
git add .
git commit -m "Update feature"
git push origin claude/svg-upload-processing-fKQRg
```

- **Vercel**: Deploys within 1-2 minutes
- **Render**: Deploys within 3-5 minutes

---

## Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/svg-processor?retryWrites=true&w=majority
```

### Frontend (Vercel)
```env
VITE_API_URL=https://svg-processor-backend.onrender.com
```

### Local Development
Create `backend/.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/svg-processor
NODE_ENV=development
```

Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:3001
```

---

## Troubleshooting

### Backend not responding
- Check Render logs: Dashboard → Service → Logs
- Verify MongoDB connection string is correct
- Free tier sleeps after inactivity - wait 30-60s for wake up

### Frontend can't connect to backend
- Verify `VITE_API_URL` in Vercel environment variables
- Check that Render backend URL is correct
- Ensure backend is running (check Render logs)

### CORS errors
- The backend already has CORS enabled
- If you see CORS errors, verify the backend URL in frontend environment variables

### MongoDB connection failed
- Check IP whitelist in MongoDB Atlas (should allow all: 0.0.0.0/0)
- Verify connection string has correct username/password
- Ensure database name is included in connection string

---

## Costs

All services used are **100% FREE**:

- **MongoDB Atlas**: Free M0 tier (512 MB storage)
- **Render**: Free tier (750 hours/month)
- **Vercel**: Free hobby plan (unlimited bandwidth)

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to your project in Vercel
2. Settings → Domains
3. Add your domain
4. Follow DNS configuration instructions

### Add Custom Domain to Render

1. Go to your service in Render
2. Settings → Custom Domain
3. Add your domain
4. Update DNS records as instructed

---

## Monitoring

### Render

- View logs: Dashboard → Service → Logs
- View metrics: Dashboard → Service → Metrics

### Vercel

- View deployments: Project → Deployments
- View analytics: Project → Analytics

### MongoDB Atlas

- View metrics: Cluster → Metrics
- View logs: Cluster → Logs

---

## Support

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

---

Your application is now live and accessible from anywhere! 🚀
