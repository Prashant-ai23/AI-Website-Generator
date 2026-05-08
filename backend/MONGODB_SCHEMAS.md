# 📊 MongoDB Schemas Documentation

Complete reference for all MongoDB/Mongoose schemas in the AI Website Generator backend.

---

## 📋 Table of Contents

1. [User Schema](#user-schema)
2. [Project Schema](#project-schema)
3. [Website Schema](#website-schema)
4. [GeneratedFile Schema](#generatedfile-schema)
5. [PromptHistory Schema](#prompthistory-schema)
6. [Relationships](#relationships)
7. [Validation Rules](#validation-rules)
8. [Indexes](#indexes)
9. [Usage Examples](#usage-examples)

---

## 👤 User Schema

**File:** `src/models/User.ts`

### Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| email | String | ✓ | - | Unique, lowercase, validated format |
| password | String | ✓ | - | Hashed with bcrypt, not selected by default |
| name | String | ✓ | - | 2-100 characters |
| profile.avatar | String | ✗ | - | Valid URL format |
| profile.bio | String | ✗ | - | Max 500 characters |
| profile.location | String | ✗ | - | User's location |
| preferences.theme | String | ✗ | 'light' | 'light' or 'dark' |
| preferences.emailNotifications | Boolean | ✗ | true | Email notification settings |
| preferences.language | String | ✗ | 'en' | User's language preference |
| stats.projectsCount | Number | ✗ | 0 | Total projects created |
| stats.generatedFilesCount | Number | ✗ | 0 | Total files generated |
| stats.promtsCount | Number | ✗ | 0 | Total prompts sent |
| isActive | Boolean | ✗ | true | Account active status |
| lastLoginAt | Date | ✗ | - | Last login timestamp |
| createdAt | Date | Auto | - | Created timestamp |
| updatedAt | Date | Auto | - | Updated timestamp |

### Validation

```typescript
// Email validation
- Must be valid email format
- Must be unique across all users
- Case-insensitive

// Password validation
- Minimum 6 characters
- Automatically hashed before saving
- Never returned in queries (select: false)

// Name validation
- Minimum 2 characters
- Maximum 100 characters

// Avatar validation
- Must be valid HTTP(S) URL
```

### Indexes

```typescript
// Performance indexes
{ email: 1 }                    // Email lookup
{ createdAt: -1 }              // Sorting by creation date
{ isActive: 1 }                // Finding active users
```

### Methods

```typescript
// Instance method
user.comparePassword(plainPassword: string): Promise<boolean>
// Compare plain password with hashed password

// Static methods
User.findByEmail(email: string)
User.findActiveUsers()
```

### Virtuals

```typescript
// Calculated virtual
user.totalActivities      // Sum of all activity counts
```

---

## 📁 Project Schema

**File:** `src/models/Project.ts`

### Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| userId | ObjectId | ✓ | - | Reference to User (indexed) |
| name | String | ✓ | - | 1-100 characters, trimmed |
| description | String | ✗ | - | Max 500 characters |
| type | String | ✓ | 'website' | website, blog, portfolio, ecommerce, saas, custom |
| status | String | ✓ | 'draft' | draft, published, archived |
| content | Mixed | ✗ | {} | Project content (flexible) |
| settings.theme | String | ✗ | - | Theme name |
| settings.domain | String | ✗ | - | Valid domain format |
| settings.seoMetadata | Mixed | ✗ | - | SEO metadata object |
| settings.publicUrl | String | ✗ | - | Public URL of project |
| metadata.pageCount | Number | ✗ | 0 | Number of pages |
| metadata.componentCount | Number | ✗ | 0 | Number of components |
| metadata.lastModifiedBy | String | ✗ | - | Last modifier's name |
| metadata.version | Number | ✗ | 1 | Version number |
| tags | [String] | ✗ | [] | Project tags |
| views | Number | ✗ | 0 | View count |
| collaborators | [ObjectId] | ✗ | [] | Array of user IDs |
| isPublic | Boolean | ✗ | false | Public accessibility |
| createdAt | Date | Auto | - | Created timestamp |
| updatedAt | Date | Auto | - | Updated timestamp |

### Validation

```typescript
// Name validation
- Required and trimmed
- Minimum 1 character
- Maximum 100 characters

// Status enum
enum Status { 'draft', 'published', 'archived' }

// Type enum
enum Type { 
  'website', 'blog', 'portfolio', 
  'ecommerce', 'saas', 'custom' 
}

// Domain validation
- Valid domain format: example.com
- Or localhost

// Metadata version
- Increments automatically on content changes
```

### Indexes

```typescript
// Performance indexes
{ userId: 1, createdAt: -1 }          // User's projects sorted by date
{ status: 1 }                         // Filter by status
{ type: 1 }                           // Filter by type
{ userId: 1, status: 1 }              // User + status combination
{ isPublic: 1, status: 1 }            // Find public published projects
{ tags: 1 }                           // Tag search
{ name: 'text', description: 'text' } // Full-text search
```

### Methods

```typescript
// Instance methods
project.publish()        // Change status to published
project.archive()        // Change status to archived

// Static methods
Project.findUserProjects(userId, status?)
Project.findPublic()     // Find all public published projects
```

### Virtuals

```typescript
// Reference virtual
project.owner            // Populated owner (User)
```

---

## 🌐 Website Schema

**File:** `src/models/Website.ts`

### Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| title | String | ✓ | - | 3-150 characters, trimmed |
| description | String | ✗ | '' | Max 500 characters |
| userId | ObjectId | ✓ | - | Reference to User |
| content | Mixed | ✗ | {} | Website content (flexible) |
| theme | String | ✗ | 'default' | One of predefined themes |
| isPublished | Boolean | ✗ | false | Publication status |
| pages | Array | ✗ | [] | Array of page objects |
| pages[].id | String | - | - | Page identifier |
| pages[].title | String | - | - | Page title |
| pages[].slug | String | - | - | URL slug (lowercase, hyphenated) |
| pages[].content | Mixed | - | - | Page content |
| components | [String] | ✗ | [] | Array of component names |
| analytics.views | Number | ✗ | 0 | Total view count |
| analytics.visitors | Number | ✗ | 0 | Unique visitors |
| analytics.lastVisited | Date | ✗ | - | Last visit timestamp |
| seo.keywords | [String] | ✗ | [] | SEO keywords |
| seo.metaDescription | String | ✗ | - | Max 160 characters |
| seo.ogImage | String | ✗ | - | Valid URL for OG image |
| domain | String | ✗ | - | Custom domain |
| status | String | ✗ | 'draft' | draft, preview, published |
| version | Number | ✗ | 1 | Version number |
| createdAt | Date | Auto | - | Created timestamp |
| updatedAt | Date | Auto | - | Updated timestamp |

### Validation

```typescript
// Title validation
- Required and trimmed
- Minimum 3 characters
- Maximum 150 characters

// Theme enum
enum Theme { 
  'default', 'minimal', 'modern', 
  'professional', 'creative', 'custom' 
}

// Status enum
enum Status { 'draft', 'preview', 'published' }

// Slug validation
- Lowercase alphanumeric and hyphens only
- Match: /^[a-z0-9-]*$/

// Domain validation
- Valid domain or localhost

// SEO metaDescription
- Maximum 160 characters
```

### Indexes

```typescript
// Performance indexes
{ userId: 1, createdAt: -1 }        // User's websites by date
{ status: 1 }                       // Filter by status
{ isPublished: 1 }                  // Find published websites
{ userId: 1, status: 1 }            // User + status combination
{ title: 'text', description: 'text' } // Full-text search
```

### Methods

```typescript
// Instance methods
website.publish()        // Set isPublished=true, status='published'
website.unpublish()      // Set isPublished=false, status='draft'
website.recordView()     // Increment views, update lastVisited

// Static methods
Website.findUserWebsites(userId)
Website.findPublished()  // Find all published websites, sorted by views
```

### Virtuals

```typescript
// Reference virtual
website.owner            // Populated owner (User)
```

---

## 📄 GeneratedFile Schema

**File:** `src/models/GeneratedFile.ts`

### Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| userId | ObjectId | ✓ | - | Reference to User (indexed) |
| projectId | ObjectId | ✗ | - | Reference to Project (sparse) |
| fileName | String | ✓ | - | Must match valid file extensions |
| fileType | String | ✓ | - | react, express, schema, menu, documentation, other |
| language | String | ✓ | - | typescript, javascript, json, markdown, sql |
| content | String | ✓ | - | File content |
| generatedByTool | String | ✓ | - | MCP tool name that generated it |
| toolParameters | Mixed | ✗ | {} | Original tool parameters |
| metadata.lines | Number | ✗ | - | Line count (auto-calculated) |
| metadata.size | Number | ✗ | - | File size in bytes (auto-calculated) |
| metadata.complexity | String | ✗ | - | simple, moderate, complex (auto-calculated) |
| metadata.dependencies | [String] | ✗ | [] | Code dependencies |
| status | String | ✗ | 'draft' | draft, saved, integrated, archived |
| tags | [String] | ✗ | [] | File tags |
| expiresAt | Date | ✗ | now+30d | Auto-deletion date (TTL) |
| createdAt | Date | Auto | - | Created timestamp |
| updatedAt | Date | Auto | - | Updated timestamp |

### Validation

```typescript
// FileName validation
- Must match: /^[\w\-. ]+\.(ts|tsx|js|jsx|json|md|sql)$/
- Valid extensions: ts, tsx, js, jsx, json, md, sql

// FileType enum
enum FileType { 'react', 'express', 'schema', 'menu', 'documentation', 'other' }

// Language enum
enum Language { 'typescript', 'javascript', 'json', 'markdown', 'sql' }

// GeneratedByTool enum
enum Tool {
  'generateReactPage',
  'generateExpressAPI',
  'generateMongoSchema',
  'generateSidebarMenu',
  'generateDocumentation'
}

// Status enum
enum Status { 'draft', 'saved', 'integrated', 'archived' }
```

### Indexes

```typescript
// Performance indexes
{ userId: 1, createdAt: -1 }             // User's files by date
{ projectId: 1, fileType: 1 }            // Project's files by type
{ fileType: 1, status: 1 }               // Type + status combination
{ generatedByTool: 1 }                   // Filter by tool
{ tags: 1 }                              // Tag search
{ expiresAt: 1, sparse: true }           // TTL index for auto-deletion
```

### Metadata Calculations

Automatically calculated on save:
- `lines` - Split by newlines
- `size` - Buffer byte length
- `complexity` - Based on code tokens (simple < 20, moderate < 50, complex >= 50)

---

## 📝 PromptHistory Schema

**File:** `src/models/PromptHistory.ts`

### Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| userId | ObjectId | ✓ | - | Reference to User |
| projectId | ObjectId | ✗ | - | Reference to Project (sparse) |
| prompt | String | ✓ | - | 5-5000 characters, trimmed |
| toolUsed | String | ✓ | - | MCP tool name |
| parameters | Mixed | ✓ | {} | Tool parameters used |
| generatedFileId | ObjectId | ✗ | - | Reference to GeneratedFile |
| result.success | Boolean | ✓ | false | Execution success status |
| result.output | String | ✗ | - | Generated output (max 50KB) |
| result.error | String | ✗ | - | Error message if failed |
| result.duration | Number | ✗ | - | Execution time in milliseconds |
| metadata.promptLength | Number | ✗ | - | Prompt character count |
| metadata.tokensUsed | Number | ✗ | - | Tokens consumed |
| metadata.model | String | ✗ | - | AI model used |
| metadata.temperature | Number | ✗ | - | Model temperature (0-2) |
| feedback.rating | Number | ✗ | - | User rating 1-5 |
| feedback.comment | String | ✗ | - | User feedback (max 1KB) |
| feedback.isUseful | Boolean | ✗ | - | Usefulness flag |
| tags | [String] | ✗ | [] | Searchable tags |
| category | String | ✗ | 'other' | frontend, backend, database, documentation, other |
| createdAt | Date | Auto | - | Created timestamp |
| updatedAt | Date | Auto | - | Updated timestamp |

### Validation

```typescript
// Prompt validation
- Minimum 5 characters
- Maximum 5000 characters
- Required and trimmed

// ToolUsed enum
enum Tool {
  'generateReactPage',
  'generateExpressAPI',
  'generateMongoSchema',
  'generateSidebarMenu',
  'generateDocumentation'
}

// Rating enum
enum Rating { 1, 2, 3, 4, 5 }

// Category enum
enum Category { 'frontend', 'backend', 'database', 'documentation', 'other' }

// Temperature validation
- Minimum 0
- Maximum 2
```

### Indexes

```typescript
// Performance indexes
{ userId: 1, createdAt: -1 }                       // User's prompts by date
{ userId: 1, toolUsed: 1, createdAt: -1 }         // User + tool by date
{ projectId: 1, createdAt: -1 }                   // Project's prompts
{ toolUsed: 1, 'result.success': 1 }              // Tool + success status
{ tags: 1 }                                        // Tag search
{ category: 1 }                                    // Category filter
{ 'feedback.rating': 1 }                          // Rating filter
{ 'result.success': 1 }                           // Success status
{ prompt: 'text' }                                 // Full-text search on prompt
```

### Static Methods

```typescript
// Find user's prompts
PromptHistory.findByUser(userId: string, limit?: number)

// Find successful prompts
PromptHistory.findSuccessfulPrompts(userId: string)

// Find prompts by specific tool
PromptHistory.findByTool(userId: string, tool: string)

// Get average rating by tool
PromptHistory.getAverageRating(userId: string)
// Returns: [{ _id: 'toolName', averageRating: 4.5, totalRatings: 10 }]
```

### Virtuals

```typescript
// Reference virtual
promptHistory.generatedFile   // Populated GeneratedFile reference
```

---

## 🔗 Relationships

### Entity Relationship Diagram

```
User (1) ──────┬────────── (N) Project
               ├────────── (N) GeneratedFile
               ├────────── (N) Website
               └────────── (N) PromptHistory

Project (1) ──────┬────────── (N) GeneratedFile
                  └────────── (N) PromptHistory

GeneratedFile (1) ────────── (1) PromptHistory (optional)
```

### Relationship Details

**User → Project** (One-to-Many)
- User creates multiple projects
- projectSchema.userId → User._id

**User → GeneratedFile** (One-to-Many)
- User generates multiple files
- generatedFileSchema.userId → User._id

**Project → GeneratedFile** (One-to-Many)
- Project contains multiple generated files
- generatedFileSchema.projectId → Project._id (optional)

**User → PromptHistory** (One-to-Many)
- User sends multiple prompts
- promptHistorySchema.userId → User._id

**Project → PromptHistory** (One-to-Many)
- Project has multiple prompt histories
- promptHistorySchema.projectId → Project._id (optional)

**GeneratedFile → PromptHistory** (One-to-One)
- Prompt may generate a file
- promptHistorySchema.generatedFileId → GeneratedFile._id (optional)

---

## ✓ Validation Rules

### Email Validation
```typescript
// Must be valid format
/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

// Must be unique
index: { unique: true }
```

### String Length Constraints
```
User.name:                  2-100 characters
User.profile.bio:           max 500 characters
Project.name:               1-100 characters
Project.description:        max 500 characters
Website.title:              3-150 characters
Website.description:        max 500 characters
GeneratedFile.fileName:     valid extension
GeneratedFile.content:      1+ characters
PromptHistory.prompt:       5-5000 characters
PromptHistory.feedback:     max 1000 characters
```

### Enum Constraints
```
Project.type:       website, blog, portfolio, ecommerce, saas, custom
Project.status:     draft, published, archived
Website.theme:      default, minimal, modern, professional, creative, custom
Website.status:     draft, preview, published
GeneratedFile.fileType:     react, express, schema, menu, documentation, other
GeneratedFile.language:     typescript, javascript, json, markdown, sql
GeneratedFile.status:       draft, saved, integrated, archived
PromptHistory.category:     frontend, backend, database, documentation, other
PromptHistory.feedback.rating:  1, 2, 3, 4, 5
```

### Numeric Constraints
```
User.stats:                     >= 0
Project.views:                  >= 0
Website.analytics.views:        >= 0
Website.analytics.visitors:     >= 0
Website.version:                >= 1
GeneratedFile.metadata.size:    >= 0
PromptHistory.result.duration:  >= 0
PromptHistory.metadata.temperature: 0-2
```

---

## 📊 Indexes

### Index Types and Performance Impact

**Regular Indexes** (Single Field)
```typescript
{ userId: 1 }
{ status: 1 }
{ email: 1 }
```
Use for: Quick lookups, sorting

**Compound Indexes** (Multiple Fields)
```typescript
{ userId: 1, createdAt: -1 }
{ userId: 1, status: 1 }
```
Use for: Multi-field queries, common filters

**Text Indexes** (Full-Text Search)
```typescript
{ name: 'text', description: 'text' }
{ prompt: 'text' }
```
Use for: Full-text search queries

**Sparse Indexes** (Optional Fields)
```typescript
{ projectId: 1, sparse: true }
{ expiresAt: 1, sparse: true }
```
Use for: Optional relationship fields

**TTL Indexes** (Auto-Deletion)
```typescript
{ expiresAt: 1 }, { expireAfterSeconds: 0 }
```
Use for: Automatic document cleanup

---

## 💡 Usage Examples

### Find User's Projects

```typescript
const projects = await Project.findUserProjects(userId, 'published');
```

### Search by Tags

```typescript
const files = await GeneratedFile.find({ tags: 'react' })
  .sort({ createdAt: -1 })
  .limit(10);
```

### Get Prompt History with Average Ratings

```typescript
const ratings = await PromptHistory.getAverageRating(userId);
console.log(ratings);
// [
//   { _id: 'generateReactPage', averageRating: 4.8, totalRatings: 5 },
//   { _id: 'generateExpressAPI', averageRating: 4.2, totalRatings: 8 }
// ]
```

### Populate References

```typescript
const project = await Project.findById(projectId)
  .populate('userId', 'name email')
  .populate('collaborators', 'name email');
```

### Text Search

```typescript
const results = await Project.find({ 
  $text: { $search: 'dashboard admin' } 
})
.sort({ score: { $meta: 'textScore' } });
```

### Aggregate Statistics

```typescript
const stats = await GeneratedFile.aggregate([
  { $match: { userId: new ObjectId(userId) } },
  { 
    $group: {
      _id: '$fileType',
      count: { $sum: 1 },
      totalSize: { $sum: '$metadata.size' }
    }
  }
]);
```

---

## 🔐 Data Integrity

### Cascade Behavior

When a User is deleted:
- Projects remain (orphaned)
- GeneratedFiles remain (orphaned)
- PromptHistory remains (orphaned)

**Recommendation**: Implement cascade delete in application logic or use MongoDB transactions.

### Reference Validation

All ObjectId references should be validated:

```typescript
// Validate before save
if (projectId && !ObjectId.isValid(projectId)) {
  throw new Error('Invalid project ID');
}
```

---

## 📈 Performance Tips

1. **Use indexes** - All frequently queried fields have indexes
2. **Limit projections** - Select only needed fields
3. **Use pagination** - Limit result sets
4. **Batch operations** - Use insertMany for bulk inserts
5. **Monitor TTL** - GeneratedFile auto-deletion after 30 days
6. **Archive old data** - Move archived projects to separate collection

---

## 🔄 Migration Guide

### Adding New Field

```typescript
// 1. Add to interface
interface IProject extends Document {
  newField?: string;
}

// 2. Add to schema
newField: {
  type: String,
  default: ''
}

// 3. Run migration
db.projects.updateMany({}, { $set: { newField: '' } })
```

### Adding New Index

```typescript
// 1. Add to schema
schema.index({ newField: 1 });

// 2. Rebuild indexes
db.projects.reIndex()
```

---

**Created:** May 7, 2026  
**Version:** 1.0.0
