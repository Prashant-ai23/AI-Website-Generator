# 🚀 AI Generator - Quick Start Guide

**Get started with the AI-powered website generator in 5 minutes!**

---

## ⚡ Quick Navigation

- [Installation](#installation)
- [Running the System](#running-the-system)
- [First Generation](#first-generation)
- [API Quick Reference](#api-quick-reference)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Installation

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Environment Setup
```bash
# Backend (.env file)
MONGODB_URL=mongodb://localhost:27017/ai-generator
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or local MongoDB
mongod
```

---

## 🎯 Running the System

### Start Backend Server
```bash
cd backend
npm run dev
```
✅ Server runs on http://localhost:3000

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
✅ App runs on http://localhost:5173

### Check Health
```bash
curl http://localhost:3000/api/v1/health
```

---

## 🎨 First Generation

### Step 1: Login/Register
Visit http://localhost:5173 and create an account

### Step 2: Navigate to AI Generator
Click "AI Generator" in sidebar or visit `/ai-generator`

### Step 3: Create Prompt
In the "Create" tab, enter a project description:

```
Create a simple todo app with:
- Task creation and deletion
- Mark tasks as complete
- Filter by status
- User authentication
```

### Step 4: Configure Project
- **Project Type**: fullstack
- **Tech Stack**: React, Express.js, MongoDB
- **Include**: Documentation, Docker

### Step 5: Generate
Click "Generate Project" button

### Step 6: Monitor Progress
Watch the 7-phase timeline in the progress tracker

### Step 7: View Files
When complete, click "Files" tab to explore generated code

---

## 📡 API Quick Reference

### Analyze Requirements
```bash
curl -X POST http://localhost:3000/api/v1/ai-generator/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a todo app with user authentication"
  }'
```

### Generate Project
```bash
curl -X POST http://localhost:3000/api/v1/ai-generator/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Todo App",
    "slug": "my-todo-app",
    "prompt": "Create a todo app...",
    "projectType": "fullstack",
    "techStack": {
      "frontend": "React",
      "backend": "Express.js",
      "database": "MongoDB"
    },
    "options": {
      "includeDocumentation": true,
      "useDocker": true
    }
  }'
```

### Get Project Status
```bash
curl -X GET http://localhost:3000/api/v1/ai-generator/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Projects
```bash
curl -X GET http://localhost:3000/api/v1/ai-generator/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Project Files
```bash
curl -X GET http://localhost:3000/api/v1/ai-generator/projects/PROJECT_ID/files \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View File Content
```bash
curl -X GET http://localhost:3000/api/v1/ai-generator/files/FILE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update File
```bash
curl -X PUT http://localhost:3000/api/v1/ai-generator/files/FILE_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "new file content here"
  }'
```

### Download Project
```bash
curl -X GET http://localhost:3000/api/v1/ai-generator/projects/PROJECT_ID/download \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Clone Project
```bash
curl -X POST http://localhost:3000/api/v1/ai-generator/projects/PROJECT_ID/clone \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Todo App Clone",
    "slug": "my-todo-app-clone"
  }'
```

### Save Prompt as Favorite
```bash
curl -X POST http://localhost:3000/api/v1/ai-generator/prompts/favorite \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a todo app with..."
  }'
```

---

## 🧪 Test Scenarios

### Test 1: Simple Todo App
**Prompt:**
```
Create a simple todo application with:
- Add new todos
- Mark as complete
- Delete todos
- Filter by status
- User authentication
- Clean UI with Tailwind CSS
```

**Expected Files**: 45-55 files
**Generation Time**: ~2 minutes
**Key Components**: TodoForm, TodoList, TodoItem, LoginForm, DashboardPage

---

### Test 2: Blog Platform
**Prompt:**
```
Build a blog platform featuring:
- Article creation and editing
- Category and tag system
- Comment functionality
- User authentication
- Admin panel for content management
- SEO optimization
- Social sharing buttons
- Dark mode support
```

**Expected Files**: 60-70 files
**Generation Time**: ~2.5 minutes
**Key Components**: ArticleForm, ArticleList, CommentSection, AdminDashboard

---

### Test 3: Ecommerce Store
**Prompt:**
```
Generate a complete ecommerce store with:
- Product catalog with search and filtering
- Shopping cart functionality
- Checkout process
- Payment integration
- User accounts and order history
- Admin dashboard
- Product reviews and ratings
- Email notifications
- Inventory management
```

**Expected Files**: 75-90 files
**Generation Time**: ~3 minutes
**Key Components**: ProductCard, Cart, Checkout, AdminPanel, Dashboard

---

## 🐛 Troubleshooting

### Issue: "Generation Failed - Analysis Phase"
**Solution:**
- Check prompt is descriptive enough
- Ensure MongoDB is running
- Verify backend logs for detailed errors

### Issue: "Frontend Files Not Generated"
**Solution:**
- Check frontend requirements are clear
- Verify React is selected as framework
- Review backend logs

### Issue: "Cannot Get Project Files"
**Solution:**
- Verify project ID is correct
- Ensure authentication token is valid
- Check project generation completed

### Issue: "File Save Failed"
**Solution:**
- Verify file exists
- Check token still valid
- Review backend error logs

### Issue: "Download Not Working"
**Solution:**
- Verify all files are generated
- Check project status is "completed"
- Try manual file download from file browser

---

## 📊 Monitoring Generation

### Watch Logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev
```

### Monitor Database
```bash
# MongoDB shell
mongosh

# Check collections
use ai-generator
db.generatedprojects.find().pretty()
db.generatedfiles.count()
```

### Check Progress Endpoint
```bash
# Poll every 5 seconds
watch -n 5 'curl http://localhost:3000/api/v1/ai-generator/projects/PROJECT_ID'
```

---

## 🎓 Next Steps

1. **Explore Generated Code**: Review generated files for patterns
2. **Customize Projects**: Edit files in the Code Editor
3. **Export Projects**: Download as ZIP for local development
4. **Create Templates**: Save successful prompts as favorites
5. **Read Full Docs**: Check [AI_GENERATOR_COMPLETE.md](./AI_GENERATOR_COMPLETE.md)

---

## 📚 Key Files

### Backend
- `backend/src/models/GeneratedProject.ts` - Project schema
- `backend/src/models/GeneratedFile.ts` - File storage
- `backend/src/services/aiGeneratorService.ts` - Generation logic
- `backend/src/controllers/aiGeneratorController.ts` - API handlers
- `backend/src/routes/v1/aiGenerator.ts` - Route definitions

### Frontend
- `frontend/src/pages/AIGeneratorPage.tsx` - Main page
- `frontend/src/components/AIGenerator/PromptEditor.tsx` - Prompt input
- `frontend/src/components/AIGenerator/GenerationProgress.tsx` - Progress tracker
- `frontend/src/components/AIGenerator/GeneratedFilesExplorer.tsx` - File browser
- `frontend/src/components/AIGenerator/CodeEditor.tsx` - Code editor

---

## 🚀 Production Deployment

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Deploy with Docker
```bash
# Using Docker Compose
docker-compose up -d

# Check services
docker-compose ps
```

### Environment Variables
```
MONGODB_URL=<production-mongodb-url>
JWT_SECRET=<strong-secret-key>
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

---

## 💡 Tips & Tricks

1. **Be Specific**: More detailed prompts = better generation
2. **Use Examples**: Reference existing projects in your prompt
3. **Incremental**: Start with basic features, then enhance
4. **Save Prompts**: Favorite successful prompts for reuse
5. **Clone Projects**: Clone and modify existing projects
6. **Check Logs**: Always check backend logs for issues
7. **Test Early**: Generate and test frequently
8. **Document**: Add comments during code editing

---

## 📞 Support Resources

- **Documentation**: [AI_GENERATOR_COMPLETE.md](./AI_GENERATOR_COMPLETE.md)
- **API Docs**: [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)
- **Backend Setup**: [BACKEND_STRUCTURE.md](./backend/BACKEND_STRUCTURE.md)
- **Frontend Setup**: [SETUP.md](./frontend/SETUP.md)

---

**Happy Generating! 🎉**

Questions? Check the docs or review backend logs for detailed error messages.
