# Deployment Guide

This guide will help you deploy the Plant Care Scheduler application to production.

## Architecture

- **Frontend**: React + Vite + MUI (deployed to Vercel)
- **Backend**: Spring Boot + Java 17 (deployed to Railway/Render)

## Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- Railway or Render account for backend
- Git repository with your code

## Backend Deployment (Railway)

### Step 1: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect the Spring Boot application automatically
5. Configure build settings:
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`
6. Add environment variables:
   - `SPRING_PROFILES_ACTIVE=production`
   - `DATABASE_URL` (Railway provides this automatically)
   - `JWT_SECRET` (generate a secure random string)
7. Deploy

### Step 2: Get Backend URL

After deployment, Railway will provide a URL like:
```
https://your-app-name.up.railway.app
```

Copy this URL for the frontend configuration.

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project" → "Import Git Repository"
3. Select your repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL from Railway (e.g., `https://your-app-name.up.railway.app/api`)
6. Click "Deploy"

### Step 2: Verify Deployment

Vercel will provide a URL like:
```
https://your-project-name.vercel.app
```

## Alternative: Deploy Backend to Render

If you prefer Render instead of Railway:

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Runtime: Docker
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`
5. Add environment variables (same as Railway)
6. Deploy

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (Railway/Render)
```
SPRING_PROFILES_ACTIVE=production
JWT_SECRET=your-secret-key-here
DATABASE_URL=provided-by-platform
```

## Post-Deployment Checklist

- [ ] Backend is accessible at its URL
- [ ] Frontend can connect to backend
- [ ] Login/registration works
- [ ] All pages load correctly
- [ ] API calls are successful

## Troubleshooting

### Frontend blank screen
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Ensure backend is running and accessible

### CORS errors
- Add frontend domain to backend CORS configuration
- Check `WebSecurityConfig.java` in backend

### Backend connection issues
- Verify backend is running
- Check backend logs for errors
- Ensure database is properly configured

## Default Users

The backend creates these default users on startup:
- Admin: `admin` / `admin123`
- Specialist: `specialist` / `specialist123`
- Premium: `premium` / `premium123`
- Standard: `user` / `user123`

## Monitoring

- **Vercel**: Built-in analytics and logs
- **Railway**: Built-in metrics and logs
- **Render**: Built-in metrics and logs

## Cost

- **Vercel**: Free tier available for hobby projects
- **Railway**: Free tier with $5 credit
- **Render**: Free tier for web services

## Scaling

For production use:
- Use managed databases (PostgreSQL on Railway/Render)
- Enable auto-scaling
- Set up monitoring and alerts
- Configure CDN for static assets
