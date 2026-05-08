/**
 * Documentation Generator Service
 * Generates comprehensive project documentation including README, API docs, installation guides, 
 * architecture documentation, and module-wise documentation
 */

interface DocConfig {
  projectName?: string;
  projectDescription?: string;
  projectVersion?: string;
  authorName?: string;
  authorEmail?: string;
  repoUrl?: string;
  docsUrl?: string;
  includeModules?: boolean;
  includeArchitecture?: boolean;
  includeAPI?: boolean;
}

interface GeneratedDocs {
  readme: string;
  apiDocs: string;
  installationGuide: string;
  architecture: string;
  modules: Record<string, string>;
  allDocs?: string;
}

export class DocumentationGenerator {
  /**
   * Generate comprehensive README.md
   */
  static generateREADME(config: DocConfig = {}): string {
    const {
      projectName = "AI Website Generator",
      projectDescription = "An AI-powered website generation platform with intelligent code scaffolding for full-stack applications",
      projectVersion = "1.0.0",
      authorName = "AI Website Generator Team",
      authorEmail = "team@ai-website-gen.com",
      repoUrl = "https://github.com/yourusername/ai-website-generator",
      docsUrl = "https://docs.ai-website-gen.com",
    } = config;

    return `# ${projectName}

> ${projectDescription}

![Version](https://img.shields.io/badge/version-${projectVersion}-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## 🚀 Overview

${projectName} is a full-stack web application that combines AI-powered analysis with intelligent code generation. It helps developers quickly scaffold complete applications by:

1. **App Analysis** - Analyze app ideas to automatically detect required modules
2. **Frontend Generation** - Generate React components, pages, forms, and layouts
3. **Backend Generation** - Generate Express APIs with MongoDB models, services, and validation
4. **Documentation** - Create comprehensive project documentation automatically

## ✨ Features

### Core Features
- 🤖 **AI-Powered Analysis** - Intelligent prompt analysis for module detection
- ⚛️ **React Code Generation** - Auto-generate pages, forms, tables, and layouts
- 🔌 **API Generation** - Create complete Express REST APIs with CRUD operations
- 📚 **Documentation** - Generate README, API docs, architecture, and guides
- 🔐 **Authentication** - JWT-based auth with role-based access control
- 🎨 **Styling Options** - Support for Tailwind CSS and Material-UI
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🧪 **TypeScript Support** - Full type safety throughout the stack

### AI Prompt Analysis
- Detects 16+ application types (e-commerce, SaaS, blog, etc.)
- Identifies 19+ module patterns (Auth, Users, Products, Cart, Orders, Payments, etc.)
- Calculates confidence scores for recommendations
- Provides alternative module suggestions

### Code Generation
- **Frontend**: React pages, forms, tables, layouts
- **Backend**: Express routes, controllers, services, MongoDB models
- **Features**: Pagination, search, filtering, sorting, validation

### Generated Features
- ✅ CRUD Operations
- ✅ Pagination with configurable page size
- ✅ Full-text search
- ✅ Dynamic filtering
- ✅ Sorting (ascending/descending)
- ✅ Soft delete support
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Unique constraints
- ✅ Database indexes
- ✅ Joi validation schemas

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB 7.5+

### Installation

\`\`\`bash
# Clone the repository
git clone ${repoUrl}.git
cd ai-website-generator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development servers
npm run dev:all
\`\`\`

### First Steps

1. **Register** - Create an account at http://localhost:5173
2. **Analyze** - Describe your app idea
3. **Generate** - Get code scaffolding
4. **Customize** - Add business logic
5. **Deploy** - Push to production

## 📁 Project Structure

\`\`\`
ai-website-generator/
├── backend/                          # Node.js Express backend
│   ├── src/
│   │   ├── models/                   # MongoDB models (User, Project, etc.)
│   │   ├── services/                 # Business logic layer
│   │   │   ├── authService.ts
│   │   │   ├── promptAnalyzer.ts
│   │   │   ├── reactCodeGenerator.ts
│   │   │   ├── backendAPIGenerator.ts
│   │   │   └── documentationGenerator.ts
│   │   ├── controllers/              # Request handlers
│   │   ├── routes/                   # API endpoints
│   │   ├── middleware/               # Auth, validation, error handling
│   │   └── utils/                    # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                         # Compiled JavaScript
│
├── src/                              # React frontend
│   ├── components/                   # Reusable React components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── CodeGenerator.tsx
│   │   ├── BackendGenerator.tsx
│   │   └── DocumentationGenerator.tsx
│   ├── pages/                        # Page components
│   │   ├── Home.tsx
│   │   ├── Analyzer.tsx
│   │   ├── CodeGenerator.tsx
│   │   ├── BackendGenerator.tsx
│   │   └── DocumentationGenerator.tsx
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCodeGenerator.ts
│   │   ├── useBackendGenerator.ts
│   │   └── useDocumentationGenerator.ts
│   ├── types/                        # TypeScript interfaces
│   ├── store/                        # Redux store
│   ├── utils/                        # Utility functions
│   └── routes/                       # Route definitions
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
\`\`\`

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript 5.2** - Type safety
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js 18+** - Runtime
- **Express 4.18** - Web framework
- **TypeScript 5.2** - Type safety
- **MongoDB 7.5** - Database
- **Mongoose 7.5** - ODM
- **JWT** - Authentication
- **Joi** - Validation
- **bcrypt** - Password hashing

### DevOps
- **npm** - Package manager
- **Docker** - Containerization (optional)
- **Git** - Version control

## 🎯 Use Cases

### 1. E-Commerce Platform
\`\`\`
Input: "Create an e-commerce app with user accounts, products, shopping cart, orders, payments"
Output: Full CRUD APIs + React pages for all modules
\`\`\`

### 2. SaaS Application
\`\`\`
Input: "Build a project management tool with teams, tasks, comments, and notifications"
Output: Scaffolding with team auth, task management APIs, real-time features
\`\`\`

### 3. Content Management
\`\`\`
Input: "Create a blog platform with posts, comments, categories, and user profiles"
Output: Blog CRUD APIs + React components + documentation
\`\`\`

## 📖 Usage

### Using the Web Interface

1. **Navigate to Analyzer** (\`/analyzer\`)
   - Describe your application idea
   - Get AI-suggested modules
   - Review module structure

2. **Generate Frontend Code** (\`/codegen\`)
   - Configure component properties
   - Select styling framework (Tailwind/MUI)
   - Generate React pages, forms, tables

3. **Generate Backend APIs** (\`/apigen\`)
   - Define resources and fields
   - Select features (pagination, search, filtering)
   - Generate models, services, controllers

4. **Generate Documentation** (\`/docs\`)
   - Generate README, API docs
   - Create architecture documentation
   - Export module-wise docs

### API Endpoints

#### Authentication
\`\`\`
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login with credentials
POST   /api/v1/auth/refresh      - Refresh JWT token
GET    /api/v1/auth/me           - Get current user
POST   /api/v1/auth/logout       - Logout (client-side)
\`\`\`

#### Prompt Analysis
\`\`\`
POST   /api/v1/analyzer/analyze  - Analyze app prompt
POST   /api/v1/analyzer/quick    - Quick analysis
GET    /api/v1/analyzer/suggest  - Get module suggestions
\`\`\`

#### Code Generation
\`\`\`
POST   /api/v1/codegen/page      - Generate React page
POST   /api/v1/codegen/form      - Generate form component
POST   /api/v1/codegen/table     - Generate table component
POST   /api/v1/codegen/layout    - Generate layout component
POST   /api/v1/codegen/routing   - Generate routing config
\`\`\`

#### API Generation
\`\`\`
POST   /api/v1/apigen/model      - Generate MongoDB model
POST   /api/v1/apigen/service    - Generate service layer
POST   /api/v1/apigen/controller - Generate controller
POST   /api/v1/apigen/routes     - Generate routes
POST   /api/v1/apigen/validation - Generate validation
POST   /api/v1/apigen/complete   - Generate complete API
\`\`\`

#### Documentation
\`\`\`
POST   /api/v1/docs/readme       - Generate README
POST   /api/v1/docs/api          - Generate API documentation
POST   /api/v1/docs/install      - Generate installation guide
POST   /api/v1/docs/architecture - Generate architecture docs
POST   /api/v1/docs/modules      - Generate module docs
POST   /api/v1/docs/complete     - Generate all docs
\`\`\`

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register** - Create account with email/password
2. **Login** - Receive JWT token valid for 7 days
3. **Store** - Save token in localStorage as \`auth_token\`
4. **Use** - Include token in Authorization header
5. **Refresh** - Get new token before expiration

### Roles
- **User** - Regular user access (default)
- **Admin** - Full system access

## 📚 Documentation

Full documentation available at: ${docsUrl}

- [API Documentation](${docsUrl}/api)
- [Architecture Guide](${docsUrl}/architecture)
- [Installation Guide](${docsUrl}/install)
- [Module Documentation](${docsUrl}/modules)
- [Contributing Guide](${docsUrl}/contributing)

## 🔧 Development

### Development Setup

\`\`\`bash
# Install dependencies
cd backend
npm install
cd ../
npm install

# Set environment variables
cp .env.example .env
\`\`\`

### Environment Variables

Create \`.env\` file in root:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-website-gen

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# API
API_PORT=5000
API_HOST=localhost

# Frontend
VITE_API_URL=http://localhost:5000

# CORS
CORS_ORIGIN=http://localhost:5173
\`\`\`

### Running Development Servers

\`\`\`bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Both (alternative)
npm run dev:all
\`\`\`

### Building for Production

\`\`\`bash
# Backend
cd backend
npm run build

# Frontend
npm run build

# Preview
npm run preview
\`\`\`

### Running Tests

\`\`\`bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
\`\`\`

## 📝 Linting and Formatting

\`\`\`bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format with Prettier
npm run format
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- React hooks (no class components)
- Functional components

### Commit Messages
- Use descriptive commit messages
- Follow conventional commits format
- Reference issues when applicable

## 🐛 Issue Reporting

Found a bug? Please create an issue with:

- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/Node version
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Authors

- **${authorName}** - [${authorEmail}](mailto:${authorEmail})

## 🙏 Acknowledgments

- React and Redux teams for excellent frameworks
- Express.js community for the web framework
- MongoDB team for the database
- Tailwind CSS for the styling utility-first framework

## 📞 Support

- Documentation: ${docsUrl}
- Email: ${authorEmail}
- GitHub Issues: ${repoUrl}/issues

## 🎉 Getting Help

1. Check [documentation](${docsUrl})
2. Search [existing issues](${repoUrl}/issues)
3. Create a new issue with detailed information
4. Contact support team at ${authorEmail}

---

Made with ❤️ by ${authorName}

Last updated: ${new Date().toLocaleDateString()}
`;
  }

