# AI Website Generator - Complete Deployment & Usage Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- npm or yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Prashant-ai23/AI-Website-Generator
cd ai-website-generator

# 2. Install all dependencies
npm install

# 3. Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp mcp-server/.env.example mcp-server/.env

# 4. Configure MongoDB
mongod  # Start MongoDB or use cloud service

# 5. Start backend server
cd backend
npm run dev
# Server runs on http://localhost:3000

# 6. Start frontend (new terminal)
cd frontend  
npm run dev
# Frontend runs on http://localhost:5173
```

## 📋 Complete Feature Set

### ✅ AI-Powered Website Generation
- **Intelligent Requirement Analysis**: Understands your project needs
- **7-Phase Generation Pipeline**: Comprehensive full-stack generation
- **50+ Template Generators**: Covers all common patterns
- **Full-Stack Support**: Frontend, Backend, Database, Authentication

### ✅ Real-Time Generation Progress
- Live progress tracking with phase-by-phase updates
- Detailed file generation statistics
- Error tracking and reporting
- Estimated completion times

### ✅ File Management & Export
- Download entire project as ZIP
- Download individual files
- Edit generated code inline
- Delete unwanted files

### ✅ Live Preview & Code Inspection
- Tree-based file navigation
- Syntax-highlighted code preview
- Live component preview (for React)
- Copy code to clipboard

### ✅ Template Marketplace
- Browse professional templates
- Filter by tech stack
- Customize before generation
- Download templates

### ✅ Project Management
- Create, read, update, delete projects
- Clone existing projects
- Track generation history
- Save favorite prompts

## 🎯 How to Use

### Step 1: Start Project Generation

1. Navigate to `http://localhost:5173`
2. Login with your credentials
3. Click "AI Generator" in sidebar
4. Enter your project requirements
5. Select tech stack (React, Express, MongoDB, JWT, etc.)
6. Click "Generate"

### Step 2: Monitor Generation Progress

The system generates your website in 7 phases:
1. **Analyzing Requirements** (5s) - Parses your specifications
2. **Frontend Generation** (30s) - Creates React components
3. **Backend Generation** (40s) - Generates Express APIs
4. **Database Generation** (20s) - Creates MongoDB schemas
5. **Authentication Setup** (15s) - Implements JWT auth
6. **Documentation** (10s) - Generates guides
7. **Deployment Config** (5s) - Creates Docker files

Real-time progress updates show:
- Current phase
- Files generated per phase
- Duration of each phase
- Any errors encountered

### Step 3: Review Generated Files

**View in Live Preview**:
- Click "Preview" tab
- Browse file tree on left
- View syntax-highlighted code
- Switch to preview mode for React components

**Edit Files**:
- Edit code directly in preview
- Update API endpoints
- Modify database schemas
- Save changes

### Step 4: Download & Deploy

**Download Project**:
- Click "Download" button
- ZIP file contains full project
- Extract and run locally

**Run Locally**:
```bash
cd generated-project

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start MongoDB (if using local)
mongod

# Run development server
npm run dev
```

**Deploy to Cloud**:
```bash
# Backend deployment (Heroku, AWS, DigitalOcean)
npm run build
npm start

# Frontend deployment (Vercel, Netlify)
npm run build
# Deploy dist/ folder
```

## 🔌 API Reference

### Analysis Endpoint
```bash
POST /api/v1/ai-generator/analyze
Authorization: Bearer <token>

{
  "prompt": "Create an ecommerce website with products and shopping cart",
  "projectType": "fullstack"
}

Response: {
  "modules": ["products", "cart", "orders", "users"],
  "pages": ["home", "products", "cart", "checkout"],
  "apis": [...],
  "collections": [...],
  "authentication": "jwt"
}
```

### Generate Project
```bash
POST /api/v1/ai-generator/generate
Authorization: Bearer <token>

{
  "name": "My Ecommerce Store",
  "slug": "my-ecommerce-store",
  "prompt": "...",
  "config": {
    "projectType": "fullstack",
    "techStack": {
      "frontend": "React",
      "backend": "Express",
      "database": "MongoDB",
      "authentication": "JWT"
    },
    "includeTests": true,
    "includeDocumentation": true,
    "useDocker": true
  }
}
```

