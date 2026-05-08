# 🔧 AI Generator - Troubleshooting Guide

**Solutions for common issues and debugging tips**

---

## 📋 Table of Contents

1. [Backend Issues](#backend-issues)
2. [Frontend Issues](#frontend-issues)
3. [Generation Issues](#generation-issues)
4. [API Issues](#api-issues)
5. [Database Issues](#database-issues)
6. [File Operations](#file-operations)
7. [Performance Issues](#performance-issues)
8. [Debug Checklist](#debug-checklist)

---

## 🔴 Backend Issues

### Issue 1: Server Won't Start

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Cause**: MongoDB is not running

**Solution**:
```bash
# Check if MongoDB is running
mongosh

# If not running, start it
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or on Windows
mongod

# Restart backend
cd backend
npm run dev
```

---

### Issue 2: Port Already in Use

**Error**: `Error: listen EADDRINUSE :::3000`

**Cause**: Another process is using port 3000

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

---

### Issue 3: TypeScript Compilation Errors

**Error**: `error TS2307: Cannot find module`

**Cause**: Dependencies not installed or incorrect imports

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear build cache
rm -rf dist
npm run build

# Check imports are correct
# Look for typos in require/import statements
```

---

### Issue 4: Environment Variables Not Loaded

**Error**: `Error: MONGODB_URL is not defined`

**Cause**: .env file not found or not loaded

**Solution**:
```bash
# Create .env file in backend directory
cat > .env << EOF
MONGODB_URL=mongodb://localhost:27017/ai-generator
JWT_SECRET=test-secret-key
PORT=3000
NODE_ENV=development
EOF

# Verify .env is loaded
npm run dev
```

---

### Issue 5: JWT Token Invalid

**Error**: `401 Unauthorized - Invalid token`

**Cause**: Token expired or JWT_SECRET mismatch

**Solution**:
```bash
# Generate new token
# Login again to get fresh token

# Verify JWT_SECRET in .env matches frontend
# Check token format: Bearer <token>

# Debug token
const jwt = require('jsonwebtoken');
const token = 'your-token-here';
jwt.verify(token, process.env.JWT_SECRET);
```

---

## 🟠 Frontend Issues

### Issue 1: Cannot Connect to Backend

**Error**: `Failed to fetch http://localhost:3000/api/v1/...`

**Cause**: Backend not running or CORS issues

**Solution**:
```bash
# Check backend is running
curl http://localhost:3000/api/v1/health

# Check CORS headers
# Verify backend has correct CORS configuration

# Try from browser console
fetch('http://localhost:3000/api/v1/health')
  .then(r => r.json())
  .then(console.log)
```

---

### Issue 2: Components Not Loading

**Error**: `Cannot find module '@/components/AIGenerator/...'`

**Cause**: Component file not created or path incorrect

**Solution**:
```bash
# Check file exists
ls -la src/components/AIGenerator/

# Verify imports match filenames (case-sensitive!)
# Check path aliases in vite.config.ts

# Restart dev server
npm run dev
```

---

### Issue 3: Token Not Persisting

**Error**: Keeps redirecting to login after page refresh

**Cause**: Token not stored or localStorage issue

**Solution**:
```bash
# Check localStorage
// In browser console
localStorage.getItem('token')
localStorage.getItem('user')

// Manually set for testing
localStorage.setItem('token', 'your-token-here')

// Check if localStorage is enabled
// Try private/incognito window
```

---

### Issue 4: Styling Not Applied

**Error**: Components look unstyled (no Tailwind)

**Cause**: Tailwind CSS not configured or not imported

**Solution**:
```bash
# Check index.css has Tailwind directives
# Verify tailwind.config.js is present

# Rebuild Tailwind
npm run build

# Restart dev server
npm run dev

# Clear browser cache
# Ctrl+Shift+Delete
```

---

### Issue 5: Route Not Found

**Error**: 404 Not Found - `/ai-generator`

**Cause**: Route not registered in routes.tsx

**Solution**:
```bash
# Check route is in frontend/src/config/routes.tsx
# Verify path matches navigation link

# Check imports are correct
import { AIGeneratorPage } from '@/pages/AIGeneratorPage';

# Restart dev server
npm run dev
```

---

## 🟡 Generation Issues

### Issue 1: Generation Stuck at Analysis Phase

**Error**: Progress bar stuck at 5%, status shows "analyzing"

**Cause**: Prompt parsing failed, requirement analysis error

**Solution**:
```bash
# Check backend logs for detailed error
npm run dev  # Watch logs

# Try simpler prompt first
"Create a todo app"

# Verify prompt contains required keywords
# Should mention: pages, components, APIs, database, auth

# Check GeneratedProject document in MongoDB
db.generatedprojects.findOne({ _id: ObjectId('projectId') })
```

---

### Issue 2: Files Not Generated

**Error**: Generation shows "completed" but 0 files

**Cause**: File generation error during phase

**Solution**:
```bash
# Check GeneratedFile count in database
db.generatedfiles.count({ projectId: ObjectId('projectId') })

# Check project errors array
db.generatedprojects.findOne()

# Review backend logs for specific phase failure
# Look for "generateFrontend", "generateBackend" errors

# Check available disk space
df -h
```

---

### Issue 3: Generation Timeout

**Error**: Generation takes > 10 minutes

**Cause**: Large project, slow server, database issues

**Solution**:
```bash
# Check MongoDB performance
# Look for slow queries in MongoDB logs

# Reduce project scope
# Start with smaller prompt

# Check server resources
# Monitor CPU and memory usage

# Increase timeout if needed (backend code)
```

---

### Issue 4: Requirements Not Detected

**Error**: Generated code missing expected features

**Cause**: Requirement analysis didn't detect features

**Solution**:
```bash
// Use explicit, clear keywords in prompt:
// ✓ "create", "build", "generate", "add", "implement"
// ✓ "user authentication", "login", "register", "JWT"
// ✓ "product page", "about page", "contact form"
// ✓ "API endpoint", "REST API", "/api/users"
// ✗ Avoid: vague terms, abbreviations, complex sentences

// Good prompt:
"Create a blog with:
- Article list page
- Article detail page
- Comment functionality
- User authentication with login/register
- Admin panel to manage articles
- Search and filter
- Responsive design"

// Bad prompt:
"Build a blogging platform"
```

---

### Issue 5: Wrong Tech Stack Generated

**Error**: Generated code uses different framework

**Cause**: Tech stack not selected or not respected

**Solution**:
```bash
// Always specify tech stack explicitly:
{
  "techStack": {
    "frontend": "React",
    "backend": "Express.js",
    "database": "MongoDB"
  }
}

// Verify in project record
db.generatedprojects.findOne().techStack

// Regenerate with correct stack
```

---

## 🔵 API Issues

### Issue 1: 404 Not Found on Endpoint

**Error**: `GET /api/v1/ai-generator/analyze - 404`

**Cause**: Route not registered

**Solution**:
```bash
# Verify route is in backend/src/routes/v1/aiGenerator.ts
# Check route is registered in v1/index.ts
router.use('/ai-generator', aiGeneratorRoutes);

# Verify method matches (GET vs POST)
# Check path is exactly /ai-generator/analyze

# Restart backend
npm run dev
```

---

### Issue 2: 400 Bad Request

**Error**: `POST /api/v1/ai-generator/generate - 400`

**Cause**: Invalid request body

**Solution**:
```bash
# Check request format
{
  "name": "string",
  "slug": "string",
  "prompt": "string",
  "projectType": "frontend|backend|fullstack|mobile",
  "techStack": {
    "frontend": "string",
    "backend": "string",
    "database": "string"
  },
  "options": {
    "includeDocumentation": boolean,
    "includeTests": boolean,
    "useDocker": boolean
  }
}

# Validate in request
curl -X POST http://localhost:3000/api/v1/ai-generator/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{...}'

# Check backend validation errors in response
```

---

### Issue 3: 401 Unauthorized

**Error**: `401 Unauthorized`

**Cause**: Missing or invalid authorization header

**Solution**:
```bash
# Always include Authorization header
-H "Authorization: Bearer YOUR_TOKEN"

# Get token from login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }'

# Verify token format in headers
# Should be: "Authorization: Bearer eyJ..."

# Check token expiration
# Tokens expire after 7 days (default)
```

---

### Issue 4: 500 Internal Server Error

**Error**: `500 Internal Server Error`

**Cause**: Unhandled exception in handler

**Solution**:
```bash
# Check backend logs for full error
npm run dev  # Watch detailed logs

# Verify all required fields in request
# Check MongoDB connection
db.adminCommand('ping')

# Enable debug mode
DEBUG=* npm run dev

# Check for null/undefined values
// In controller - add logging:
console.log('Request:', req.body);
console.log('Project:', project);
```

---

### Issue 5: Timeout on Long Generation

**Error**: `Request timeout after 30 seconds`

**Cause**: Generation takes longer than timeout

**Solution**:
```bash
// Frontend - increase timeout in fetch:
const response = await fetch(url, {
  method: 'POST',
  signal: AbortSignal.timeout(300000) // 5 minutes
});

// Better: Use polling instead of waiting
// Don't wait for entire generation
// Poll status endpoint every 5 seconds

// Backend: check generation is async
// Should return immediately, then process in background
```

---

## 🟣 Database Issues

### Issue 1: MongoDB Connection Failed

**Error**: `MongooseError: Cannot connect to MongoDB`

**Cause**: MongoDB not running or URL incorrect

**Solution**:
```bash
# Test connection
mongosh mongodb://localhost:27017

# Check MONGODB_URL in .env
echo $MONGODB_URL

# Start MongoDB
docker run -d -p 27017:27017 mongodb

# Or check local MongoDB
mongod --version

# Verify connection string format
mongodb://username:password@host:port/database
```

---

### Issue 2: Collection Not Found

**Error**: `MongooseError: Cannot find collection 'generatedprojects'`

**Cause**: Collection not created or wrong name

**Solution**:
```bash
# Check collections exist
mongosh
use ai-generator
show collections

# Collections should be:
// - generatedprojects
// - generatedfiles
// - requirementanalyses
// - prompthistories

# Create if missing
db.createCollection('generatedprojects')
db.generatedprojects.insertOne({ createdAt: new Date() })

// They'll auto-create on first insert anyway
```

---

### Issue 3: Duplicate Key Error

**Error**: `MongooseError: E11000 duplicate key error`

**Cause**: Unique constraint violation

**Solution**:
```bash
# Check unique indexes
db.generatedprojects.getIndexes()

# Clear duplicates if needed
db.generatedprojects.deleteMany({ slug: 'duplicate' })

# Don't create duplicate project slugs
```

---

### Issue 4: Data Not Persisting

**Error**: Data inserted then disappears

**Cause**: Database switched or collection cleaned

**Solution**:
```bash
// Verify you're using correct database
use ai-generator
db.getName()  // Should show "ai-generator"

// Check if data really there
db.generatedprojects.count()

// Enable MongoDB logging
mongod --logpath /var/log/mongodb.log

// Check disk space
du -sh /data/db
```

---

## 📁 File Operations

### Issue 1: File Not Found

**Error**: `Cannot find file ID`

**Cause**: File ID invalid or file deleted

**Solution**:
```bash
# Verify file exists
db.generatedfiles.findOne({ _id: ObjectId('fileId') })

# List all files for project
db.generatedfiles.find({ projectId: ObjectId('projectId') })

// Check file ID format is valid ObjectId
```

---

### Issue 2: File Download Not Working

**Error**: Download returns empty or 404

**Cause**: ZIP creation failed or file path wrong

**Solution**:
```bash
# Check all project files exist in database
db.generatedfiles.count({ projectId: ObjectId('projectId') })

// Should be > 0

# Verify download endpoint
GET /api/v1/ai-generator/projects/:projectId/download

# Check temporary directory has write permissions
ls -la /tmp
chmod 777 /tmp
```

---

### Issue 3: File Update Failed

**Error**: PUT /files/:id returns 500

**Cause**: File not found or validation error

**Solution**:
```bash
// Verify file exists and belongs to user
db.generatedfiles.findOne({ _id: ObjectId('fileId') })

// Check content is provided
{
  "content": "new code here"
}

// Verify line count calculates
// content.split('\n').length
```

---

## ⚡ Performance Issues

### Issue 1: Slow Generation

**Symptom**: Generation takes > 5 minutes

**Solution**:
```bash
# Check server resources
top  # Monitor CPU/memory

# Reduce project scope
// Simpler prompt = faster generation

# Check MongoDB performance
db.generatedprojects.find().explain("executionStats")

// Look for table scans - add indexes if needed

# Enable caching in production
// Use Redis for requirement caching
```

---

### Issue 2: High Memory Usage

**Symptom**: `JavaScript heap out of memory`

**Cause**: Large number of files in memory

**Solution**:
```bash
// Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run dev

// Or use streaming for large files
// Stream file content instead of loading all in memory

// Monitor memory
process.memoryUsage()
```

---

### Issue 3: Database Slow Queries

**Symptom**: API responses taking > 5 seconds

**Cause**: Missing indexes on queries

**Solution**:
```bash
// Add indexes
db.generatedprojects.createIndex({ userId: 1 })
db.generatedfiles.createIndex({ projectId: 1 })
db.generatedfiles.createIndex({ category: 1 })

// Check query plan
db.generatedfiles.find({ projectId: ObjectId(...) }).explain("executionStats")

// Should use index scan, not collection scan
```

---

## ✅ Debug Checklist

When something doesn't work, go through this checklist:

### Pre-Check
- [ ] Backend running on port 3000?
- [ ] Frontend running on port 5173?
- [ ] MongoDB running and connected?
- [ ] All dependencies installed?
- [ ] Environment variables loaded?

### Authentication
- [ ] User logged in?
- [ ] Token in localStorage?
- [ ] Authorization header in requests?
- [ ] Token not expired (check 7-day expiry)?

### Project Generation
- [ ] Prompt clear and descriptive?
- [ ] Project type selected?
- [ ] Tech stack specified?
- [ ] Generation status tracking?
- [ ] Check backend logs for errors?

### Files
- [ ] Project marked as completed?
- [ ] Files count > 0?
- [ ] Files visible in database?
- [ ] File content not empty?

### API
- [ ] Correct HTTP method (GET/POST/PUT)?
- [ ] Correct endpoint path?
- [ ] Request body valid JSON?
- [ ] Response status 200?
- [ ] Check error message?

### Database
- [ ] MongoDB connected?
- [ ] Correct database name?
- [ ] Collections exist?
- [ ] Data inserted correctly?
- [ ] No duplicate keys?

---

## 🔍 Debug Commands

### Backend Debugging
```bash
# Verbose logging
DEBUG=* npm run dev

# TypeScript checking
npm run type-check

# Linting
npm run lint

# MongoDB connection test
node -e "require('mongoose').connect('mongodb://localhost:27017/ai-generator').then(() => console.log('OK'))"
```

### Frontend Debugging
```bash
# Browser DevTools
F12

# Network tab to monitor API calls
# Console for JavaScript errors
# Application tab to check localStorage

# React DevTools
// Install React DevTools browser extension

# Vite debug
DEBUG=vite:* npm run dev
```

### Database Debugging
```bash
# Connect to MongoDB
mongosh

# Check database
use ai-generator
show collections
db.generatedprojects.count()

# Find specific project
db.generatedprojects.findOne({ name: "My Project" })

# Check indexes
db.generatedfiles.getIndexes()

# Clear database (careful!)
db.generatedprojects.deleteMany({})
```

---

## 📞 Getting Help

1. **Check logs**: Always check backend logs first
2. **Search issues**: Look for similar issues online
3. **Test parts**: Test each component individually
4. **Simplify**: Start with minimal test case
5. **Document**: Note what you've tried
6. **Ask**: Include logs and steps to reproduce

---

**Still stuck? Check the main documentation or backend logs for detailed errors!**
