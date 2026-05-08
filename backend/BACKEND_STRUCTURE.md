# Backend Architecture & Structure

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.ts      # MongoDB connection
│   │
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── projectController.ts
│   │   └── aiGenerationController.ts
│   │
│   ├── models/              # Database models
│   │   ├── User.ts
│   │   ├── Website.ts
│   │   └── Project.ts
│   │
│   ├── services/            # Business logic
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── projectService.ts
│   │   └── aiGenerationService.ts
│   │
│   ├── routes/
│   │   ├── auth.ts          # Legacy auth routes
│   │   ├── website.ts       # Legacy website routes
│   │   └── v1/              # API v1 routes
│   │       ├── index.ts     # Route aggregation
│   │       ├── auth.ts
│   │       ├── users.ts
│   │       ├── projects.ts
│   │       └── ai.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   └── errorHandler.ts  # Error handling
│   │
│   ├── utils/               # Utility functions
│   │   ├── apiError.ts      # Custom error class
│   │   ├── apiResponse.ts   # Response wrapper
│   │   └── jwt.ts           # Token utilities
│   │
│   └── server.ts            # Main Express app
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🏗️ Architecture Pattern

### MVC + Service Layer Pattern

```
Request → Route → Controller → Service → Model → Database
                                    ↓
                                Response
```

### Layer Responsibilities

**Controllers**
- Parse and validate incoming requests
- Call appropriate services
- Return formatted responses
- Handle HTTP status codes

**Services**
- Contain business logic
- Interact with models
- Throw custom errors
- Return processed data

**Models**
- Define data structure (Mongoose schemas)
- Handle data validation
- Implement database hooks
- Define indexes and relationships

**Routes**
- Define HTTP endpoints
- Apply middleware
- Map to controllers
- Document API contracts

**Middleware**
- Authentication (JWT verification)
- Error handling (catch and format errors)
- CORS, body parsing, etc.

---

## 🔐 Authentication Flow

```
1. User registers/logs in
   ↓
2. Service creates JWT token
   ↓
3. Token sent to frontend
   ↓
4. Frontend includes token in Authorization header
   ↓
5. Auth middleware verifies token
   ↓
6. Request proceeds with user context
   ↓
7. Response returned
```

---

## 🌐 API Versioning

Currently at **v1**. Future versions (v2, v3) would be added under `/routes/v2/`, `/routes/v3/`, etc.

### Version Management
- `/api/v1/` - All current endpoints
- Each version is independent
- Backward compatibility maintained through versioning
- Migration guide provided for major versions

---

## 📦 Module Overview

### 1. Authentication Module
**Location**: `controllers/authController.ts` + `services/authService.ts`

**Responsibilities**:
- User registration with email verification
- Login with password hashing (bcrypt)
- JWT token generation and refresh
- Token validation and user extraction

**Key Methods**:
- `register()` - Create new user account
- `login()` - Authenticate user
- `verifyToken()` - Validate JWT token
- `refreshToken()` - Generate new token

---

### 2. User Module
**Location**: `controllers/userController.ts` + `services/userService.ts`

**Responsibilities**:
- User profile management
- Password changes
- User listing (admin)
- Account deletion

**Key Methods**:
- `getUserById()` - Fetch user by ID
- `getAllUsers()` - List all users (paginated)
- `updateUser()` - Update user profile
- `changePassword()` - Change user password
- `deleteUser()` - Delete user account

---

### 3. Project Module
**Location**: `controllers/projectController.ts` + `services/projectService.ts`

**Responsibilities**:
- Project CRUD operations
- Project status management (draft/published/archived)
- Project filtering and searching
- Project duplication

**Key Methods**:
- `createProject()` - Create new project
- `getUserProjects()` - List user's projects
- `getProjectById()` - Fetch specific project
- `updateProject()` - Update project details
- `deleteProject()` - Delete project
- `publishProject()` - Publish to live
- `archiveProject()` - Archive project
- `duplicateProject()` - Create copy of project

---

### 4. AI Generation Module
**Location**: `controllers/aiGenerationController.ts` + `services/aiGenerationService.ts`

