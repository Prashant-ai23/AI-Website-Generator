# 📐 AI Generator - Architecture Guide

**Deep dive into the system design, components, and data flow**

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                          │
│  (React + TypeScript + Vite + Tailwind CSS)                 │
│                                                               │
│  ┌─────────────────┐  ┌──────────────────┐                  │
│  │ AIGeneratorPage │  │ PromptEditor     │                  │
│  ├─────────────────┤  │ GenerationProgress
│  │ Project Mgmt    │  │ FilesExplorer    │                  │
│  │ File Browser    │  │ CodeEditor       │                  │
│  └─────────────────┘  └──────────────────┘                  │
│           │                    │                             │
│           └────────┬───────────┘                             │
│                    │ HTTP/REST API                           │
├──────────────────────────────────────────────────────────────┤
│                    API Gateway Layer                         │
│         (Authentication, CORS, Error Handling)              │
├──────────────────────────────────────────────────────────────┤
│                     Backend Layer                            │
│     (Express.js + TypeScript + Node.js)                     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          AIGeneratorRoutes (/api/v1/ai-generator)   │   │
│  │                                                       │   │
│  │  Endpoints:                                           │   │
│  │  • POST /analyze - Analyze prompts                   │   │
│  │  • POST /generate - Create projects                  │   │
│  │  • GET /projects - List projects                     │   │
│  │  • PUT /files/:id - Edit files                       │   │
│  │  • GET /prompts - Prompt history                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │        AIGeneratorController                         │   │
│  │                                                       │   │
│  │  Request Handlers:                                   │   │
│  │  • analyzePrompt()                                   │   │
│  │  • generateProject()                                 │   │
│  │  • getUserProjects()                                 │   │
│  │  • getProjectStatus()                                │   │
│  │  • getProjectFiles()                                 │   │
│  │  • getFileContent()                                  │   │
│  │  • updateFile()                                      │   │
│  │  • downloadProject()                                 │   │
│  │  • cloneProject()                                    │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │    AIGeneratorService (Business Logic)              │   │
│  │                                                       │   │
│  │  Core Methods:                                       │   │
│  │  • analyzeRequirements() - Parse prompts             │   │
│  │  • createGenerationProject() - Initialize            │   │
│  │  • generateFrontend() - React components             │   │
│  │  • generateBackend() - Express APIs                  │   │
│  │  • generateDatabase() - MongoDB schemas              │   │
│  │  • generateAuthentication() - Auth logic             │   │
│  │  • generateDocumentation() - Docs                    │   │
│  │  • generateDeployment() - Docker config              │   │
│  │  • startFullGeneration() - Orchestrator              │   │
│  │                                                       │   │
│  │  Template Generators (50+):                          │   │
│  │  • generateAppComponent()                            │   │
│  │  • generateLayoutComponent()                         │   │
│  │  • generatePageComponent()                           │   │
│  │  • generateServerFile()                              │   │
│  │  • generateMongooseSchema()                          │   │
│  │  • ... and 45+ more                                  │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
├─────────────────────────┼────────────────────────────────────┤
│                         │ ORM/ODM                           │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │           Mongoose/MongoDB Models                    │   │
│  │                                                       │   │
│  │  • GeneratedProject                                  │   │
│  │  • GeneratedFile                                     │   │
│  │  • RequirementAnalysis                               │   │
│  │  • PromptHistory                                     │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼────────────────────────────────────┘
                          │ TCP/IP MongoDB Protocol
┌─────────────────────────▼────────────────────────────────────┐
│                     MongoDB                                   │
│                   (Database Layer)                            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Database: ai-generator                             │   │
│  │                                                     │   │
│  │ Collections:                                       │   │
│  │ • generatedprojects (project metadata)            │   │
│  │ • generatedfiles (code files)                      │   │
│  │ • requirementanalyses (prompt analysis)            │   │
│  │ • prompthistories (user prompts)                   │   │
│  │                                                     │   │
│  │ Indexes:                                           │   │
│  │ • { userId: 1 }                                   │   │
│  │ • { projectId: 1 }                                │   │
│  │ • { category: 1 }                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### 1. Project Generation Flow

