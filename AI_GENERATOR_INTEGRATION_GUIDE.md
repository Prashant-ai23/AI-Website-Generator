# 🚀 AI Generator Module - Integration Guide

**How to integrate and use the completed AI Generator module**

---

## ⚡ Quick Integration Checklist

- [x] Backend models created
- [x] Backend service implemented
- [x] Backend controller implemented
- [x] Backend routes configured
- [x] Frontend components created
- [x] Frontend routes configured
- [x] Database configured
- [x] API endpoints tested
- [x] Documentation complete

**Status**: ✅ READY TO USE

---

## 🔌 System Integration Points

### Backend Integration

**File**: `backend/src/routes/v1/index.ts`
```typescript
// AI Generator routes already registered:
import aiGeneratorRoutes from './aiGenerator.js';
router.use('/ai-generator', aiGeneratorRoutes);
```

**Location**: `/api/v1/ai-generator/*`

**All Endpoints Protected**: JWT Bearer token required

**Database**: MongoDB connection via `mongoose` (existing setup)

### Frontend Integration

**File**: `frontend/src/config/routes.tsx`
```typescript
// AI Generator route configured:
{
  path: '/ai-generator',
  element: (
    <ProtectedRoute>
      <AIGeneratorPage />
    </ProtectedRoute>
  ),
}
```

**Location**: `/ai-generator`

**Navigation**: Add to sidebar/navbar with link to `/ai-generator`

**Authorization**: Requires valid JWT token in localStorage

---

## 📋 Setup Instructions

### 1. Database Setup

MongoDB collections will be created automatically on first use:

```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or verify connection
mongosh mongodb://localhost:27017
```

Collections auto-created:
- `generatedprojects`
- `generatedfiles`
- `requirementanalyses`
- `prompthistories`

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
cat > .env << EOF
MONGODB_URL=mongodb://localhost:27017/ai-generator
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
EOF

# Start development server
npm run dev

# Server runs on http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

### 4. Access the Module

1. Open browser: `http://localhost:5173`
2. Login/Register
3. Click "AI Generator" in navigation
4. Or navigate directly to: `http://localhost:5173/ai-generator`

---

## 🧪 Testing the Integration

### Test 1: Generate First Project

```bash
# In browser, navigate to /ai-generator
# Click "Create" tab
# Enter prompt: "Create a simple todo app with login"
# Click "Generate Project"
# Watch 7-phase generation progress
# Click "Files" tab to view generated code
```

### Test 2: API Direct Test

```bash
# Get authentication token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }' \
  | jq '.data.token' # Extract token

# Use token to generate project
TOKEN="your-token-here"
curl -X POST http://localhost:3000/api/v1/ai-generator/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "slug": "test-project",
    "prompt": "Create a todo app",
    "projectType": "fullstack",
    "techStack": {
      "frontend": "React",
      "backend": "Express.js",
      "database": "MongoDB"
    }
  }'

# Check project status
PROJECT_ID="..."
curl -X GET http://localhost:3000/api/v1/ai-generator/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Test 3: Generate Different Project Types

**Ecommerce Store**:
```
"Create an ecommerce store with products, cart, checkout, payment, user accounts, admin panel"
```

**Blog Platform**:
```
"Build a blog with articles, comments, categories, search, user authentication, admin dashboard"
```

**Dashboard**:
```
"Generate a dashboard with real-time data, charts, user management, reports"
```

---

## 🎯 Component Interaction Flow

### User Journey

```
1. User logs in
   └─> Redirected to dashboard
       └─> Navigates to /ai-generator
           └─> AIGeneratorPage loads
               ├─ Projects Tab
               │  └─ Shows existing projects
               │     └─ Click to view details
               │        └─ Shows GenerationProgress
               │           └─ Shows GeneratedFilesExplorer
               │              └─ Select file
               │                 └─ Shows CodeEditor
               │
               ├─ Create Tab
               │  └─ PromptEditor component
               │     └─ User enters prompt
               │        └─ Click "Generate"
               │           └─ API: POST /generate
               │              └─ Project created
               │                 └─ GenerationProgress shows status
               │                    └─ Generation happens (2-3 min)
               │                       └─ GeneratedFilesExplorer shows files
               │
               ├─ Files Tab
               │  └─ GeneratedFilesExplorer
               │     └─ Browse by category
               │        └─ Select file
               │           └─ Shows preview
               │              └─ Copy/Download options
               │
               └─ Code Tab
                  └─ CodeEditor
                     └─ View file content
                        └─ Edit code
                           └─ Save changes (API: PUT /files/:id)
```

---

## 📡 API Communication

### Request Flow

```
Frontend (React)
    ↓ (HTTPS)
    │ GET /ai-generator
    ↓
Express.js (Backend)
    ↓
    ├─ Check AUTH (middleware)
    ├─ Route to Handler (controller)
    ├─ Validate Input
    ├─ Call Service Layer
    ├─ Query Database (Mongoose)
    ├─ Generate Response
    └─ Return JSON
    ↓ (HTTPS)
Frontend (React)
    └─ Update State
    └─ Render Components
