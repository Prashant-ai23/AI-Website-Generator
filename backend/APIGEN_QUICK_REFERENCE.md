# Backend API Generation Module - Quick Reference

## Overview
Complete backend API generator for Express.js with MongoDB, supporting full CRUD operations with pagination, search, filtering, sorting, and validation.

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   └── backendAPIGenerator.ts (1000+ lines)
│   │       - BackendAPIGenerator class
│   │       - 6 generation methods
│   │       - Mongoose model generation
│   │       - Service with CRUD & search
│   │       - Controller with handlers
│   │       - Express routes
│   │       - Joi validation schemas
│   │
│   ├── controllers/
│   │   └── apiGeneratorController.ts
│   │       - 6 async endpoints
│   │       - Input validation
│   │       - ApiResponse wrappers
│   │
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── apigen.ts (6 routes)
│   │   │   └── index.ts (updated)
│   │
│   └── middleware/
│       └── auth.ts (uses authenticate)
│
frontend/
├── src/
│   ├── hooks/
│   │   └── useBackendGenerator.ts
│   │       - State management
│   │       - 6 generation methods
│   │       - Utilities
│   │
│   ├── types/
│   │   └── backendGenerator.ts
│   │       - All TypeScript interfaces
│   │
│   ├── components/
│   │   └── BackendGenerator.tsx (500+ lines)
│   │       - Tab interface
│   │       - Field configuration
│   │       - Code output
│   │       - Export options
│   │
│   ├── pages/
│   │   └── BackendGenerator.tsx (wrapper)
│   │
│   └── routes/
│       └── routes.tsx (updated with /apigen)
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/apigen/model` | POST | Generate MongoDB model |
| `/api/v1/apigen/service` | POST | Generate service layer |
| `/api/v1/apigen/controller` | POST | Generate controller |
| `/api/v1/apigen/routes` | POST | Generate Express routes |
| `/api/v1/apigen/validation` | POST | Generate Joi validation |
| `/api/v1/apigen/complete` | POST | Generate all 5 files |

## Frontend Routes

| Route | Type | Auth Required | Purpose |
|-------|------|---------------|---------|
| `/apigen` | Protected | Yes | Backend API generator UI |

## Configuration Structure

### APIResourceConfig
```typescript
{
  name: string;              // 'User', 'Product', etc.
  pluralName: string;        // 'users', 'products', etc.
  fields: APIField[];        // Array of field definitions
  timestamps?: boolean;      // Add createdAt/updatedAt
  softDelete?: boolean;      // Add soft delete support
  validation?: string;       // 'joi' | 'zod'
  database?: string;         // 'mongodb'
  description?: string;      // Optional description
}
```

### APIField
```typescript
{
  name: string;              // Field name
  type: string;              // Field type (see below)
  required?: boolean;        // Is required
  unique?: boolean;          // Is unique
  indexed?: boolean;         // Create index
  minLength?: number;        // Min length
  maxLength?: number;        // Max length
  pattern?: string;          // Regex pattern
  enum?: string[];           // Enum values
  reference?: string;        // Foreign key
  description?: string;      // Field description
  default?: any;             // Default value
}
```

### Field Types
```
string      - Text field with length constraints
number      - Numeric field
boolean     - Boolean field
date        - Date field
email       - Email field with validation
enum        - Enumerated field with values
reference   - Foreign key/ObjectId
```

### APIGenerationOptions
```typescript
{
  includePagination?: boolean;   // Enable pagination
  includeSearch?: boolean;       // Enable search
  includeFiltering?: boolean;    // Enable filtering
  includeValidation?: boolean;   // Include validation
  includeSorting?: boolean;      // Enable sorting
  routes?: string[];             // Routes to generate
}
```

## Generated Endpoints Pattern

For resource "User" (pluralName: "users"):

```
GET    /api/v1/users                  - List (with pagination/search/filter)
POST   /api/v1/users                  - Create
POST   /api/v1/users/bulk             - Bulk create
GET    /api/v1/users/search?q=query   - Search
GET    /api/v1/users/:id              - Get by ID
PATCH  /api/v1/users/:id              - Update
DELETE /api/v1/users/:id              - Delete
```

## Features Generated

### Model (Mongoose)
- ✅ Schema definition with types
- ✅ Field validation rules
- ✅ Unique constraints
- ✅ Database indexes
- ✅ Timestamps support
- ✅ Soft delete support
- ✅ Instance methods
- ✅ Query helpers

### Service
- ✅ Create operation
- ✅ Read by ID
- ✅ List with pagination
- ✅ Update operation
- ✅ Delete operation
- ✅ Search across string fields
- ✅ Bulk create/update/delete
- ✅ Filter support
- ✅ Sort support
- ✅ Lean queries for performance

### Controller
- ✅ Route handler for all CRUD
- ✅ Error handling
- ✅ Request validation
- ✅ Response formatting
- ✅ Search endpoint
- ✅ Bulk operations
- ✅ Consistent error responses

### Routes
- ✅ RESTful endpoints
- ✅ Authentication middleware
- ✅ Validation middleware
- ✅ Configurable methods
- ✅ Search route
- ✅ Bulk operation routes

### Validation (Joi)
- ✅ Create schema
- ✅ Update schema
- ✅ Field type validation
- ✅ Length constraints
- ✅ Pattern validation
- ✅ Enum validation
- ✅ Email validation
- ✅ ObjectId validation

## Supported Constraints

### String Fields
- `required`: Mark as required
- `minLength`: Minimum length
- `maxLength`: Maximum length
- `pattern`: Regex validation
- `enum`: String enum values
- `unique`: Unique constraint

### Numeric Fields
- `required`: Mark as required
- `default`: Default value

### Boolean Fields
- `required`: Mark as required
- `default`: Default value (true/false)

### Date Fields
- `required`: Mark as required
- `default`: Default value

### Email Fields
- `required`: Mark as required
- `unique`: Unique constraint (usually)

### Enum Fields
- `required`: Mark as required
- `enum`: Array of valid values
- `default`: Default value

### Reference Fields
- `required`: Mark as required
- `reference`: Entity being referenced
- `indexed`: Index for foreign key

## Query Parameters

### List Endpoint
```
GET /api/v1/users?page=1&pageSize=10&sort=-createdAt&search=john&filter[role]=admin
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (default: 10) |
| `sort` | string | Sort field, prefix with `-` for desc |
| `search` | string | Full-text search query |
| `filter[field]` | any | Filter by field value |

