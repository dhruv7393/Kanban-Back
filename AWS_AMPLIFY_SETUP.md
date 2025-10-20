# AWS Amplify Environment Variables Setup Guide

## 🔧 Changes Made

### 1. Updated `amplify.yml`
- Added `environmentVariables` section to properly configure AWS environment variables
- Listed required environment variables: `MONGODB_URI`, `PORT`, `CORS_ORIGIN`, `NODE_ENV`

### 2. Created Environment Configuration (`src/config/environment.ts`)
- Centralized environment variable management
- Added validation for production environment
- Added configuration logging for debugging
- Proper fallback values for development

### 3. Updated Application Files
- Modified `src/index.ts` to use centralized environment configuration
- Updated `src/test-server.ts` to use the new environment setup
- Modified `src/config/database.ts` to use centralized config
- Removed direct `process.env` usage in favor of typed configuration

## 🚀 AWS Amplify Console Setup

### Step 1: Access Environment Variables
1. Open AWS Amplify Console
2. Navigate to your app
3. Go to "App settings" → "Environment variables"

### Step 2: Add Required Variables
Add the following environment variables:

```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/kanban
Description: MongoDB connection string

Key: PORT
Value: 3001
Description: Server port (optional, defaults to 3001)

Key: CORS_ORIGIN
Value: https://your-frontend-domain.amplifyapp.com
Description: Frontend URL for CORS configuration

Key: NODE_ENV
Value: production
Description: Node environment
```

### Step 3: Secure Variables (Recommended)
For sensitive data like database credentials, consider using:
- AWS Systems Manager Parameter Store
- AWS Secrets Manager
- Amplify Environment Variable encryption

### Step 4: Deploy
After setting environment variables:
```bash
git add .
git commit -m "Configure AWS Amplify environment variables"
git push origin main
```

## 🔍 Verification

### Check Logs
In AWS Amplify build logs, you should see:
```
🔧 Current configuration:
   - Environment: production
   - Port: 3001
   - CORS Origin: https://your-domain.com
   - MongoDB: ✅ Configured
```

### Test Endpoints
- Health check: `https://your-api-domain.com/api/health`
- API root: `https://your-api-domain.com/`

## 🛠️ Troubleshooting

### Common Issues:
1. **Missing Variables**: Check AWS Amplify Console environment variables
2. **Database Connection**: Verify MongoDB URI format and credentials
3. **CORS Errors**: Ensure CORS_ORIGIN matches your frontend domain
4. **Build Failures**: Check build logs in AWS Amplify Console

### Local Development:
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/kanban
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## 📝 Notes
- Environment variables are now properly typed and validated
- The application gracefully handles missing database connections
- Configuration is logged on startup for debugging
- Fallback values ensure the app works in development mode