  /**
   * Generate API Documentation
   */
  static generateAPIDocumentation(config: DocConfig = {}): string {
    return `# API Documentation

## Overview

This document describes all available API endpoints for the ${config.projectName || "AI Website Generator"} application.

**Base URL**: \`http://localhost:5000/api/v1\`

**Authentication**: JWT Bearer Token in \`Authorization\` header

## Table of Contents

- [Authentication](#authentication)
- [Prompt Analysis](#prompt-analysis)
- [Code Generation](#code-generation)
- [API Generation](#api-generation)
- [Documentation](#documentation)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

### Register User

Create a new user account.

\`\`\`http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
\`\`\`

**Response** (201):
\`\`\`json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
\`\`\`

### Login

Authenticate with email and password.

\`\`\`http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
\`\`\`

### Get Current User

Retrieve authenticated user information.

\`\`\`http
GET /auth/me
Authorization: Bearer <token>
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "message": "User retrieved successfully"
}
\`\`\`

### Refresh Token

Get a new JWT token before expiration.

\`\`\`http
POST /auth/refresh
Authorization: Bearer <token>
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
\`\`\`

---

## Prompt Analysis

### Analyze Prompt

Analyze user's app idea and detect required modules.

\`\`\`http
POST /analyzer/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Create an e-commerce platform with user accounts, products, shopping cart, and payment processing"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "appType": "ecommerce",
    "confidence": 0.95,
    "modules": [
      {
        "name": "Authentication",
        "confidence": 1.0,
        "required": true
      },
      {
        "name": "Users",
        "confidence": 0.95,
        "required": true
      },
      {
        "name": "Products",
        "confidence": 0.98,
        "required": true
      },
      {
        "name": "Cart",
        "confidence": 0.92,
        "required": true
      },
      {
        "name": "Orders",
        "confidence": 0.90,
        "required": true
      },
      {
        "name": "Payments",
        "confidence": 0.88,
        "required": true
      }
    ],
    "suggestedModules": [
      "Notifications",
      "Reviews",
      "Recommendations"
    ],
    "scope": "large",
    "estimatedComplexity": "high"
  },
  "message": "Prompt analyzed successfully"
}
\`\`\`

### Quick Analysis

Fast analysis without detailed breakdown.

\`\`\`http
POST /analyzer/quick
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Blog platform"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "appType": "blog",
    "modules": ["Authentication", "Posts", "Comments", "Categories", "Users"]
  },
  "message": "Quick analysis completed"
}
\`\`\`

### Get Module Suggestions

Get suggested modules for your application.

\`\`\`http
GET /analyzer/suggest?appType=saas&scope=medium
Authorization: Bearer <token>
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "suggestions": [
      "Authentication",
      "Users",
      "Teams",
      "Projects",
      "Notifications",
      "Analytics"
    ],
    "optional": ["Search", "Reports", "Export"]
  },
  "message": "Suggestions retrieved successfully"
}
\`\`\`

---

## Code Generation

### Generate Page

Generate a React page component.

\`\`\`http
POST /codegen/page
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dashboard",
  "description": "User dashboard with stats",
  "styling": "tailwind",
  "layout": "with-sidebar",
  "components": ["Stats", "Charts", "RecentActivity"]
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "code": "import React from 'react'...",
    "language": "typescript",
    "framework": "react",
    "styling": "tailwind",
    "size": 1245,
    "imports": ["React", "useState", "useEffect"]
  },
  "message": "Page generated successfully"
}
\`\`\`

### Generate Form

Generate a form component.

\`\`\`http
POST /codegen/form
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "UserForm",
  "fields": [
    {"name": "email", "type": "email", "required": true},
    {"name": "firstName", "type": "text", "required": true},
    {"name": "role", "type": "select", "options": ["user", "admin"]}
  ],
  "styling": "tailwind"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "code": "import React, { useState } from 'react'...",
    "language": "typescript",
    "imports": 5,
    "fields": 3
  },
  "message": "Form generated successfully"
}
\`\`\`

### Generate Table

Generate a data table component.

\`\`\`http
POST /codegen/table
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "UserTable",
  "columns": [
    {"name": "email", "type": "text"},
    {"name": "role", "type": "enum"},
    {"name": "createdAt", "type": "date"}
  ],
  "features": ["pagination", "sorting", "filtering"],
  "styling": "tailwind"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "code": "import React, { useState } from 'react'...",
    "features": ["pagination", "sorting", "filtering"],
    "columns": 3
  },
  "message": "Table generated successfully"
}
\`\`\`

---

## API Generation

### Generate Model

Generate a MongoDB model/schema.

\`\`\`http
POST /apigen/model
Authorization: Bearer <token>
Content-Type: application/json

{
  "config": {
    "name": "Product",
    "pluralName": "products",
    "fields": [
      {"name": "name", "type": "string", "required": true},
      {"name": "price", "type": "number", "required": true},
      {"name": "inStock", "type": "boolean", "default": true}
    ],
    "timestamps": true
  }
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "code": "import mongoose from 'mongoose'...",
    "language": "typescript",
    "fields": 3,
    "methods": 2
  },
  "message": "Model generated successfully"
}
\`\`\`

### Generate Complete API

Generate all API files at once.

\`\`\`http
POST /apigen/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "config": {
    "name": "User",
    "pluralName": "users",
    "fields": [
      {"name": "email", "type": "email", "required": true, "unique": true},
      {"name": "password", "type": "string", "required": true},
      {"name": "role", "type": "enum", "enum": ["user", "admin"]}
    ],
    "timestamps": true,
    "softDelete": true
  },
  "options": {
    "includePagination": true,
    "includeSearch": true,
    "includeFiltering": true,
    "includeSorting": true
  }
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "model": "...",
    "service": "...",
    "controller": "...",
    "routes": "...",
    "validation": "...",
    "files": 5,
    "language": "typescript"
  },
  "message": "Complete API generated successfully"
}
\`\`\`

---

## Documentation

### Generate README

Generate project README.md file.

\`\`\`http
POST /docs/readme
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectName": "My E-Commerce App",
  "projectDescription": "An e-commerce platform with full features",
  "authorName": "John Doe"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "readme": "# My E-Commerce App\n\n> An e-commerce platform..."
  },
  "message": "README generated successfully"
}
\`\`\`

### Generate API Documentation

Generate comprehensive API documentation.

\`\`\`http
POST /docs/api
Authorization: Bearer <token>
Content-Type: application/json

{}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "apiDocs": "# API Documentation\n\n..."
  },
  "message": "API documentation generated successfully"
}
\`\`\`

### Generate Installation Guide

Generate installation and setup guide.

\`\`\`http
POST /docs/install
Authorization: Bearer <token>
Content-Type: application/json

{}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "installationGuide": "# Installation Guide\n\n..."
  },
  "message": "Installation guide generated successfully"
}
\`\`\`

### Generate Architecture Documentation

Generate detailed architecture documentation.

\`\`\`http
POST /docs/architecture
Authorization: Bearer <token>
Content-Type: application/json

{}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "architecture": "# Architecture Documentation\n\n..."
  },
  "message": "Architecture documentation generated successfully"
}
\`\`\`

### Generate Module Documentation

Generate module-wise documentation.

\`\`\`http
POST /docs/modules
Authorization: Bearer <token>
Content-Type: application/json

{
  "modules": ["Authentication", "Users", "Products"]
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "modules": {
      "Authentication": "# Authentication Module\n\n...",
      "Users": "# Users Module\n\n...",
      "Products": "# Products Module\n\n..."
    }
  },
  "message": "Module documentation generated successfully"
}
\`\`\`

### Generate Complete Documentation

Generate all documentation files.

\`\`\`http
POST /docs/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectName": "My App",
  "projectDescription": "Full-featured application",
  "authorName": "Jane Doe"
}
\`\`\`

**Response** (200):
\`\`\`json
{
  "statusCode": 200,
  "data": {
    "readme": "# My App\n\n...",
    "apiDocs": "# API Documentation\n\n...",
    "installationGuide": "# Installation Guide\n\n...",
    "architecture": "# Architecture\n\n...",
    "modules": {...},
    "files": 5
  },
  "message": "Complete documentation generated successfully"
}
\`\`\`

---

## Error Handling

### Error Response Format

\`\`\`json
{
  "statusCode": 400,
  "message": "Error description",
  "success": false
}
\`\`\`

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Missing/invalid parameters |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unexpected error |

### Error Examples

**Missing Required Field**:
\`\`\`json
{
  "statusCode": 400,
  "message": "Missing required field: email",
  "success": false
}
\`\`\`

**Invalid Token**:
\`\`\`json
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "success": false
}
\`\`\`

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication**: 5 requests per minute per IP
- **Generators**: 20 requests per minute per user
- **Analysis**: 10 requests per minute per user

Rate limit headers:

\`\`\`
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 1620000000
\`\`\`

---

## Authentication Example

\`\`\`bash
# 1. Register
curl -X POST http://localhost:5000/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'

# 2. Login
curl -X POST http://localhost:5000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"pass123"}'

# 3. Use token
curl -X GET http://localhost:5000/api/v1/auth/me \\
  -H "Authorization: Bearer <token>"
\`\`\`

---

**Last updated**: ${new Date().toLocaleDateString()}
`;
  }