```
┌──────────────────────────────────────────────────────────┐
│ User enters prompt in PromptEditor                        │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ POST /api/v1/ai-generator/generate                       │
│ • User token verified                                    │
│ • Request validated                                      │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ aiGeneratorController.generateProject()                  │
│ • Extract parameters from request                        │
│ • Call service layer                                     │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ aiGeneratorService.analyzeRequirements()                 │
│ • Parse prompt for keywords                              │
│ • Extract modules, pages, APIs                           │
│ • Detect authentication needs                            │
│ • Create RequirementAnalysis record                      │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ aiGeneratorService.createGenerationProject()             │
│ • Create GeneratedProject document                       │
│ • Set status = "generating"                              │
│ • Set currentPhase = "requirements"                      │
│ • Save to MongoDB                                        │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ aiGeneratorService.startFullGeneration()                 │
│ (Async process begins)                                   │
│                                                           │
│ Phase 1: Requirements ✓ (already done)                  │
│                                                           │
│ Phase 2: Frontend Generation                             │
│ • generateAppComponent()                                 │
│ • generateLayoutComponent()                              │
│ • generatePageComponents()                               │
│ • generateComponentFiles()                               │
│ • generateTypesFile()                                    │
│ • generateViteConfig()                                   │
│ • Create GeneratedFile for each                          │
│                                                           │
│ Phase 3: Backend Generation                              │
│ • generateServerFile()                                   │
│ • generateRoutes()                                        │
│ • generateControllers()                                  │
│ • generateServices()                                     │
│ • generateAuthMiddleware()                               │
│ • Create GeneratedFile for each                          │
│                                                           │
│ Phase 4: Database Generation                             │
│ • generateMongooseSchema()                               │
│ • generateSeedFile()                                     │
│ • Create GeneratedFile for each                          │
│                                                           │
│ Phase 5: Authentication                                  │
│ • generateAuthService()                                  │
│ • generateAuthController()                               │
│ • generateLoginForm()                                    │
│ • generateRegisterForm()                                 │
│ • Create GeneratedFile for each                          │
│                                                           │
│ Phase 6: Documentation                                   │
│ • generateReadme()                                       │
│ • generateAPIDocumentation()                             │
│ • generateArchitecture()                                 │
│ • Create GeneratedFile for each                          │
│                                                           │
│ Phase 7: Deployment                                      │
│ • generateDockerfile()                                   │
│ • generateDockerCompose()                                │
│ • generateNginxConfig()                                  │
│ • generateGithubWorkflow()                               │
│ • Create GeneratedFile for each                          │
│                                                           │
│ Update Progress: 0% → 100%                              │
│ Update Status: generating → completed                    │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ Frontend polling checks status                           │
│ GET /api/v1/ai-generator/projects/:projectId            │
│ • Every 5 seconds                                        │
│ • Shows progress in GenerationProgress component         │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ Generation Complete                                       │
│ • Status = "completed"                                   │
│ • All files saved to database                            │
│ • Frontend shows Files & Code tabs                       │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Component Communication

### Frontend Component Hierarchy

```
App.tsx
├── ProtectedRoute
│   └── AIGeneratorPage
│       ├── Tab Navigation
│       │
│       ├── Projects Tab
│       │   ├── Project List (maps GeneratedProject[])
│       │   │   ├── Project Card
│       │   │   │   ├── Progress Bar
│       │   │   │   ├── Status Badge
│       │   │   │   └── Action Buttons
│       │   │   │       ├── View Details
│       │   │   │       ├── Clone
│       │   │   │       └── Delete
│       │   │   │
│       │   │   └── Pagination Controls
│       │
│       ├── Create Tab
│       │   └── PromptEditor
│       │       ├── Textarea (prompt input)
│       │       ├── Quick Suggestions Buttons
│       │       ├── Advanced Options Toggle
│       │       │   ├── Project Configuration
│       │       │   ├── Tech Stack Selection
│       │       │   └── Feature Checkboxes
│       │       └── Submit Button
│       │
│       ├── Files Tab
│       │   └── GeneratedFilesExplorer
│       │       ├── Category Sidebar
│       │       │   ├── Frontend (expand/collapse)
│       │       │   ├── Backend
│       │       │   ├── Database
│       │       │   ├── Deployment
│       │       │   └── Other
│       │       │
│       │       ├── Files List
│       │       │   ├── File Item
│       │       │   │   ├── Icon
│       │       │   │   ├── Filename
│       │       │   │   └── Metadata
│       │       │   │
│       │       └── File Info Panel
│       │           ├── File Metadata
│       │           ├── View Button
│       │           ├── Copy Button
│       │           └── Download Button
│       │
│       ├── Code Tab
│       │   └── CodeEditor
│       │       ├── Header
│       │       │   ├── File Info
│       │       │   ├── Copy Button
│       │       │   ├── Download Button
│       │       │   └── Save Button
│       │       │
│       │       ├── Info Bar
│       │       │   ├── Language
│       │       │   ├── Line Count
│       │       │   └── File Size
│       │       │
│       │       ├── Editor Area
│       │       │   ├── Line Numbers
│       │       │   └── Textarea (code editor)
│       │       │
│       │       └── Footer
│       │           └── Save Changes Button
│       │
│       └── GenerationProgress (when generating)
│           ├── Overall Progress Bar
│           ├── Info Cards
│           │   ├── Files Generated
│           │   ├── Current Phase
│           │   └── Progress %
│           │
│           └── Phase Timeline
│               ├── Phase 1: Requirements
│               ├── Phase 2: Frontend
│               ├── Phase 3: Backend
│               ├── Phase 4: Database
│               ├── Phase 5: Authentication
│               ├── Phase 6: Documentation
│               └── Phase 7: Deployment
```

---

## 🗂️ File Structure

### Backend Structure

```
backend/src/
├── models/
│   ├── GeneratedProject.ts (Project metadata)
│   ├── GeneratedFile.ts (Individual files)
│   ├── RequirementAnalysis.ts (Parsed requirements)
│   ├── PromptHistory.ts (User prompts)
│   └── User.ts (Auth user)
│
├── controllers/
│   └── aiGeneratorController.ts
│       ├── analyzePrompt()
│       ├── generateProject()
│       ├── getUserProjects()
│       ├── getProjectStatus()
│       ├── getProjectFiles()
│       ├── getFileContent()
│       ├── updateFile()
│       ├── downloadProject()
│       ├── cloneProject()
│       ├── deleteProject()
│       └── savePromptAsFavorite()
│
├── services/
│   └── aiGeneratorService.ts
│       ├── Requirement Analysis Methods
│       │   ├── analyzeRequirements()
│       │   ├── detectProjectType()
│       │   ├── extractModules()
│       │   ├── extractPages()
│       │   ├── extractAPIs()
│       │   ├── extractCollections()
│       │   ├── detectAuthentication()
│       │   ├── extractRoles()
│       │   └── extractFeatures()
│       │
│       ├── Core Generation Methods
│       │   ├── createGenerationProject()
│       │   ├── generateFrontend()
│       │   ├── generateBackend()
│       │   ├── generateDatabase()
│       │   ├── generateAuthentication()
│       │   ├── generateDocumentation()
│       │   ├── generateDeployment()
│       │   └── startFullGeneration()
│       │
│       └── Template Generators (50+)
│           ├── React Templates
│           ├── Express Templates
│           ├── Mongoose Templates
│           ├── Config Templates
│           └── Documentation Templates
│
├── routes/
│   └── v1/aiGenerator.ts
│       ├── POST /analyze
│       ├── POST /generate
│       ├── GET /projects
│       ├── GET /projects/:id
│       ├── GET /projects/:id/files
│       ├── GET /projects/:id/download
│       ├── POST /projects/:id/clone
│       ├── DELETE /projects/:id
│       ├── GET /files/:id
│       ├── PUT /files/:id
│       ├── GET /prompts
│       └── POST /prompts/favorite
│
├── middleware/
│   ├── authenticate.ts
│   └── errorHandler.ts
│
└── types/
    └── index.ts (TypeScript interfaces)