### Get Project Status
```bash
GET /api/v1/ai-generator/projects/:projectId
Authorization: Bearer <token>

Response: {
  "projectId": "...",
  "projectName": "My Ecommerce Store",
  "status": "success",
  "progress": 100,
  "filesGenerated": 65,
  "metadata": {...}
}
```

### Get Project Files
```bash
GET /api/v1/ai-generator/projects/:projectId/files
Authorization: Bearer <token>

Response: {
  "files": [
    {
      "filePath": "src/App.tsx",
      "fileName": "App.tsx",
      "content": "...",
      "fileType": "react"
    },
    ...
  ]
}
```

### Download Project
```bash
GET /api/v1/ai-generator/projects/:projectId/download
Authorization: Bearer <token>

Response: ZIP file with entire project
```

### Get Progress
```bash
GET /api/v1/ai-generator/projects/:projectId/progress
Authorization: Bearer <token>

Response: {
  "progress": 75,
  "currentPhase": "backend",
  "phaseProgress": [...],
  "estimatedCompletion": "2 minutes"
}
```

## 🎨 Generated Project Structure

```
generated-project/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API clients
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration
│   │   └── server.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docs/
│   ├── API.md               # API documentation
│   ├── DATABASE.md          # Database schema
│   ├── ARCHITECTURE.md      # System architecture
│   └── SETUP.md             # Setup instructions
│
├── docker-compose.yml       # Docker configuration
├── .env.example             # Environment template
├── README.md                # Project README
└── package.json             # Root package.json
```

## 🔐 Authentication

The generated project includes JWT-based authentication:

**Register**:
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login**:
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

**Protected Routes**: Include token in header
```bash
Authorization: Bearer <token>
```

## 📊 Generated Technologies

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for HTTP client
- Zustand for state management
- Vite for fast builds

### Backend
- Express.js with TypeScript
- MongoDB with Mongoose ODM
- JWT authentication
- Joi validation
- CORS enabled
- Error handling middleware

### Database
- MongoDB schemas with validation
- Indexed collections
- Relationships between models
- Seed data generators
- Database migration scripts

### Features
- RESTful API design
- CRUD operations
- Pagination & filtering
- Search functionality
- Error handling
- Logging
- Docker support
- CI/CD ready

## 🚀 Deployment Options

### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```

### Option 2: Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Option 3: DigitalOcean
Deploy using DigitalOcean App Platform with GitHub integration

### Option 4: AWS
Use AWS Elastic Beanstalk for backend and S3 + CloudFront for frontend

### Option 5: Vercel + Firebase
- Frontend on Vercel
- Backend on Firebase Cloud Functions
- Database on Firebase Firestore

## 📈 Performance Optimization

Generated projects include:
- Code splitting
- Lazy loading
- Image optimization
- Minification
- Compression
- Caching strategies
- Database indexing
- Query optimization

## 🧪 Testing

Generate projects with test suites:
```bash
npm test                    # Run tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### Generation Failed
- Check backend logs: `npm run dev`
- Verify MongoDB connection
- Check API endpoint responses

### Files Not Showing
- Refresh the page
- Check browser console for errors
- Verify project ID is correct

### Download Issues
- Check file sizes in browser
- Try different browser
- Check available disk space

### Preview Not Working
- Ensure React files are generated
- Check syntax highlighting support
- Try downloading and viewing locally

## 📚 Additional Resources

- [Full Documentation](./COMPLETE_DOCUMENTATION.md)
- [API Reference](./backend/API_DOCUMENTATION.md)
- [Architecture Guide](./docs/architecture/README.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🤝 Support

For issues and questions:
- GitHub Issues: https://github.com/Prashant-ai23/AI-Website-Generator/issues
- Email: support@ai-website-generator.dev
- Discord: [Join Community](https://discord.gg/ai-website-generator)

---

**Generated with ❤️ by AI Website Generator**