  /**
   * Generate Installation Guide
   */
  static generateInstallationGuide(config: DocConfig = {}): string {
    return `# Installation Guide

Complete guide to install and set up ${config.projectName || "AI Website Generator"}.

## Prerequisites

Before installation, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **MongoDB** 7.5 or higher (local or cloud)
- **Git** for version control
- A text editor (VS Code recommended)

### Verify Installation

\`\`\`bash
node --version    # v18.x.x
npm --version     # 9.x.x
mongod --version  # v7.5.x or higher
git --version     # 2.x.x
\`\`\`

## Step 1: Clone Repository

\`\`\`bash
git clone ${config.repoUrl || "https://github.com/yourusername/ai-website-generator"}.git
cd ai-website-generator
\`\`\`

## Step 2: Install Dependencies

### Backend Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### Frontend Dependencies

\`\`\`bash
# From root directory
npm install
\`\`\`

## Step 3: Set Up Environment Variables

### Backend Environment File

Create \`.env\` in the \`backend\` directory:

\`\`\`env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-website-gen
MONGODB_TEST_URI=mongodb://localhost:27017/ai-website-gen-test

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Server Configuration
API_PORT=5000
API_HOST=localhost
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
\`\`\`

### Frontend Environment File

Create \`.env.local\` in root directory:

\`\`\`env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_BASE_PATH=/api/v1

# App Configuration
VITE_APP_NAME=AI Website Generator
VITE_APP_VERSION=1.0.0
\`\`\`

## Step 4: Start MongoDB

### Option A: Local MongoDB

\`\`\`bash
# macOS with Homebrew
brew services start mongodb-community

# Windows with MongoDB Community Edition
mongod

# Linux
sudo systemctl start mongod
\`\`\`

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Update \`MONGODB_URI\` in \`.env\`

\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-website-gen
\`\`\`

## Step 5: Start Development Servers

### Option A: Run Both Servers

\`\`\`bash
# From root directory
npm run dev:all
\`\`\`

This will start:
- Backend: \`http://localhost:5000\`
- Frontend: \`http://localhost:5173\`

### Option B: Run Separately

**Terminal 1: Backend**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Terminal 2: Frontend**
\`\`\`bash
npm run dev
\`\`\`

## Step 6: Access Application

Open your browser and navigate to:

\`\`\`
http://localhost:5173
\`\`\`

You should see the login page.

## Step 7: Create First Account

1. Click "Register"
2. Enter email, password, and name
3. Click "Sign Up"
4. Log in with your credentials

## Troubleshooting

### MongoDB Connection Error

**Error**: \`connect ECONNREFUSED\`

**Solution**:
\`\`\`bash
# Check if MongoDB is running
mongosh

# Start MongoDB if not running
mongod
\`\`\`

### Port Already in Use

**Error**: \`listen EADDRINUSE :::5000\`

**Solution**:
\`\`\`bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
\`\`\`

### Dependencies Installation Issues

**Error**: \`npm ERR! code ERESOLVE\`

**Solution**:
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### TypeScript Compilation Error

**Error**: \`TS2688: Cannot find type definition\`

**Solution**:
\`\`\`bash
# Install missing types
npm install --save-dev @types/node

# Rebuild
npm run build
\`\`\`

## Post-Installation Setup

### 1. Initialize Database

\`\`\`bash
cd backend
npm run seed  # Optional: seed with sample data
\`\`\`

### 2. Verify Installation

\`\`\`bash
# Backend health check
curl http://localhost:5000/health

# Frontend loads
curl http://localhost:5173
\`\`\`

### 3. Test API Connection

\`\`\`bash
# Register test user
curl -X POST http://localhost:5000/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email":"test@example.com",
    "password":"Test123!",
    "name":"Test User"
  }'
\`\`\`

## Production Deployment

### Build for Production

\`\`\`bash
# Backend
cd backend
npm run build

# Frontend
npm run build
\`\`\`

### Environment Setup

Create \`.env.production\` in backend:

\`\`\`env
NODE_ENV=production
API_PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://yourdomain.com
\`\`\`

### Deploy Options

#### Option 1: Heroku

\`\`\`bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git push heroku main
\`\`\`

#### Option 2: Docker

Create \`Dockerfile\` in root:

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN cd backend && npm run build
RUN npm run build

EXPOSE 5000 5173

CMD ["npm", "start"]
\`\`\`

Build and run:

\`\`\`bash
docker build -t ai-website-gen .
docker run -p 5000:5000 -p 5173:5173 ai-website-gen
\`\`\`

#### Option 3: AWS / DigitalOcean

See cloud-specific deployment guides in documentation.

## System Requirements

| Component | Requirement |
|-----------|-------------|
| Node.js | 18.0.0+ |
| npm | 9.0.0+ |
| MongoDB | 7.5+ |
| RAM | 4GB minimum |
| Disk Space | 2GB minimum |
| OS | Windows/macOS/Linux |

## Development Tools Setup

### VS Code Extensions

Recommended extensions for development:

1. **ES7+ React/Redux/React-Native snippets**
2. **TypeScript Vue Plugin**
3. **Prettier - Code formatter**
4. **ESLint**
5. **MongoDB for VS Code**
6. **Thunder Client** (API testing)
7. **REST Client**

### Git Configuration

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
\`\`\`

## Next Steps

1. ✅ Installation complete
2. 📖 Read [Architecture Guide](./ARCHITECTURE.md)
3. 🚀 Try the [Quick Start Guide](./QUICK_START.md)
4. 📚 Check [API Documentation](./API_DOCS.md)
5. 🤝 See [Contributing Guide](./CONTRIBUTING.md)

## Support

- 📖 [Documentation](${config.docsUrl || "https://docs.example.com"})
- 🐛 [Issue Tracker](${config.repoUrl || "https://github.com/example"}/issues)
- 💬 [Discussions](${config.repoUrl || "https://github.com/example"}/discussions)
- 📧 Email: ${config.authorEmail || "support@example.com"}

---

**Last updated**: ${new Date().toLocaleDateString()}
`;
  }

