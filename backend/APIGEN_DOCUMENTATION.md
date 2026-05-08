# Backend API Generator - Documentation

## Overview

The Backend API Generator is a powerful code generation tool that automatically creates complete Express.js APIs with MongoDB models, services, controllers, routes, and validation schemas. It enables developers to scaffold full CRUD APIs in seconds.

## Features

### 1. MongoDB Model Generation
Generate Mongoose schemas with:
- Field type support (string, number, boolean, date, email, enum, reference)
- Validation rules (required, unique, indexed)
- Timestamps and soft delete support
- Custom field constraints (minLength, maxLength, pattern)
- Enum field support
- Field relationships and references

### 2. Service Layer Generation
Create business logic services with:
- **CRUD Operations**: Create, read, update, delete
- **Pagination**: Configurable page size and page number
- **Search**: Full-text search across string fields
- **Filtering**: Dynamic filtering by field values
- **Sorting**: Ascending/descending sort on any field
- **Bulk Operations**: Bulk create, update, and delete
- **Soft Delete**: Optional soft delete support
- **Query Optimization**: Lean queries for read operations

### 3. Controller Generation
Generate Express controllers with:
- Route handlers for all CRUD operations
- Error handling and validation
- Request/response handling
- Search endpoint support
- Bulk operation endpoints
- Consistent API response format

### 4. Route Generation
Create Express routes with:
- RESTful endpoint patterns
- Authentication middleware
- Validation middleware integration
- Configurable route methods (GET, POST, PATCH, DELETE)
- Search route support
- Bulk operation routes

### 5. Validation Schema Generation
Generate Joi validation schemas with:
- Field-level validation rules
- Type validation
- Length constraints
- Pattern matching
- Enum validation
- MongoDB ObjectId validation for references

## API Endpoints

### Generate MongoDB Model
```
POST /api/v1/apigen/model
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": {
    "name": "User",
    "pluralName": "users",
    "fields": [...],
    "timestamps": true,
    "softDelete": false
  }
}
```

### Generate Service
```
POST /api/v1/apigen/service
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": { ... },
  "options": {
    "includePagination": true,
    "includeSearch": true,
    "includeFiltering": true
  }
}
```

### Generate Controller
```
POST /api/v1/apigen/controller
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": { ... },
  "options": {
    "routes": ["create", "read", "update", "delete", "list"]
  }
}
```

### Generate Routes
```
POST /api/v1/apigen/routes
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": { ... },
  "options": { ... }
}
```

### Generate Validation Schema
```
POST /api/v1/apigen/validation
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": { ... }
}
```

### Generate Complete API
```
POST /api/v1/apigen/complete
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": { ... },
  "options": { ... }
}
```

## Configuration Structure

### APIResourceConfig
```typescript
{
  name: string;                    // Singular resource name (e.g., 'User')
  pluralName: string;              // Plural resource name (e.g., 'users')
  fields: APIField[];              // Array of field definitions
  timestamps?: boolean;            // Add createdAt/updatedAt
  softDelete?: boolean;            // Add soft delete support
  validation?: string;             // 'joi' | 'zod' | 'class-validator'
  database?: string;               // 'mongodb' | 'postgresql'
  description?: string;            // Resource description
}
```

### APIField
```typescript
{
  name: string;                    // Field name
  type: string;                    // 'string' | 'number' | 'boolean' | 'date' | 'email' | 'enum' | 'reference'
  required?: boolean;              // Is field required
  unique?: boolean;                // Is field unique
  indexed?: boolean;               // Create database index
  minLength?: number;              // Min string length
  maxLength?: number;              // Max string length
  pattern?: string;                // Regex validation pattern
  enum?: string[];                 // Enum values
  reference?: string;              // Foreign key reference
  description?: string;            // Field description
  default?: any;                   // Default value
}
```

### APIGenerationOptions
```typescript
{
  includePagination?: boolean;     // Add pagination support
  includeSearch?: boolean;         // Add search capability
  includeFiltering?: boolean;      // Add filtering capability
  includeValidation?: boolean;     // Add validation schemas
  includeSorting?: boolean;        // Add sorting support
  routes?: string[];               // Routes to generate: 'create' | 'read' | 'update' | 'delete' | 'list'
}
```

## Generated Endpoints

By default, a generated API creates these endpoints:

```
GET    /api/v1/{pluralName}                  # List with pagination/search/filter
POST   /api/v1/{pluralName}                  # Create
POST   /api/v1/{pluralName}/bulk             # Bulk create
GET    /api/v1/{pluralName}/search?q=query   # Search (optional)
GET    /api/v1/{pluralName}/:id              # Get by ID
PATCH  /api/v1/{pluralName}/:id              # Update
DELETE /api/v1/{pluralName}/:id              # Delete
```

## Field Types

