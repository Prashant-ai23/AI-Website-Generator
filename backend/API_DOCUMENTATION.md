# 📚 AI Website Generator API Documentation

## Overview

This is a comprehensive RESTful API for the AI Website Generator application. The API follows best practices with versioning, authentication, error handling, and modular structure.

**Base URL**: `http://localhost:3000/api/v1`

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained after login and has a default expiration of 7 days.

---

## 📊 Modules & Endpoints

### 1. **Authentication Module** (`/auth`)

User registration, login, and token management.

#### Register New User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

Response (201):
{
  "statusCode": 201,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGc..."
  },
  "message": "User registered successfully",
  "success": true
}
```

#### Login User
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  },
  "message": "Login successful",
  "success": true
}
```

#### Get Current User
```
GET /api/v1/auth/me
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "user": { ... }
  },
  "message": "User retrieved successfully",
  "success": true
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGc..."
  },
  "message": "Token refreshed successfully",
  "success": true
}
```

#### Logout
```
POST /api/v1/auth/logout
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": null,
  "message": "Logout successful",
  "success": true
}
```

---

### 2. **User Module** (`/users`)

User profile management, password changes, and user listing (admin).

#### Get User Profile
```
GET /api/v1/users/profile
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "stats": {
      "projects": 5,
      "templates": 12,
      "generatedWebsites": 3
    }
  },
  "message": "Profile retrieved successfully",
  "success": true
}
```

#### Get User by ID
```
GET /api/v1/users/:id
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "user": { ... }
  },
  "message": "User retrieved successfully",
  "success": true
}
```

#### Update User Profile
```
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response (200):
{
  "statusCode": 200,
  "data": {
    "user": { ... }
  },
  "message": "User updated successfully",
  "success": true
}
```

#### Change Password
```
POST /api/v1/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword123"
}

Response (200):
{
  "statusCode": 200,
  "data": {
    "message": "Password changed successfully"
  },
  "message": "Password changed successfully",
  "success": true
}
```

#### Delete User Account
```
DELETE /api/v1/users/:id
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "message": "User account deleted successfully"
  },
  "message": "User account deleted successfully",
  "success": true
}
```

#### Get All Users (Admin)
```
GET /api/v1/users?skip=0&limit=10
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "users": [...],
    "total": 50,
    "skip": 0,
    "limit": 10
  },
  "message": "Users retrieved successfully",
  "success": true
}
```

---

### 3. **Project Module** (`/projects`)

Complete project management with CRUD operations and publishing/archiving.

#### Create Project
```
POST /api/v1/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Website",
  "description": "Personal portfolio website",
  "type": "portfolio"
}

Response (201):
{
  "statusCode": 201,
  "data": {
    "project": {
      "id": "project_id",
      "userId": "user_id",
      "name": "My Website",
      "description": "Personal portfolio website",
      "type": "portfolio",
      "status": "draft",
      "content": {},
      "settings": {},
      "tags": [],
      "views": 0,
      "createdAt": "2026-05-07T...",
      "updatedAt": "2026-05-07T..."
    }
  },
  "message": "Project created successfully",
  "success": true
}
```

#### Get User Projects
```
GET /api/v1/projects?skip=0&limit=10&status=draft&type=portfolio&search=portfolio
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "projects": [...],
    "total": 5,
    "skip": 0,
    "limit": 10
  },
  "message": "Projects retrieved successfully",
  "success": true
}
```

#### Get Project by ID
```
GET /api/v1/projects/:id
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "project": { ... }
  },
  "message": "Project retrieved successfully",
  "success": true
}
```

#### Update Project
```
PUT /api/v1/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "content": { ... }
}

Response (200):
{
  "statusCode": 200,
  "data": {
    "project": { ... }
  },
  "message": "Project updated successfully",
  "success": true
}
```

#### Publish Project
```
POST /api/v1/projects/:id/publish
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "project": {
      ...
      "status": "published"
    }
  },
  "message": "Project published successfully",
  "success": true
}
```

#### Archive Project
```
POST /api/v1/projects/:id/archive
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "project": {
      ...
      "status": "archived"
    }
  },
  "message": "Project archived successfully",
  "success": true
}
```

#### Duplicate Project
```
POST /api/v1/projects/:id/duplicate
Authorization: Bearer <token>

Response (201):
{
  "statusCode": 201,
  "data": {
    "project": {
      ...
      "name": "My Website (Copy)"
    }
  },
  "message": "Project duplicated successfully",
  "success": true
}
```

