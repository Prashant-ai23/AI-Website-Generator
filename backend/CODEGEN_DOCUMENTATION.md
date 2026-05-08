# React Code Generation Engine - Documentation

## Overview

The React Code Generation Engine is a powerful tool that automatically generates React components with support for multiple styling libraries. It enables developers to quickly scaffold pages, forms, tables, layouts, and routing configurations with minimal manual coding.

## Features

### 1. Page Generation
Generate fully functional React page components with:
- Responsive header and content sections
- Configurable title and description
- Section-based layouts
- Multiple layout types (default, sidebar, tabs)

**Example Config:**
```typescript
{
  name: 'HomePage',
  title: 'Welcome',
  styling: 'tailwind',
  sections: ['Features', 'Benefits', 'Pricing']
}
```

### 2. Form Generation
Create dynamic forms with extensive field support:
- **Field Types**: text, email, password, number, select, textarea, checkbox, radio, date
- **Validation**: Required fields, custom validation rules
- **Layouts**: Vertical, horizontal, grid-based
- **Actions**: Submit and cancel buttons

**Example Config:**
```typescript
{
  name: 'LoginForm',
  styling: 'mui',
  fields: [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true
    }
  ],
  submitButton: true,
  cancelButton: true
}
```

### 3. Table Generation
Create data tables with advanced features:
- **Columns**: Configurable with types (text, number, date, status, actions)
- **Features**: Sorting, filtering, pagination
- **Actions**: View, edit, delete buttons
- **Responsive**: Mobile-friendly design

**Example Config:**
```typescript
{
  name: 'UsersTable',
  styling: 'tailwind',
  columns: [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', type: 'status' }
  ],
  actions: ['view', 'edit', 'delete'],
  sortable: true,
  filterable: true,
  pagination: true,
  rowsPerPage: 10
}
```

### 4. Layout Generation
Create application layouts with multiple configurations:
- **Types**:
  - `header-footer`: Top navigation with footer
  - `sidebar`: Collapsible sidebar with main content
  - `two-column`: Left/right column layout
  - `three-column`: Left/center/right layout
- **Navigation**: Configurable menu items
- **Responsive**: Mobile-optimized

**Example Config:**
```typescript
{
  name: 'AppLayout',
  styling: 'tailwind',
  type: 'sidebar',
  hasNavigation: true,
  navigationItems: [
    { label: 'Home', path: '/' },
    { label: 'Users', path: '/users' },
    { label: 'Settings', path: '/settings' }
  ]
}
```

### 5. Routing Generation
Create React Router configuration with:
- **Route Definitions**: Path, component, name mapping
- **Protected Routes**: Authentication support
- **Code Splitting**: Lazy loading with Suspense
- **Fallbacks**: Default routes for not found pages

**Example Config:**
```typescript
{
  styling: 'tailwind',
  routes: [
    { path: '/', name: 'Home', component: 'pages/Home' },
    { path: '/dashboard', name: 'Dashboard', component: 'pages/Dashboard', protected: true },
    { path: '/admin', name: 'Admin', component: 'pages/Admin', protected: true }
  ],
  protectedRoutes: ['/dashboard', '/admin'],
  defaultLayout: 'header-footer'
}
```

## Styling Libraries

### Tailwind CSS
- Utility-first CSS framework
- Responsive classes and design tokens
- No CSS-in-JS dependencies
- Lighter bundle size

### Material-UI (MUI)
- Comprehensive component library
- Built-in theming system
- Accessibility features included
- Professional UI components

## API Endpoints

### Generate Page
```
POST /api/v1/codegen/page
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": {
    "name": "HomePage",
    "title": "Welcome",
    "styling": "tailwind"
  }
}
```

### Generate Form
```
POST /api/v1/codegen/form
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": {
    "name": "LoginForm",
    "styling": "tailwind",
    "fields": [...]
  }
}
```

### Generate Table
```
POST /api/v1/codegen/table
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": {
    "name": "UsersTable",
    "styling": "mui",
    "columns": [...]
  }
}
```

### Generate Layout
```
POST /api/v1/codegen/layout
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": {
    "name": "AppLayout",
    "styling": "tailwind",
    "type": "sidebar"
  }
}
```