```

### Frontend Structure

```
frontend/src/
├── pages/
│   └── AIGeneratorPage.tsx
│       • Main page component
│       • Tab management
│       • State management
│       • API integration
│
├── components/AIGenerator/
│   ├── PromptEditor.tsx
│   │   • Prompt input
│   │   • Suggestions
│   │   • Advanced options
│   │
│   ├── GenerationProgress.tsx
│   │   • Progress bar
│   │   • Phase timeline
│   │   • Status badges
│   │
│   ├── GeneratedFilesExplorer.tsx
│   │   • File tree
│   │   • Category filtering
│   │   • File selection
│   │   • File info panel
│   │
│   └── CodeEditor.tsx
│       • Code display
│       • Line numbers
│       • Save functionality
│       • Copy/Download
│
├── config/
│   └── routes.tsx
│       • Route definitions
│       • /ai-generator route
│
├── types/
│   └── index.ts
│       • Project interface
│       • File interface
│       • Request/Response types
│
├── services/
│   └── api.ts
│       • API client functions
│       • Bearer token auth
│
└── store/ (if using Redux)
    └── generatorSlice.ts
```

---

## 🔀 Request/Response Flow

### Example: Generate Project

**Request**:
```http
POST /api/v1/ai-generator/generate HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "My Todo App",
  "slug": "my-todo-app",
  "prompt": "Create a todo app with user authentication",
  "projectType": "fullstack",
  "techStack": {
    "frontend": "React",
    "backend": "Express.js",
    "database": "MongoDB"
  },
  "options": {
    "includeDocumentation": true,
    "includeTests": false,
    "useDocker": true
  }
}
```

**Response**:
```json
{
  "statusCode": 201,
  "data": {
    "project": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "My Todo App",
      "slug": "my-todo-app",
      "description": "Create a todo app with user authentication",
      "prompt": "Create a todo app with user authentication",
      "creator": "507f1f77bcf86cd799439010",
      "status": "generating",
      "projectType": "fullstack",
      "requirements": {
        "modules": ["todos", "auth"],
        "pages": ["login", "register", "todos"],
        "apis": [
          {
            "endpoint": "/api/todos",
            "method": "GET",
            "description": "Get all todos"
          }
        ],
        "collections": ["Todo", "User"],
        "authentication": "JWT",
        "userRoles": ["user"],
        "features": ["create todo", "mark complete", "delete todo"]
      },
      "techStack": {
        "frontend": "React",
        "backend": "Express.js",
        "database": "MongoDB",
        "authentication": "JWT"
      },
      "progress": 5,
      "currentPhase": "analyzing",
      "filesCount": 0,
      "errors": [],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Generation started successfully"
}
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────┐
│    Frontend (React)                  │
│ ┌───────────────────────────────────┐│
│ │ Protected Route Wrapper            ││
│ │ • Check if user logged in         ││
│ │ • Redirect to login if not        ││
│ └───────────────────────────────────┘│
└────────────────┬──────────────────────┘
                 │ With Bearer Token
                 │ in Authorization Header
┌────────────────▼──────────────────────┐
│    API Gateway                        │
│ ┌───────────────────────────────────┐│
│ │ CORS Validation                    ││
│ │ • Check Origin                    ││
│ │ • Allowed Methods                 ││
│ └───────────────────────────────────┘│
└────────────────┬──────────────────────┘
                 │ HTTP Request
┌────────────────▼──────────────────────┐
│    Express Middleware                 │
│ ┌───────────────────────────────────┐│
│ │ Authentication Middleware          ││
│ │ • Extract token from header       ││
│ │ • Verify JWT signature            ││
│ │ • Decode user info                ││
│ │ • Attach to request (AuthRequest) ││
│ └───────────────────────────────────┘│
└────────────────┬──────────────────────┘
                 │ Authenticated Request
┌────────────────▼──────────────────────┐
│    Route Handler                      │
│ ┌───────────────────────────────────┐│
│ │ Authorization Checks               ││
│ │ • Is user allowed?                ││
│ │ • Can access resource?            ││
│ │ • Owner verification              ││
│ └───────────────────────────────────┘│
└────────────────┬──────────────────────┘
                 │ Validated Request
┌────────────────▼──────────────────────┐
│    Database Operations                │
│ ┌───────────────────────────────────┐│
│ │ • Query only user's projects      ││
│ │ • Update ownership checks         ││
│ │ • Sanitize input                  ││
│ └───────────────────────────────────┘│
└────────────────┬──────────────────────┘
                 │ Safe Database Query
                 ▼
         MongoDB (Database)
```

---

## 🚀 Scalability Considerations

### Current Architecture Limits
- Single Node.js process
- File generation sequential (not parallel)
- All files in memory during generation

### Future Optimization Options

1. **Horizontal Scaling**
   ```
   Load Balancer
   ├── Backend Server 1
   ├── Backend Server 2
   └── Backend Server 3
   
   Shared: MongoDB, Redis (caching)
   ```

2. **Queue-Based Processing**
   ```
   Prompt → Queue → Worker Pool → Database
   
   Benefits: Async processing, better resource management
   ```

3. **Microservices**
   ```
   API Gateway
   ├── Analysis Service
   ├── Frontend Generator Service
   ├── Backend Generator Service
   ├── Database Generator Service
   └── Deployment Generator Service
   ```

4. **Caching Layer**
   ```
   Request → Redis Cache
   ├── Hit: Return cached result
   └── Miss: Generate & Cache
   ```

---

## 📈 Database Schema Design

### GeneratedProject Collection
```javascript
{
  _id: ObjectId,
  name: String (indexed),
  slug: String (indexed, unique per user),
  description: String,
  prompt: String,
  creator: ObjectId (ref: User),
  status: String, // analyzing, generating, completed, failed
  projectType: String, // frontend, backend, fullstack, mobile
  
  requirements: {
    modules: [String],
    pages: [{name, slug, description}],
    apis: [{endpoint, method, description}],
    collections: [String],
    authentication: String,
    userRoles: [String],
    features: [String]
  },
  
  techStack: {
    frontend: String,
    backend: String,
    database: String,
    authentication: String
  },
  
  progress: Number, // 0-100
  currentPhase: String,
  filesCount: Number,
  
  errors: [{
    phase: String,
    error: String,
    timestamp: Date
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

### GeneratedFile Collection
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (indexed, ref: GeneratedProject),
  userId: ObjectId (indexed, ref: User),
  
  fileName: String,
  filePath: String,
  fileType: String, // component, page, api, schema, config
  category: String, // frontend, backend, database, deployment
  
  content: String,
  language: String, // typescript, json, yaml, markdown
  size: Number,
  lineCount: Number,
  
  status: String, // generated, modified, error
  generatedBy: String, // which phase generated this
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Key Design Decisions

### 1. **Synchronous Request, Async Processing**
- Return project immediately to user
- Process generation in background
- User polls for progress updates
- Prevents timeout on long generations

### 2. **Template-Based Generation**
- Pre-defined templates for each component type
- Substitution of variables
- Ensures consistent code structure
- Easy to modify and extend

### 3. **Requirement Analysis Phase**
- Parse requirements separately
- Store analysis for audit trail
- Enable requirement refinement
- Foundation for future AI improvements

### 4. **File-Centric Storage**
- Each file stored individually in database
- Enables granular access control
- Supports file editing and updates
- Easy to export/download specific files

### 5. **Modular Generation Phases**
- 7 phases can run independently
- Each phase can be retried
- Supports partial regeneration
- Clear progress tracking

---

This architecture provides a scalable, secure, and maintainable system for AI-powered code generation.
