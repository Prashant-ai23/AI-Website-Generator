# Architecture

## System Overview

```
┌─────────────────┐
│   Frontend      │
│  (React + TS)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Backend       │◄────►│   MongoDB    │
│ (Express + TS)  │      │   Database   │
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│  MCP Server     │
│  (AI Tools)     │
└─────────────────┘
```

## Component Architecture

### Frontend (React)
- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Vite** for fast development and production builds

### Backend (Express + Node.js)
- **Express** web framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Database (MongoDB)
- **Collections**: Users, Websites
- **Authentication**: JWT-based
- **Data validation**: Mongoose schemas

### MCP Server
- **Model Context Protocol** implementation
- **Tools**: Website generation, content analysis, optimization
- **Integration**: Connects with backend API

### Shared Module
- **TypeScript types** for type safety
- **Utilities**: Helpers, storage, validators
- **Consistency**: Used across all modules

## Data Flow

### Authentication Flow
```
User Input
   ▼
Frontend (Login Form)
   ▼
Backend (POST /api/auth/login)
   ▼
MongoDB (Verify User)
   ▼
JWT Token Generated
   ▼
Frontend (Store Token)
```

### Website Creation Flow
```
User Input (Website Details)
   ▼
Frontend (Create Form)
   ▼
Backend (POST /api/websites)
   ▼
MongoDB (Save Website)
   ▼
MCP Server (Generate Content)
   ▼
Backend (Update Website)
   ▼
Frontend (Display Website)
```

## API Layer

### Request/Response Pattern
- All requests use JSON
- All responses follow consistent format
- Error handling with proper HTTP status codes

### Authentication
- JWT tokens in Authorization header
- Token expiry: 7 days (configurable)
- Refresh token implementation (future)

## Security Measures

1. **Password Security**
   - bcrypt hashing with salt rounds: 10
   - Never store plain text passwords

2. **JWT Security**
   - Secure secret key (environment variable)
   - Token expiry
   - Signature verification

3. **CORS**
   - Configured for frontend URL only
   - Credentials support

4. **Input Validation**
   - Email format validation
   - Required field checks
   - Type checking with TypeScript

## Scalability Considerations

### Current Implementation
- Single instance deployment
- MongoDB as primary database
- Direct API calls between services

### Future Improvements
- Message queue (RabbitMQ/Redis) for async operations
- Caching layer (Redis)
- Database replication
- Horizontal scaling with load balancer
- Microservices architecture
- CDN for static assets

## Deployment Architecture

```
┌─────────────────────────────────────┐
│        Load Balancer                │
└────────┬────────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Frontend│ │Backend │
│ (S3)   │ │(EC2)   │
└────────┘ └───┬────┘
              │
              ▼
         ┌─────────────┐
         │   MongoDB   │
         │  (Atlas)    │
         └─────────────┘
```

## Module Dependencies

```
frontend
  ├── shared (types)
  └── axios (HTTP client)

backend
  ├── shared (types)
  ├── mongoose (MongoDB)
  ├── express
  ├── jsonwebtoken
  └── bcrypt

mcp-server
  ├── shared (types)
  ├── @modelcontextprotocol/sdk
  └── axios

shared
  └── (no dependencies)
```

## Development Workflow

1. **Local Development**: Run all services locally
2. **Git**: Feature branches and pull requests
3. **Testing**: Unit and integration tests (future)
4. **CI/CD**: Automated testing and deployment (future)
5. **Deployment**: Manual or automated (future)

## Monitoring & Logging

### Current
- Console logs for development

### Recommended for Production
- Structured logging (Winston, Morgan)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Health checks
- Metrics collection
