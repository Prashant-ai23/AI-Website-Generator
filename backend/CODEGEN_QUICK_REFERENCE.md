# React Code Generation Engine - Quick Reference

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   └── reactCodeGenerator.ts (600+ lines)
│   │       - ReactCodeGenerator class
│   │       - 6 main methods (page, form, table, layout, routing)
│   │       - Tailwind & MUI support
│   │
│   ├── controllers/
│   │   └── codeGeneratorController.ts
│   │       - 5 async endpoints
│   │       - Input validation
│   │       - ApiResponse wrappers
│   │
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── codegen.ts (5 routes)
│   │   │   └── index.ts (updated)
│   │
│   └── middleware/
│       └── auth.ts (uses authenticate middleware)
│
frontend/
├── src/
│   ├── hooks/
│   │   └── useCodeGenerator.ts
│   │       - State management
│   │       - API methods
│   │       - Utilities
│   │
│   ├── types/
│   │   └── codeGenerator.ts
│   │       - All TypeScript interfaces
│   │
│   ├── components/
│   │   └── CodeGenerator.tsx (400+ lines)
│   │       - Tab interface
│   │       - Config forms
│   │       - Code output
│   │
│   ├── pages/
│   │   └── CodeGenerator.tsx (wrapper)
│   │
│   └── routes/
│       └── routes.tsx (updated with /codegen)
```

## API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/codegen/page` | POST | Generate page component |
| `/api/v1/codegen/form` | POST | Generate form component |
| `/api/v1/codegen/table` | POST | Generate table component |
| `/api/v1/codegen/layout` | POST | Generate layout component |
| `/api/v1/codegen/routing` | POST | Generate routing config |

## Frontend Routes

| Route | Type | Auth Required | Purpose |
|-------|------|---------------|---------|
| `/codegen` | Protected | Yes | Code generator UI |

## Component Types Supported

### 1. Page Component
- Responsive layout
- Multiple sections
- Header with title
- Customizable content areas

### 2. Form Component
- 9 field types (text, email, password, etc.)
- Field validation
- Optional buttons
- State management included

### 3. Table Component
- Dynamic columns
- Sorting & filtering
- Pagination support
- Action buttons
- Row selection

### 4. Layout Component
- 4 layout types
- Navigation support
- Responsive design
- Mobile optimization

### 5. Routing Configuration
- Route definitions
- Protected routes
- Lazy loading
- Suspense fallback

## Configuration Templates

### Page Config
```typescript
{
  name: 'ComponentName',        // required
  title: 'Display Title',       // required
  styling: 'tailwind',          // required: 'tailwind' | 'mui'
  description: 'Optional',      // optional
  sections: [],                 // optional: string[]
  layout: 'default'             // optional: 'default' | 'sidebar' | 'tabs'
}
```

### Form Config
```typescript
{
  name: 'FormName',             // required
  styling: 'tailwind',          // required
  fields: [...],                // required: FormField[]
  submitButton: true,           // optional: boolean
  cancelButton: false,          // optional: boolean
  layout: 'vertical'            // optional: 'vertical' | 'horizontal' | 'grid'
}
```

### Table Config
```typescript
{
  name: 'TableName',            // required
  styling: 'tailwind',          // required
  columns: [...],               // required: TableColumn[]
  sortable: true,               // optional: boolean
  filterable: true,             // optional: boolean
  pagination: true,             // optional: boolean
  rowsPerPage: 10,              // optional: number
  actions: ['edit', 'delete']   // optional: ('view' | 'edit' | 'delete')[]
}
```

### Layout Config
```typescript
{
  name: 'LayoutName',           // required
  styling: 'tailwind',          // required
  type: 'sidebar',              // required: 'header-footer' | 'sidebar' | 'two-column' | 'three-column'
  hasNavigation: true,          // optional: boolean
  navigationItems: [...],       // optional: NavigationItem[]
  headerHeight: '64px',         // optional: string
  sidebarWidth: '256px'         // optional: string
}
```