| Type | Description | Validation |
|------|-------------|-----------|
| `string` | Text field | minLength, maxLength, pattern |
| `number` | Numeric field | None |
| `boolean` | Boolean field | None |
| `date` | Date field | None |
| `email` | Email field | Email validation |
| `enum` | Enum field | enum array |
| `reference` | Foreign key | ObjectId validation |

## Example: Generate User API

### Configuration
```typescript
const userConfig = {
  name: 'User',
  pluralName: 'users',
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'password', type: 'string', required: true, minLength: 6 },
    { name: 'firstName', type: 'string', required: true },
    { name: 'lastName', type: 'string', required: true },
    { name: 'role', type: 'enum', enum: ['user', 'admin'], default: 'user' },
    { name: 'isActive', type: 'boolean', default: true }
  ],
  timestamps: true
};

const options = {
  includePagination: true,
  includeSearch: true,
  includeFiltering: true,
  includeValidation: true,
  includeSorting: true,
  routes: ['create', 'read', 'update', 'delete', 'list']
};
```

### Generated Model
```typescript
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<IUser>({
  email: { String, required: true, unique: true },
  password: { String, required: true },
  firstName: { String, required: true },
  lastName: { String, required: true },
  role: { String, enum: ['user', 'admin'], default: 'user' },
  isActive: { Boolean, default: true }
}, { timestamps: true });
```

### Generated Service
```typescript
class UserService {
  async create(data: Partial<IUser>): Promise<IUser>
  async getById(id: string): Promise<IUser | null>
  async list(options): Promise<{data, total, page, pages}>
  async update(id: string, data): Promise<IUser | null>
  async delete(id: string): Promise<boolean>
  async search(query: string): Promise<IUser[]>
  async bulkCreate(items): Promise<IUser[]>
  async bulkUpdate(ids, data): Promise<{modifiedCount}>
  async bulkDelete(ids): Promise<{deletedCount}>
}
```

### API Usage Examples

**List users with pagination:**
```bash
GET /api/v1/users?page=1&pageSize=10&sort=-createdAt
```

**Search users:**
```bash
GET /api/v1/users/search?q=john
```

**Filter users:**
```bash
GET /api/v1/users?filter[role]=admin&filter[isActive]=true
```

**Create user:**
```bash
POST /api/v1/users
{
  "email": "user@example.com",
  "password": "secret123",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Features Explained

### Pagination
- Automatic page size and page number handling
- Total count calculation
- Page count calculation
- Lean queries for performance

### Search
- Full-text search across string fields
- Regex-based search with case-insensitive matching
- Customizable search field list
- Limit results capability

### Filtering
- Filter by any field value
- Multiple filter criteria support
- Optional filtering (can be disabled)
- Dynamic filter application

### Sorting
- Sort by any field
- Ascending/descending order
- Custom sort parameter handling
- Default sort order

### Soft Delete
- Logical deletion instead of permanent
- deletedAt field tracking
- Automatic filtering of deleted records
- Restore capability

### Validation
- Field-level validation
- Type checking
- Length constraints
- Pattern matching
- Custom validation rules

## Generated Code Quality

- ✅ Full TypeScript support
- ✅ Type-safe interfaces
- ✅ Error handling middleware
- ✅ Consistent response format
- ✅ RESTful API design
- ✅ Authentication required
- ✅ Bulk operations support
- ✅ Production-ready code

## Integration Guide

1. **Generate Model**: Create the MongoDB schema
2. **Generate Service**: Implement business logic
3. **Generate Controller**: Create route handlers
4. **Generate Routes**: Set up Express routes
5. **Generate Validation**: Add request validation
6. **Update Main Router**: Import and register routes
7. **Test Endpoints**: Verify all operations work

## Best Practices

1. **Name Resources Clearly**: Use singular/plural forms
2. **Define Fields Carefully**: Plan field types and constraints
3. **Enable Features as Needed**: Not all features required
4. **Test Generated Code**: Always verify functionality
5. **Customize as Needed**: Generated code is a starting point
6. **Version Your APIs**: Track API changes
7. **Document Endpoints**: Add API documentation

## Limitations

- MongoDB only (PostgreSQL support coming)
- Basic validation (can be extended)
- No complex relationships (needs implementation)
- No custom business logic (add manually)
- No real-time support (add with Socket.io)

## Advanced Configuration

### Multiple Resources
Generate multiple resources for related APIs:
- User → roles relationship
- Product → categories relationship
- Order → items relationship

### Custom Validation
Extend generated validation with:
- Custom async validators
- Cross-field validation
- Business rule validation

### Complex Filters
Implement advanced filtering:
- Date range filters
- Numeric range filters
- Full-text search
- Faceted search

## Support

For issues or feature requests, contact the development team.

---

**Last Updated**: May 7, 2026
**Version**: 1.0.0