#### Delete Project
```
DELETE /api/v1/projects/:id
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "message": "Project deleted successfully"
  },
  "message": "Project deleted successfully",
  "success": true
}
```

---

### 4. **AI Generation Module** (`/ai`)

AI-powered website generation and optimization tools.

#### Generate Website
```
POST /api/v1/ai/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Create a modern tech startup website",
  "type": "website",
  "industry": "technology",
  "style": "modern"
}

Response (200):
{
  "statusCode": 200,
  "data": {
    "website": {
      "name": "TECHNOLOGY WEBSITE",
      "description": "Create a modern tech startup website",
      "type": "website",
      "sections": [
        {
          "id": "hero",
          "title": "Hero Section",
          "type": "hero",
          "content": { ... }
        },
        ...
      ],
      "colorScheme": {
        "primary": "#3B82F6",
        "secondary": "#1E40AF",
        "accent": "#F59E0B"
      },
      "fonts": {
        "heading": "Inter",
        "body": "Inter"
      }
    }
  },
  "message": "Website generated successfully",
  "success": true
}
```

#### Analyze Website Content
```
POST /api/v1/ai/analyze/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "seo": true,
  "performance": true,
  "accessibility": true
}

Response (200):
{
  "statusCode": 200,
  "data": {
    "analysis": {
      "seo": {
        "score": 78,
        "recommendations": [...]
      },
      "performance": {
        "score": 85,
        "recommendations": [...]
      },
      "accessibility": {
        "score": 72,
        "recommendations": [...]
      }
    }
  },
  "message": "Content analysis completed",
  "success": true
}
```

#### Optimize Website Performance
```
POST /api/v1/ai/optimize/:projectId
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "optimizations": {
      "imageOptimization": [...],
      "codeOptimization": { ... },
      "caching": { ... }
    }
  },
  "message": "Performance optimization completed",
  "success": true
}
```

#### Generate Color Palette
```
POST /api/v1/ai/color-palette
Authorization: Bearer <token>
Content-Type: application/json

{
  "style": "modern"
}

Response (200):
{
  "statusCode": 200,
  "data": {
    "palette": {
      "primary": "#0F172A",
      "secondary": "#64748B",
      "accent": "#3B82F6",
      "background": "#F8FAFC"
    }
  },
  "message": "Color palette generated successfully",
  "success": true
}
```

#### Generate Typography
```
POST /api/v1/ai/typography
Authorization: Bearer <token>

Response (200):
{
  "statusCode": 200,
  "data": {
    "typography": {
      "h1": { "size": "3.75rem", "weight": 700 },
      "h2": { "size": "3rem", "weight": 700 },
      ...
      "body": { "size": "1rem", "weight": 400 }
    }
  },
  "message": "Typography generated successfully",
  "success": true
}
```

#### Generate Layout Suggestions
```
POST /api/v1/ai/layout-suggestions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "portfolio"
}

Response (200):
{
  "statusCode": 200,
  "data": {
    "layouts": [
      {
        "id": "hero",
        "type": "hero",
        "title": "Hero Section"
      },
      ...
    ]
  },
  "message": "Layout suggestions generated successfully",
  "success": true
}
```

---

## 🔗 Response Format

All API responses follow a consistent format:

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

For errors:

```json
{
  "statusCode": 400,
  "data": {
    "message": "Error message",
    "errors": [],
    "timestamp": "2026-05-07T..."
  },
  "message": "Error message",
  "success": false
}
```

---

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized (Invalid/Missing Token) |
| 403 | Forbidden (Insufficient Permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🚀 Project Types

- `website` - General website
- `blog` - Blog platform
- `portfolio` - Portfolio website
- `ecommerce` - E-commerce store
- `saas` - SaaS application
- `custom` - Custom project

---

## 📈 Project Statuses

- `draft` - Work in progress
- `published` - Published and live
- `archived` - Archived projects

---

## 🎯 Design Styles

- `modern` - Modern, minimalist design
- `vibrant` - Colorful, vibrant design
- `minimal` - Minimalist design
- `professional` - Professional, corporate design

---

## 📝 Query Parameters

### Pagination
- `skip` - Number of items to skip (default: 0)
- `limit` - Number of items to return (default: 10)

### Filtering
- `status` - Filter by project status
- `type` - Filter by project type
- `search` - Search in project name and description

---

## 🔧 Rate Limiting

Currently not implemented. Production deployments should include rate limiting.

---

## 📞 Support

For issues or questions, please contact support or create an issue in the repository.

---

## 📄 License

MIT License - See LICENSE file for details