## Response Format

### Success Response
```typescript
{
  "statusCode": 200,
  "data": {
    // Resource or array of resources
  },
  "message": "Operation successful",
  "success": true
}
```

### List Response
```typescript
{
  "statusCode": 200,
  "data": {
    "data": [...],           // Array of resources
    "total": 150,            // Total count
    "page": 1,               // Current page
    "pages": 15,             // Total pages
    "pageSize": 10           // Items per page
  },
  "message": "Users retrieved successfully"
}
```

### Error Response
```typescript
{
  "statusCode": 400,
  "message": "Error description",
  "success": false
}
```

## Example Usage

### 1. Generate Complete User API

**Request:**
```bash
POST /api/v1/apigen/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "config": {
    "name": "User",
    "pluralName": "users",
    "fields": [
      { "name": "email", "type": "email", "required": true, "unique": true },
      { "name": "password", "type": "string", "required": true, "minLength": 6 },
      { "name": "firstName", "type": "string", "required": true },
      { "name": "role", "type": "enum", "enum": ["user", "admin"], "default": "user" },
      { "name": "isActive", "type": "boolean", "default": true }
    ],
    "timestamps": true
  },
  "options": {
    "includePagination": true,
    "includeSearch": true,
    "includeFiltering": true,
    "includeValidation": true,
    "includeSorting": true,
    "routes": ["create", "read", "update", "delete", "list"]
  }
}
```

**Response:**
```typescript
{
  "statusCode": 200,
  "data": {
    "model": "...",        // Full model code
    "service": "...",      // Full service code
    "controller": "...",   // Full controller code
    "routes": "...",       // Full routes code
    "validation": "...",   // Full validation code
    "language": "typescript",
    "framework": "mongoose",
    "files": 5
  },
  "message": "Complete API generated successfully"
}
```

### 2. List Users with Search

**Request:**
```bash
GET /api/v1/users?page=1&pageSize=20&sort=-createdAt&search=john
Authorization: Bearer <token>
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "data": [
      {
        "_id": "...",
        "email": "john@example.com",
        "firstName": "John",
        "role": "user",
        "isActive": true,
        "createdAt": "2026-05-07T...",
        "updatedAt": "2026-05-07T..."
      }
    ],
    "total": 1,
    "page": 1,
    "pages": 1,
    "pageSize": 20
  }
}
```

### 3. Create User

**Request:**
```bash
POST /api/v1/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "secure123",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

## Integration Steps

1. **Generate Model**: Create MongoDB schema
2. **Generate Service**: Implement CRUD logic
3. **Generate Controller**: Create request handlers
4. **Generate Routes**: Set up Express routes
5. **Generate Validation**: Add request validation
6. **Update Main Router**: Import and register routes
7. **Test All Endpoints**: Verify functionality
8. **Add Business Logic**: Customize as needed

## Frontend UI Features

- **Tab-Based Generator**: Choose what to generate
- **Field Configuration**: Add/edit fields dynamically
- **Feature Toggles**: Enable/disable features
- **Live Code Preview**: See generated code
- **Copy to Clipboard**: Quick code copying
- **Download Files**: Export individual files
- **Export Complete API**: Download all files as JSON

## TypeScript Support

- ✅ Full TypeScript generation
- ✅ Type-safe interfaces
- ✅ Generic types for services
- ✅ Proper error typing
- ✅ Request/response types

## Best Practices

1. **Plan Resources First**: Define fields before generating
2. **Use Meaningful Names**: Clear singular/plural names
3. **Enable Only Needed Features**: Reduce bloat
4. **Review Generated Code**: Understand the output
5. **Add Business Logic**: Generate is scaffolding
6. **Test Thoroughly**: Verify all operations
7. **Document API**: Add OpenAPI/Swagger docs

## Performance Considerations

- Lean queries for read operations
- Indexing on frequently searched/filtered fields
- Pagination to limit result set
- Bulk operations for large datasets
- Connection pooling (configured separately)

## Security

- ✅ Authentication required on all endpoints
- ✅ Input validation on all requests
- ✅ SQL injection prevention (MongoDB)
- ✅ Rate limiting (configure separately)
- ✅ CORS handling (configure separately)

## Limitations

- MongoDB only (currently)
- Basic relationships (needs extension)
- No complex business logic (add manually)
- No real-time support (add with WebSockets)
- No file uploads (add custom handlers)
- No multi-tenancy (add separate)

## Future Enhancements

- [ ] PostgreSQL support
- [ ] GraphQL generation
- [ ] Advanced relationships (1:N, N:N)
- [ ] Seeding/fixtures
- [ ] API documentation auto-generation
- [ ] Integration tests generation
- [ ] OpenAPI/Swagger specs
- [ ] Rate limiting templates
- [ ] Caching strategies

---

**Last Updated**: May 7, 2026
**Version**: 1.0.0
**Author**: AI Website Generator Team