### Generate Routing
```
POST /api/v1/codegen/routing
Content-Type: application/json
Authorization: Bearer <token>

{
  "config": {
    "styling": "tailwind",
    "routes": [...]
  }
}
```

## Response Format

All endpoints return the same response structure:
```typescript
{
  "statusCode": 200,
  "data": {
    "code": "import React from 'react';\n...",
    "language": "typescript",
    "framework": "react",
    "styling": "tailwind",
    "metadata": {
      "componentName": "HomePage",
      "fieldCount": 2,
      ...
    }
  },
  "message": "Component generated successfully",
  "success": true
}
```

## Frontend Usage

### Using the Code Generator Hook

```typescript
import { useCodeGenerator } from '@/hooks/useCodeGenerator';

function MyComponent() {
  const { code, loading, error, generatePage, copyToClipboard } = useCodeGenerator();

  const handleGenerate = async () => {
    try {
      await generatePage({
        name: 'HomePage',
        title: 'Welcome',
        styling: 'tailwind'
      });
    } catch (err) {
      console.error('Generation failed', err);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Page'}
      </button>
      
      {code && (
        <>
          <pre>{code.code}</pre>
          <button onClick={() => copyToClipboard(code.code)}>
            Copy Code
          </button>
        </>
      )}
    </div>
  );
}
```

### Using the Component UI

Access the full generator interface at `/codegen` route (requires authentication):

1. **Select Styling Library**: Choose between Tailwind CSS or Material-UI
2. **Choose Component Type**: Click on page, form, table, layout, or routing tabs
3. **Configure Component**: Fill in the configuration form
4. **Generate Code**: Click the generate button
5. **Export**: Copy code or download as file

## TypeScript Interfaces

### ComponentConfig
Base interface for all components:
```typescript
interface ComponentConfig {
  name: string;           // Component name
  styling: 'tailwind' | 'mui';  // Styling library
  description?: string;   // Optional description
}
```

### FormField
Used in FormConfig:
```typescript
interface FormField {
  name: string;           // Form field name
  label: string;          // Display label
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  required?: boolean;     // Is field required
  placeholder?: string;   // Input placeholder
  options?: Array<{ label: string; value: string }>;  // For select fields
  validation?: string;    // Validation rule
}
```

### TableColumn
Used in TableConfig:
```typescript
interface TableColumn {
  key: string;           // Data key
  label: string;         // Column header
  type?: 'text' | 'number' | 'date' | 'status' | 'actions';
  sortable?: boolean;    // Can be sorted
  width?: string;        // Column width
}
```

## Generated Code Examples

### Generated Form (Tailwind)
```typescript
import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">LoginForm</h2>
      {/* Form fields */}
    </form>
  );
};
```

### Generated Table (MUI)
```typescript
import React from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const UsersTable: React.FC = ({ data = [] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            {/* More columns */}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Rows */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
```

## Best Practices

1. **Start with the Analyzer**: Use the app idea analyzer to understand required modules
2. **Choose Styling Early**: Decide on Tailwind or MUI before generating
3. **Validate Configurations**: Ensure all required fields are filled
4. **Review Generated Code**: Always review and customize as needed
5. **Combine with Manual Changes**: Generator provides skeleton, add business logic
6. **Version Control**: Track generated components for consistency

## Integration with Analyzer

The Code Generator works seamlessly with the App Idea Analyzer:

1. **Analyze**: Enter your app idea in the analyzer
2. **Get Modules**: Receive list of required modules
3. **Generate**: Create components for each module using the generator
4. **Implement**: Add business logic and connect components

## Limitations

- Generated code is a starting point (scaffolding)
- Business logic must be added manually
- State management setup is basic (use Redux/Zustand as needed)
- API integration is not included
- Complex layouts may require customization

## Future Enhancements

- [ ] Component preview capability
- [ ] Advanced state management integration
- [ ] API integration templates
- [ ] Custom styling templates
- [ ] Component composition/reusability
- [ ] Type-safe form handling
- [ ] Storybook integration
- [ ] Component history/versioning

## Support

For issues or feature requests, please refer to the project documentation or contact the development team.