  /**
   * Generate Architecture Documentation
   */
  static generateArchitectureDocumentation(config: DocConfig = {}): string {
    return `# Architecture Documentation

Comprehensive overview of ${config.projectName || "AI Website Generator"} system architecture.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Security Architecture](#security-architecture)
- [Scalability](#scalability)

---

## System Overview

The application is a full-stack web platform that combines AI analysis with intelligent code generation.

### Key Components

1. **React Frontend** - User interface for code generation
2. **Express Backend** - API server with business logic
3. **MongoDB Database** - Data persistence layer
4. **Redis Cache** (optional) - Performance optimization
5. **AI Services** - Prompt analysis and generation

### Architecture Type

- **Microservices**: Services separated by concern
- **RESTful API**: Standard HTTP-based API design
- **Layered Architecture**: Separation of concerns
- **MVC Pattern**: Model-View-Controller on backend
- **Flux Pattern**: State management on frontend

---

## Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           React Application (Vite)                       │   │
│  │  ┌─────────────┐  ┌────────────┐  ┌───────────────────┐ │   │
│  │  │   Pages     │  │ Components │  │   State (Redux)   │ │   │
│  │  └─────────────┘  └────────────┘  └───────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  Hooks (useAuth, useCodeGen, useBackendGen, etc.)  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  API Client (Axios + Interceptors)                 │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↕ (HTTP/HTTPS)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js Backend Server                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Express.js Router                          │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────────┐    │   │
│  │  │Auth    │  │Analyzer│  │CodeGen │  │APIGen/Docs │    │   │
│  │  │Routes  │  │Routes  │  │Routes  │  │Routes      │    │   │
│  │  └────────┘  └────────┘  └────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Controllers Layer                          │   │
│  │  Handlers for: Auth, Analyzer, CodeGen, APIGen, Docs   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Services Layer (Business Logic)            │   │
│  │  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐  │   │
│  │  │AuthServ. │  │PromptAnaly.│  │ReactCodeGenerator  │  │   │
│  │  ├──────────┤  ├────────────┤  ├─────────────────────┤  │   │
│  │  │BackendAPI│  │DocGenerator│  │  ...more services  │  │   │
│  │  │Generator │  │            │  │                    │  │   │
│  │  └──────────┘  └────────────┘  └─────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Middleware Stack                           │   │
│  │  Auth, Validation, Error Handling, CORS, Logging       │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Data Access Layer (DAL)                    │   │
│  │  Mongoose Models & Database Queries                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↕ (TCP/IP)                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              MongoDB Database                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Users    │  │ Projects │  │GenFiles  │  │PromptHistory│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│  Indexes, Validation, TTL Indexes                              │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## Backend Architecture

### Service Layer Pattern

\`\`\`
Request → Controller → Service → Model → Database
  ↑                                           ↓
  └───────────────── Response ───────────────┘
\`\`\`

### Service Structure

#### Authentication Service
- User registration and validation
- Password hashing with bcrypt
- JWT token generation and verification
- Role-based access control

#### Prompt Analyzer Service
- App type detection (16+ types)
- Module pattern recognition (19+ patterns)
- Confidence scoring algorithm
- Complexity estimation

#### React Code Generator Service
- Page component generation
- Form component creation
- Table component scaffolding
- Layout templates
- Routing configuration
- Support for Tailwind CSS and Material-UI

#### Backend API Generator Service
- MongoDB model generation
- Express service layer scaffolding
- Controller endpoint creation
- Joi validation schema generation
- RESTful routing configuration
- CRUD operation templates
- Pagination, search, filtering, sorting support

#### Documentation Generator Service
- README generation
- API documentation creation
- Installation guide generation
- Architecture documentation
- Module-wise documentation

### Middleware Stack

\`\`\`
Request
   ↓
CORS Middleware
   ↓
JSON Parser
   ↓
Authentication Middleware (verify JWT)
   ↓
Request Validation
   ↓
Route Handler
   ↓
Error Handler
   ↓
Response
\`\`\`

### Error Handling Strategy

\`\`\`
try {
  // Business logic
} catch (error) {
  // Catch business errors
  throw new ApiError(statusCode, message)
}

// Global error middleware catches all errors
// Returns consistent API response format
\`\`\`

---

## Frontend Architecture

### Component Hierarchy

\`\`\`
App.tsx
├── Router
│   ├── PublicRoutes
│   │   ├── Home
│   │   ├── Login
│   │   └── Register
│   │
│   └── ProtectedRoutes (requires auth)
│       ├── Analyzer Page
│       ├── CodeGenerator Page
│       ├── BackendGenerator Page
│       └── DocumentationGenerator Page
│
└── Redux Store
    ├── User Slice (auth state)
    └── UI Slice (UI state)
\`\`\`

### State Management (Redux)

\`\`\`
Store
├── auth
│   ├── user
│   ├── token
│   ├── isAuthenticated
│   └── loading
│
└── ui
    ├── notifications
    ├── modals
    └── sidebar
\`\`\`

### Custom Hooks Pattern

\`\`\`
useAuth()
├── login()
├── register()
├── logout()
└── getCurrentUser()

useCodeGenerator()
├── generatePage()
├── generateForm()
├── generateTable()
└── copyToClipboard()

useBackendGenerator()
├── generateModel()
├── generateService()
├── generateController()
└── generateCompleteAPI()

useDocumentationGenerator()
├── generateREADME()
├── generateAPIDoc()
├── generateArchitecture()
└── generateModuleDocs()
\`\`\`

### API Client Architecture

\`\`\`
Axios Instance
├── Request Interceptor
│   ├── Add Authorization header (JWT token)
│   └── Add Content-Type header
│
└── Response Interceptor
    ├── Handle successful responses
    ├── Handle 401 (unauthorized) errors
    └── Redirect to login if needed
\`\`\`

---

## Data Flow

### Authentication Flow

\`\`\`
User Registration
   ↓
Frontend Form Input
   ↓
Validate Input (client-side)
   ↓
POST /api/v1/auth/register
   ↓
Backend Validation (Joi)
   ↓
Hash Password (bcrypt)
   ↓
Create User in MongoDB
   ↓
Generate JWT Token
   ↓
Return token + user data
   ↓
Frontend: Store token in localStorage
   ↓
Store auth state in Redux
   ↓
Redirect to dashboard
\`\`\`

### Code Generation Flow

\`\`\`
User Inputs Configuration
   ↓
Frontend Form Submission
   ↓
Call Generator API
   ↓
Backend Receives Request
   ↓
Validate Configuration
   ↓
Call Generator Service
   ↓
Generate Code (templates + logic)
   ↓
Return Generated Code
   ↓
Frontend: Display Code
   ↓
User Actions
   ├── Copy to clipboard
   ├── Download file
   └── Create new resource
\`\`\`

### Complete API Generation Flow

\`\`\`
User Configuration
├── Resource name (e.g., "Product")
├── Fields (name, type, constraints)
└── Options (pagination, search, etc.)
   ↓
POST /api/v1/apigen/complete
   ↓
Backend Processing
├── Generate Model (Mongoose schema)
├── Generate Service (CRUD + features)
├── Generate Controller (Route handlers)
├── Generate Routes (Express router)
└── Generate Validation (Joi schemas)
   ↓
Return All Generated Code
   ↓
Frontend Display
├── Code preview
├── File downloads
└── Copy individual files
\`\`\`

---

## Database Schema

### User Collection

\`\`\`typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (hashed),
  name: string,
  role: 'user' | 'admin' (default: 'user'),
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Project Collection

\`\`\`typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string,
  description: string,
  appType: string,
  modules: string[],
  status: 'draft' | 'completed' | 'published',
  version: number,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### GeneratedFile Collection

\`\`\`typescript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Project),
  userId: ObjectId (ref: User),
  fileName: string,
  fileType: 'component' | 'api' | 'model' | 'doc',
  content: string,
  language: 'typescript' | 'javascript',
  createdAt: Date (TTL: 30 days auto-delete),
  updatedAt: Date
}
\`\`\`

### PromptHistory Collection

\`\`\`typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  prompt: string,
  result: object,
  modules: string[],
  feedback: string,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

---

## API Design

### RESTful Principles

- **Resource-based URLs** - /api/v1/users, /api/v1/products
- **HTTP Methods** - GET (read), POST (create), PATCH (update), DELETE (delete)
- **Status Codes** - 200 (OK), 201 (created), 400 (bad request), 401 (auth), 500 (error)
- **Consistent Response Format** - All responses have statusCode, data, message

### Versioning

- Current version: v1
- API endpoints prefixed with /api/v1
- Future versions can be added without breaking existing clients

### Response Format

\`\`\`typescript
{
  statusCode: number,
  data: T,
  message: string,
  success: boolean
}
\`\`\`

### Pagination Pattern

\`\`\`typescript
GET /api/v1/users?page=1&pageSize=10&sort=-createdAt

Response:
{
  statusCode: 200,
  data: {
    data: [...],        // Array of resources
    total: 150,         // Total count
    page: 1,            // Current page
    pages: 15,          // Total pages
    pageSize: 10        // Items per page
  }
}
\`\`\`

---

## Security Architecture

### Authentication & Authorization

\`\`\`
┌─────────────────────────────────────────┐
│      Authentication & Authorization     │
├─────────────────────────────────────────┤
│                                         │
│  1. User Registration                  │
│     ├── Email validation                │
│     ├── Password strength check         │
│     └── Hash with bcrypt (10 rounds)   │
│                                         │
│  2. User Login                         │
│     ├── Verify credentials              │
│     ├── Compare password hash           │
│     └── Generate JWT token              │
│                                         │
│  3. JWT Token                          │
│     ├── Algorithm: HS256                │
│     ├── Expiration: 7 days             │
│     ├── Payload: {id, email, role}    │
│     └── Refresh token: 30 days        │
│                                         │
│  4. Authorization                      │
│     ├── Extract token from header       │
│     ├── Verify signature                │
│     ├── Check expiration                │
│     ├── Extract user info               │
│     └── Check role permissions          │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

### Middleware Chain

\`\`\`
Public Routes:
  ↓
CORS → Parser → Error Handler → Response

Protected Routes:
  ↓
CORS → Parser → Auth Middleware → Validator → Handler → Error → Response
\`\`\`

### Data Protection

- **Passwords**: Hashed with bcrypt (10 salt rounds)
- **Tokens**: JWT signed with secret key
- **HTTPS**: Required in production
- **CORS**: Limited to trusted origins
- **Input Validation**: Joi schemas on all inputs
- **SQL Injection**: MongoDB (not vulnerable)

---

## Scalability

### Horizontal Scaling

\`\`\`
Load Balancer
    ↓
┌───┴───┬───────┬───────┐
│       │       │       │
API-1  API-2  API-3  API-N
    ↓
Shared MongoDB (with replication)
    ↓
Redis Cache (optional)
\`\`\`

### Database Optimization

- Indexing on frequently queried fields
- Lean queries for read-only operations
- Connection pooling
- Pagination to limit result sets
- TTL indexes for auto-cleanup

### Caching Strategy

- Frontend: localStorage for tokens
- Backend: Redis (optional) for session cache
- Browser cache for static assets
- API response caching headers

### Performance Tips

1. Use pagination for large result sets
2. Add database indexes on foreign keys
3. Implement Redis caching for frequently accessed data
4. Use lazy loading for components
5. Compress API responses
6. Enable gzip compression

---

## Technology Choices

### Why React?
- Component-based architecture
- Large ecosystem
- Developer experience
- Virtual DOM for performance

### Why Express.js?
- Lightweight and flexible
- Rich middleware ecosystem
- Easy to learn and use
- Large community support

### Why MongoDB?
- Flexible schema for rapid development
- JSON-like documents
- Horizontal scaling with sharding
- Good for unstructured data

### Why JWT?
- Stateless authentication
- No server-side session storage
- Cross-origin requests compatible
- Mobile and SPA friendly

### Why TypeScript?
- Type safety prevents errors
- Better IDE support
- Self-documenting code
- Catches bugs at compile time

---

## Future Enhancements

1. **GraphQL Support** - Add GraphQL API layer
2. **Real-time Features** - WebSocket support for live updates
3. **Caching Layer** - Redis integration for performance
4. **Message Queue** - Background job processing
5. **File Storage** - S3 integration for file uploads
6. **Email Service** - Nodemailer for notifications
7. **Monitoring** - Application performance monitoring
8. **Logging** - Centralized logging system
9. **Load Balancing** - Horizontal scaling support
10. **Microservices** - Break into separate services

---

**Last updated**: ${new Date().toLocaleDateString()}
`;
  }

