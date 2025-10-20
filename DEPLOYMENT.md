# Kanban Dashboard Backend - AWS Deployment Guide

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

3. **Build the project:**

   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

## 🌐 AWS Deployment Options

### Option 1: AWS Amplify (Recommended for Full-Stack Apps)

**Prerequisites:**

- AWS Account with Amplify access
- Repository connected to AWS Amplify

**Environment Variables Setup:**

1. **In AWS Amplify Console:**
   - Go to your app in AWS Amplify Console
   - Navigate to "Environment variables" section
   - Add the following variables:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanban
   PORT=3001
   CORS_ORIGIN=https://your-frontend-domain.com
   NODE_ENV=production
   ```

2. **Build Configuration:**
   - The `amplify.yml` file is already configured to use these environment variables
   - Variables will be available during both build and runtime

3. **Deploy:**
   ```bash
   git push origin main  # or your default branch
   ```

**Important Notes:**
- Store sensitive values like database credentials in AWS Systems Manager Parameter Store or AWS Secrets Manager for production
- The environment variables defined in `amplify.yml` will be automatically injected during deployment
- For secrets, use AWS Amplify's built-in environment variable encryption

### Option 2: AWS Elastic Beanstalk

**Prerequisites:**

- AWS CLI installed and configured
- Elastic Beanstalk CLI installed

**Steps:**

1. **Create deployment package:**

   ```bash
   npm run build
   zip -r kanban-backend.zip dist/ package.json package-lock.json .ebextensions/
   ```

2. **Create `.ebextensions/nodecommand.config`:**

   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "npm start"
     aws:elasticbeanstalk:application:environment:
       NODE_ENV: production
       NPM_CONFIG_PRODUCTION: true
   ```

3. **Deploy via AWS Console:**
   - Go to Elastic Beanstalk in AWS Console
   - Create new application
   - Upload your zip file
   - Set environment variables in Configuration > Software

**Environment Variables for Elastic Beanstalk:**

```
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanban
CORS_ORIGIN=https://your-frontend-domain.com
```

### Option 2: AWS EC2

**User Data Script (Ubuntu):**

```bash
#!/bin/bash
# Update system
apt-get update
apt-get install -y nginx

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Create app directory
mkdir -p /var/www/kanban-backend
cd /var/www/kanban-backend

# Clone and set up application (replace with your repo)
git clone https://github.com/your-repo/kanban-backend.git .
npm ci --only=production
npm run build

# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=3001
MONGODB_URI=${MONGODB_URI}
CORS_ORIGIN=${CORS_ORIGIN}
EOF

# Start application with PM2
pm2 start dist/server.js --name kanban-backend
pm2 startup
pm2 save

# Configure Nginx reverse proxy
cat > /etc/nginx/sites-available/kanban-backend << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/kanban-backend /etc/nginx/sites-enabled/
systemctl restart nginx
```

### Option 3: AWS Lambda with Serverless Framework

**Install Serverless:**

```bash
npm install -g serverless
```

**Create `serverless.yml`:**

```yaml
service: kanban-backend

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    NODE_ENV: production
    MONGODB_URI: ${env:MONGODB_URI}
    CORS_ORIGIN: ${env:CORS_ORIGIN}

functions:
  api:
    handler: dist/lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-offline
  - serverless-express

package:
  exclude:
    - src/**
    - .git/**
    - .env
    - README.md
```

**Create Lambda handler (`src/lambda.ts`):**

```typescript
import serverless from "serverless-http";
import app from "./index.js";

export const handler = serverless(app);
```

**Deploy:**

```bash
npm run build
serverless deploy
```

### Option 4: AWS ECS with Fargate

**Create `Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

**Build and push to ECR:**

```bash
# Build Docker image
docker build -t kanban-backend .

# Tag for ECR
docker tag kanban-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/kanban-backend:latest

# Push to ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/kanban-backend:latest
```

**Create ECS Task Definition and Service via AWS Console or Terraform**

## 📊 MongoDB Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account:**

   - Go to https://cloud.mongodb.com
   - Create a new cluster

2. **Configure Database:**

   ```javascript
   // Create database: kanban
   // Create collections: projects, tasks
   ```

3. **Set up Database User:**

   - Create a user with read/write permissions
   - Note the username and password

4. **Configure Network Access:**

   - Add your application's IP addresses
   - For development: 0.0.0.0/0 (less secure)
   - For production: Specific IP ranges

5. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/kanban?retryWrites=true&w=majority
   ```

### Local MongoDB (Development)

**Install MongoDB locally:**

```bash
# macOS
brew install mongodb-community

# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongod  # Ubuntu
```

## 🔧 Environment Variables Reference

| Variable      | Description                          | Default                          | Required |
| ------------- | ------------------------------------ | -------------------------------- | -------- |
| `NODE_ENV`    | Environment (development/production) | development                      | No       |
| `PORT`        | Server port                          | 3001                             | No       |
| `MONGODB_URI` | MongoDB connection string            | mongodb://localhost:27017/kanban | Yes      |
| `CORS_ORIGIN` | Allowed CORS origin                  | http://localhost:5173            | No       |

## 🧪 Testing the Deployment

**Health Check:**

```bash
curl https://your-api-domain.com/api/health
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-10-15T20:57:32.864Z",
    "uptime": 123.456
  },
  "message": "API is running"
}
```

**Test Other Endpoints:**

```bash
# Get projects
curl https://your-api-domain.com/api/projects

# Get tasks
curl https://your-api-domain.com/api/tasks

# Create project
curl -X POST https://your-api-domain.com/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Test description","color":"#FF0000"}'
```

## 📝 Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables set correctly
- [ ] CORS origin updated for production domain
- [ ] SSL certificate configured (HTTPS)
- [ ] Rate limiting configured appropriately
- [ ] Error logging set up (CloudWatch, etc.)
- [ ] Health check endpoint monitored
- [ ] Database backups configured
- [ ] Security groups/firewall rules configured
- [ ] Domain name configured and DNS updated

## 🔍 Monitoring and Logs

**AWS CloudWatch Integration:**

```javascript
// Add to your server.js for CloudWatch logging
import { CloudWatchLogs } from "@aws-sdk/client-cloudwatch-logs";

const cloudWatchLogs = new CloudWatchLogs({ region: "us-east-1" });
```

**Health Monitoring:**

- Set up CloudWatch alarms for API health
- Monitor response times and error rates
- Set up SNS notifications for critical issues

## 🔧 Troubleshooting

**Common Issues:**

1. **MongoDB Connection Failed:**

   - Check connection string format
   - Verify network access settings in MongoDB Atlas
   - Ensure environment variables are set correctly

2. **CORS Errors:**

   - Update CORS_ORIGIN environment variable
   - Ensure frontend domain is correct

3. **Memory/Performance Issues:**
   - Increase EC2 instance size
   - Optimize database queries
   - Add caching layer (Redis)

## 📚 Additional Resources

- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