### Routing Config
```typescript
{
  styling: 'tailwind',          // required
  routes: [...],                // required: RouteDefinition[]
  defaultLayout: 'header-footer', // optional: string
  protectedRoutes: ['/admin']   // optional: string[]
}
```

## Styling Comparison

| Feature | Tailwind CSS | Material-UI |
|---------|-------------|-------------|
| Bundle Size | Small | Large |
| Learning Curve | Steep | Moderate |
| Customization | Easy | Moderate |
| Components | Minimal | Comprehensive |
| Theming | Via Config | Built-in |
| Icons | Separate | Built-in |
| Accessibility | Manual | Auto |

## Field Types for Forms

```
text        - Basic text input
email       - Email input with validation
password    - Masked password input
number      - Numeric input
select      - Dropdown list
textarea    - Multi-line text
checkbox    - Boolean toggle
radio       - Radio button group
date        - Date picker
```

## Table Column Types

```
text        - Standard text display
number      - Right-aligned numbers
date        - Formatted dates
status      - Status badges
actions     - Action buttons
```

## Layout Types

```
header-footer   - Top nav + main content + footer
sidebar         - Left sidebar + main content
two-column      - Left column + right column
three-column    - Left + center + right columns
```

## Common Use Cases

### Generate Login Form
```typescript
generateForm({
  name: 'LoginForm',
  styling: 'tailwind',
  fields: [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true }
  ]
})
```

### Generate User Table
```typescript
generateTable({
  name: 'UsersTable',
  styling: 'mui',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ],
  actions: ['view', 'edit', 'delete']
})
```

### Generate App Layout
```typescript
generateLayout({
  name: 'AppLayout',
  styling: 'tailwind',
  type: 'sidebar',
  navigationItems: [
    { label: 'Home', path: '/' },
    { label: 'Users', path: '/users' },
    { label: 'Settings', path: '/settings' }
  ]
})
```

### Generate Routing
```typescript
generateRouting({
  styling: 'tailwind',
  routes: [
    { path: '/', name: 'Home', component: 'pages/Home' },
    { path: '/users', name: 'Users', component: 'pages/Users' },
    { path: '/admin', name: 'Admin', component: 'pages/Admin', protected: true }
  ],
  protectedRoutes: ['/admin']
})
```

## Generated Output Format

```typescript
{
  code: "import React from 'react';\n...",  // Full component code
  language: "typescript",                    // Language type
  framework: "react",                        // Framework
  styling: "tailwind",                       // Styling library used
  metadata: {                                // Additional info
    componentName: "...",
    fieldCount: 5,
    columnCount: 3,
    // etc.
  }
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Config must include name" | Missing required field | Check config object |
| "Invalid layout type" | Wrong layout type | Use valid type from list |
| "Fields array required" | Empty or missing fields | Add at least one field |
| "Authentication required" | Not logged in | Login first |

## Performance Tips

1. **Use Tailwind for**: Small projects, quick prototypes, custom designs
2. **Use MUI for**: Professional apps, consistent design, rich components
3. **Generate once, customize**: Don't regenerate frequently
4. **Review generated code**: Always check for correctness
5. **Add business logic**: Generator provides skeleton only

## Integration Guide

1. **With Analyzer**:
   - Run analyzer to get module list
   - Generate components for each module
   - Connect components together

2. **With State Management**:
   - Add Redux/Zustand for complex state
   - Generated forms use local state
   - Integrate with store as needed

3. **With API**:
   - Add axios/fetch calls to generated forms
   - Update generated tables with API data
   - Use hooks for data fetching

## Maintenance Notes

- All generated code is TypeScript
- Uses React 18+ hooks
- No external UI library dependencies (unless MUI)
- Responsive design included
- Accessibility basics included

---

**Last Updated**: May 7, 2026
**Version**: 1.0.0