  /**
   * Generate module-wise documentation
   */
  static generateModuleDocumentation(moduleNames: string[] = []): Record<string, string> {
    const modules: Record<string, string> = {};

    const moduleTemplates: Record<string, string> = {
      Authentication: `# Authentication Module

## Overview
User authentication and authorization system using JWT tokens and bcrypt password hashing.

## Features
- User registration with email validation
- Secure password hashing (bcrypt, 10 salt rounds)
- JWT token generation and verification
- Token refresh mechanism
- Role-based access control (User, Admin)
- Automatic token expiration (7 days)

## API Endpoints
- \`POST /api/v1/auth/register\` - Register new user
- \`POST /api/v1/auth/login\` - Login with credentials
- \`GET /api/v1/auth/me\` - Get current user
- \`POST /api/v1/auth/refresh\` - Refresh JWT token
- \`POST /api/v1/auth/logout\` - Logout (client-side)

## Architecture
\`\`\`
Frontend (React)
  ├── LoginForm.tsx
  ├── RegisterForm.tsx
  └── ProtectedRoute.tsx
         ↓
API Client (Axios)
  ├── Request Interceptor (add token)
  └── Response Interceptor (handle 401)
         ↓
Backend Express Routes
  └── /api/v1/auth/*
         ↓
AuthController
  ├── register()
  ├── login()
  ├── getCurrentUser()
  └── refreshToken()
         ↓
AuthService
  ├── register()
  ├── login()
  └── generateToken()
         ↓
User Model
  ├── Email (unique)
  ├── Password (hashed)
  └── Role
\`\`\`

## Database Schema
\`\`\`typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  password: string (hashed),
  name: string,
  role: 'user' | 'admin',
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Security Measures
- Passwords hashed with bcrypt (10 rounds)
- JWT signed with secret key
- Token expiration: 7 days
- CORS enabled for trusted origins
- Input validation with Joi
- HTTPS recommended in production

## Usage Example
\`\`\`bash
# Register
POST /api/v1/auth/register
{"email":"user@example.com","password":"pass123","name":"John"}

# Login
POST /api/v1/auth/login
{"email":"user@example.com","password":"pass123"}

# Get current user
GET /api/v1/auth/me
Authorization: Bearer <token>
\`\`\`
`,

      Users: `# Users Module

## Overview
User management system with profile management and role-based access.

## Features
- Create user profiles
- Update user information
- List all users with pagination
- Search users by email or name
- Role management
- Soft delete support

## API Endpoints
- \`GET /api/v1/users\` - List users with pagination
- \`POST /api/v1/users\` - Create new user
- \`GET /api/v1/users/:id\` - Get user by ID
- \`PATCH /api/v1/users/:id\` - Update user
- \`DELETE /api/v1/users/:id\` - Delete user

## Database Schema
\`\`\`typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  firstName: string,
  lastName: string,
  role: 'user' | 'admin',
  isActive: boolean,
  profile: {
    avatar: string,
    bio: string,
    phone: string
  },
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Query Parameters
- \`page\` - Page number (default: 1)
- \`pageSize\` - Items per page (default: 10)
- \`sort\` - Sort field (prefix with - for desc)
- \`search\` - Search by email or name
- \`role\` - Filter by role
`,

      Products: `# Products Module

## Overview
Product catalog management with inventory tracking and categorization.

## Features
- Create and manage products
- Product categorization
- Inventory management
- Price management
- Search and filter products
- Pagination support

## API Endpoints
- \`GET /api/v1/products\` - List products
- \`POST /api/v1/products\` - Create product
- \`GET /api/v1/products/:id\` - Get product details
- \`PATCH /api/v1/products/:id\` - Update product
- \`DELETE /api/v1/products/:id\` - Delete product
- \`GET /api/v1/products/search\` - Search products

## Database Schema
\`\`\`typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  category: string,
  inventory: number,
  sku: string (unique),
  images: string[],
  ratings: number,
  reviews: number,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Features
- Full-text search across name and description
- Filter by category and price range
- Sort by name, price, or ratings
- Pagination with customizable page size
- Inventory tracking
`,

      Orders: `# Orders Module

## Overview
Order management system for e-commerce transactions.

## Features
- Create orders from cart items
- Order status tracking
- Order history
- Order cancellation
- Shipping address management
- Order totals calculation

## API Endpoints
- \`GET /api/v1/orders\` - List user orders
- \`POST /api/v1/orders\` - Create new order
- \`GET /api/v1/orders/:id\` - Get order details
- \`PATCH /api/v1/orders/:id\` - Update order status
- \`DELETE /api/v1/orders/:id\` - Cancel order

## Database Schema
\`\`\`typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    quantity: number,
    price: number
  }],
  totalAmount: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  shippingAddress: {
    street: string,
    city: string,
    postalCode: string,
    country: string
  },
  createdAt: Date,
  updatedAt: Date
}
\`\`\`
`,

      Payments: `# Payments Module

## Overview
Payment processing and transaction management.

## Features
- Process payment transactions
- Support multiple payment methods
- Payment status tracking
- Refund handling
- Transaction history
- Payment verification

## API Endpoints
- \`POST /api/v1/payments\` - Create payment
- \`GET /api/v1/payments/:id\` - Get payment details
- \`POST /api/v1/payments/:id/refund\` - Refund payment
- \`GET /api/v1/payments/user/:userId\` - Get user payments

## Database Schema
\`\`\`typescript
{
  _id: ObjectId,
  orderId: ObjectId (ref: Order),
  userId: ObjectId (ref: User),
  amount: number,
  method: 'credit_card' | 'debit_card' | 'paypal',
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  transactionId: string,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Payment Methods Supported
- Credit Card
- Debit Card
- PayPal
- Bank Transfer (future)
`,
    };

    // Generate docs for specified modules or all if none specified
    const modulesToGenerate = moduleNames.length > 0 ? moduleNames : Object.keys(moduleTemplates);

    for (const moduleName of modulesToGenerate) {
      if (moduleTemplates[moduleName]) {
        modules[moduleName] = moduleTemplates[moduleName];
      } else {
        // Generate generic module doc if not in templates
        modules[moduleName] = `# ${moduleName} Module

## Overview
${moduleName} module for the AI Website Generator application.

## Features
- Core functionality for ${moduleName}
- CRUD operations
- Search and filtering
- Pagination support
- Validation and error handling

## API Endpoints
- \`GET /api/v1/${moduleName.toLowerCase()}\` - List items
- \`POST /api/v1/${moduleName.toLowerCase()}\` - Create item
- \`GET /api/v1/${moduleName.toLowerCase()}/:id\` - Get item
- \`PATCH /api/v1/${moduleName.toLowerCase()}/:id\` - Update item
- \`DELETE /api/v1/${moduleName.toLowerCase()}/:id\` - Delete item

## Database Schema
\`\`\`typescript
{
  _id: ObjectId,
  // Add your fields here
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Usage Examples
\`\`\`bash
# List items
GET /api/v1/${moduleName.toLowerCase()}?page=1&pageSize=10

# Create item
POST /api/v1/${moduleName.toLowerCase()}
Content-Type: application/json

{
  "name": "Example"
}

# Get item
GET /api/v1/${moduleName.toLowerCase()}/507f1f77bcf86cd799439011
\`\`\`
`;
      }
    }

    return modules;
  }

  /**
   * Generate complete documentation package
   */
  static generateCompleteDocumentation(config: DocConfig = {}): GeneratedDocs {
    return {
      readme: this.generateREADME(config),
      apiDocs: this.generateAPIDocumentation(config),
      installationGuide: this.generateInstallationGuide(config),
      architecture: this.generateArchitectureDocumentation(config),
      modules: this.generateModuleDocumentation(config.includeModules ? undefined : []),
    };
  }
}

export default DocumentationGenerator;