```

### Example Request

```typescript
// Frontend
const response = await fetch('/api/v1/ai-generator/projects/123', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// Backend
GET /api/v1/ai-generator/projects/:projectId
  ↓ authenticate middleware
  ↓ aiGeneratorController.getProjectStatus()
  ↓ aiGeneratorService.getProjectWithFiles()
  ↓ GeneratedProject.findById(projectId)
  ↓ GeneratedFile.find({ projectId })
  ↓ Return JSON response
```

---

## 🔐 Security Integration

### Authentication

**All endpoints require Bearer token**:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authorization

**Ownership checks on all operations**:
```typescript
// Controller always checks:
if (project.creator.toString() !== userId) {
  throw new Error('Unauthorized');
}
```

### Data Validation

**All inputs validated**:
- Prompt length (minimum)
- Project name (required, unique per user)
- Tech stack (valid options)
- File content (sanitized)

---

## 🗄️ Database Integration

### Collections Workflow

```
User creates project
  ↓
GeneratedProject created
  ├─ name, slug, status, prompt
  ├─ requirements (analyzed)
  └─ progress tracking
  ↓
Generation phase runs
  ↓
GeneratedFile created (for each file)
  ├─ projectId, fileName
  ├─ content, language
  └─ metadata
  ↓
RequirementAnalysis created
  ├─ Original prompt
  ├─ Analyzed requirements
  └─ Confidence score
  ↓
PromptHistory created
  ├─ For future reuse
  ├─ Can be marked as favorite
  └─ Tracks execution result
```

### Query Patterns

```javascript
// Find user's projects
db.generatedprojects.find({ creator: userId })

// Find project files
db.generatedfiles.find({ projectId })

// Find by category
db.generatedfiles.find({ category: 'frontend' })

// Find by file type
db.generatedfiles.find({ fileType: 'component' })

// Favorite prompts
db.prompthistories.find({ userId, isFavorite: true })
```

---

## 📊 Monitoring Integration

### Check System Health

```bash
# Backend health
curl http://localhost:3000/api/v1/health

# Database connection
mongosh
  use ai-generator
  show collections
  db.generatedprojects.count()

# Frontend logs
# Open browser DevTools → Console

# Backend logs
# Watch npm run dev output
```

### Monitor Generation

```bash
# Poll project status
curl http://localhost:3000/api/v1/ai-generator/projects/PROJECT_ID \
  -H "Authorization: Bearer TOKEN"

# Check generated files
curl http://localhost:3000/api/v1/ai-generator/projects/PROJECT_ID/files \
  -H "Authorization: Bearer TOKEN"
```

---

## 🚀 Deployment Integration

### Environment Variables

**Backend `.env`**:
```env
MONGODB_URL=mongodb://localhost:27017/ai-generator
JWT_SECRET=production-secret-key
PORT=3000
NODE_ENV=production
```

**Frontend `.env`**:
```env
VITE_API_URL=https://api.example.com/api/v1
VITE_APP_URL=https://app.example.com
```

### Docker Integration

```bash
# Build backend
cd backend
docker build -t ai-generator-backend .

# Build frontend
cd frontend
docker build -t ai-generator-frontend .

# Run with Docker Compose
docker-compose up -d
```

### Production Checklist

- [ ] JWT_SECRET is strong random key
- [ ] MongoDB replicated for high availability
- [ ] API rate limiting configured
- [ ] Error logging set up
- [ ] Database backups automated
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] Load balancer configured (if needed)

---

## 🔧 Troubleshooting Integration Issues

### Issue: API Not Accessible from Frontend

**Solution**:
```bash
# Check backend is running
curl http://localhost:3000/api/v1/health

# Check CORS headers
# Check Authorization header is included
# Check token is valid
```

### Issue: Generation Not Starting

**Solution**:
```bash
# Check MongoDB is running
mongosh

# Check backend logs for errors
# Check prompt is descriptive enough
# Try simpler prompt: "Create a todo app"
```

### Issue: Files Not Loading

**Solution**:
```bash
# Check project is marked as completed
db.generatedprojects.findOne().status

# Check files exist
db.generatedfiles.find({ projectId: ObjectId('...') }).count()

# Check frontend console for errors
```

---

## 📚 Related Documentation

- **Quick Start**: [AI_GENERATOR_QUICK_START.md](./AI_GENERATOR_QUICK_START.md)
- **Complete Guide**: [AI_GENERATOR_COMPLETE.md](./AI_GENERATOR_COMPLETE.md)
- **Architecture**: [AI_GENERATOR_ARCHITECTURE.md](./AI_GENERATOR_ARCHITECTURE.md)
- **Troubleshooting**: [AI_GENERATOR_TROUBLESHOOTING.md](./AI_GENERATOR_TROUBLESHOOTING.md)

---

## 🎉 Integration Complete!

The AI Generator module is fully integrated into your application:

✅ Backend: 12 API endpoints
✅ Frontend: 5 components + 1 page
✅ Database: 4 MongoDB models
✅ Documentation: 4 comprehensive guides
✅ Security: JWT on all endpoints
✅ Error Handling: Complete error coverage
✅ Performance: Optimized queries
✅ Production: Ready to deploy

**Start generating amazing applications!** 🚀

---

**For detailed implementation questions, refer to**:
1. Backend code: `backend/src/services/aiGeneratorService.ts`
2. Frontend code: `frontend/src/pages/AIGeneratorPage.tsx`
3. API endpoints: `backend/src/routes/v1/aiGenerator.ts`
4. Database: `backend/src/models/GeneratedProject.ts`

Happy coding! 🎉