**Responsibilities**:
- Website generation from prompts
- Content analysis and recommendations
- Performance optimization suggestions
- Design system generation (colors, typography)
- Layout suggestions

**Key Methods**:
- `generateWebsite()` - AI-powered website generation
- `analyzeContent()` - Analyze SEO, performance, accessibility
- `optimizePerformance()` - Get optimization recommendations
- `generateColorPalette()` - Generate color schemes
- `generateTypography()` - Generate typography scales
- `generateLayoutSuggestions()` - Suggest layouts

---

## 🔄 Error Handling

### Error Hierarchy

```
Error (built-in)
├── ApiError (custom)
│   ├── 400 - Bad Request
│   ├── 401 - Unauthorized
│   ├── 403 - Forbidden
│   └── 404 - Not Found
└── System Errors (500)
```

### Error Flow

```
Exception thrown
    ↓
Caught in controller try-catch
    ↓
Passed to next(error)
    ↓
Global error handler middleware
    ↓
Formatted response returned
```

### Example Error Response

```json
{
  "statusCode": 400,
  "data": {
    "message": "Invalid email format",
    "errors": [],
    "timestamp": "2026-05-07T..."
  },
  "message": "Invalid email format",
  "success": false
}
```

---

## 🗄️ Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string,
  description: string,
  type: enum (website|blog|portfolio|ecommerce|saas|custom),
  status: enum (draft|published|archived),
  content: Mixed,
  settings: {
    theme?: string,
    domain?: string,
    seoMetadata?: object
  },
  tags: string[],
  views: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Website Collection (Legacy)
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string,
  content: Mixed,
  theme: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 Middleware Stack

```
Express App
├── CORS middleware
├── JSON body parser
├── URL-encoded parser
│
├─→ Auth routes (public)
│   └── Error handler
│
├─→ User routes (protected)
│   ├── Auth middleware
│   └── Error handler
│
├─→ Project routes (protected)
│   ├── Auth middleware
│   └── Error handler
│
└─→ AI routes (protected)
    ├── Auth middleware
    └── Error handler
```

---

## 🚀 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-website-generator

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# MCP Server (optional)
MCP_SERVER_URL=http://localhost:3001
```

---

## 📝 TypeScript Configuration

- **Target**: ES2020
- **Module**: ESNext
- **Strict Mode**: Enabled
- **Import Resolution**: Node
- **Lib**: ES2020, DOM

---

## 🧪 Testing Recommendations

1. **Unit Tests** - Test individual services
2. **Integration Tests** - Test API endpoints
3. **E2E Tests** - Test complete user flows

### Tools
- Jest for unit/integration testing
- Supertest for API testing
- MongoDB Memory Server for test database

---

## 🔒 Security Features

1. **Password Hashing** - bcrypt with salt rounds
2. **JWT Tokens** - Secure token-based auth
3. **CORS Protection** - Whitelist frontend origin
4. **Input Validation** - Mongoose schema validation
5. **Error Handling** - No sensitive data in errors
6. **Authorization** - User-level access control

---

## 📊 Performance Considerations

1. **Database Indexing** - Indexes on userId, status, type
2. **Query Optimization** - Lean queries, field selection
3. **Pagination** - Limit results per request
4. **Caching** - Ready for Redis integration
5. **Rate Limiting** - Ready for implementation

---

## 🔄 Future Enhancements

1. **Real AI Integration** - Replace mock with actual AI API
2. **WebSocket Support** - Real-time collaboration
3. **File Uploads** - S3 or cloud storage
4. **Email Notifications** - Nodemailer integration
5. **Analytics** - Track user metrics
6. **Payment Integration** - Stripe/PayPal
7. **Advanced Caching** - Redis integration
8. **Rate Limiting** - Express Rate Limit
9. **API Logging** - Winston/Morgan
10. **Monitoring** - Sentry/New Relic

---

## 🤝 Contributing

Follow the established patterns:
- Use TypeScript for type safety
- Extend service layer for business logic
- Create controllers for HTTP handlers
- Use middleware for cross-cutting concerns
- Follow existing error handling patterns

