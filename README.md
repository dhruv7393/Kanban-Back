# Kanban Dashboard Backend

A robust Node.js/Express backend API for the Kanban Dashboard application with MongoDB integration, built with TypeScript for type safety and scalability.

## 🚀 Features

- **RESTful API** for Projects and Tasks management
- **MongoDB** integration with Mongoose ODM
- **TypeScript** for type safety and better developer experience
- **Data validation** with express-validator
- **Error handling** with custom error classes
- **Security** with Helmet, CORS, and rate limiting
- **Logging** with Morgan
- **Compression** for optimized responses
- **Pagination** and filtering for large datasets
- **AWS deployment ready** (no Docker required)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB database (local or cloud instance like MongoDB Atlas)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to the backend folder:**

   ```bash
   cd back
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

4. **Configure your environment variables in `.env`:**

   ```bash
   # Environment
   NODE_ENV=production
   PORT=3001

   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanban?retryWrites=true&w=majority

   # CORS (adjust based on your frontend domain)
   CORS_ORIGIN=https://yourdomain.com

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## 🌍 Environment Variables for AWS Deployment

When deploying to AWS (Elastic Beanstalk, EC2, Lambda, etc.), set these environment variables:

### Required Variables:

```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanban?retryWrites=true&w=majority
CORS_ORIGIN=https://your-frontend-domain.com
```

### Optional Variables:

```bash
RATE_LIMIT_WINDOW_MS=900000     # Rate limit window in milliseconds (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100     # Max requests per window per IP
```

### MongoDB Setup:

1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your AWS IP addresses or use 0.0.0.0/0 for all IPs (less secure)
5. Get your connection string and replace `<username>`, `<password>`, and `<dbname>`

## 🔧 Build Commands

### Development:

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run built application
npm start

# Lint code
npm run lint
```

### Production Build:

```bash
# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Start the production server
npm start
```

## 🐳 AWS Deployment Options

### 1. AWS Elastic Beanstalk

**Create a `Procfile` in the root directory:**

```
web: npm start
```

**Deploy steps:**

1. Run `npm run build` locally
2. Create a zip file with: `dist/`, `package.json`, `package-lock.json`, `Procfile`
3. Upload to Elastic Beanstalk
4. Set environment variables in EB console

### 2. AWS EC2

**User data script for Ubuntu:**

```bash
#!/bin/bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
cd /home/ubuntu
# Clone your repo and set up the application
git clone <your-repo>
cd kanban/back
npm ci --only=production
npm run build
npm start
```

### 3. AWS Lambda with Serverless Framework

**Install serverless:**

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

plugins:
  - serverless-offline
```

## 📡 API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/stats` - Get project statistics

### Tasks

- `GET /api/tasks` - Get all tasks (with pagination and filtering)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `GET /api/projects/:projectId/tasks` - Get tasks by project

### Health Check

- `GET /api/health` - API health check
- `GET /` - Root endpoint with API info

## 🔍 Query Parameters

### Tasks Filtering:

```
GET /api/tasks?page=1&limit=10&status=todo&priority=high&project_id=<id>&search=<term>
```

**Available parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (max: 100, default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort direction: asc/desc (default: desc)
- `status` - Filter by status: backlog/blocked/todo/done
- `priority` - Filter by priority: low/medium/high
- `project_id` - Filter by project ID
- `search` - Text search in title and description

## 📊 Data Models

### Project Schema:

```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  color: string, // Hex color code
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema:

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  status: 'backlog' | 'blocked' | 'todo' | 'done',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  blockedReason?: string, // Required when status is 'blocked'
  project_id: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing protection
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Validates all incoming data
- **Error Handling** - Secure error messages
- **MongoDB Injection Prevention** - Mongoose built-in protection

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## 📝 Logging

The application uses Morgan for HTTP request logging:

- **Development**: Colored, concise output
- **Production**: Combined log format for analysis

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **tsx** - Development server with hot reload
- **Mongoose** - MongoDB object modeling

## 🚀 Performance Optimizations

- **Compression** - Gzip compression for responses
- **Database Indexing** - Optimized queries
- **Pagination** - Efficient data loading
- **Connection Pooling** - MongoDB connection optimization
- **Rate Limiting** - Prevents server overload

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
