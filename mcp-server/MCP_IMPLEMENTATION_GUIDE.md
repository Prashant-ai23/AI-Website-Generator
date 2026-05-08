# MCP Server Implementation Guide

## 📖 Complete Reference

This guide covers the complete MCP Server implementation for the AI Website Generator.

---

## 🏗️ Project Structure

```
mcp-server/
├── src/
│   ├── index.ts                              # MCP Server entry point
│   ├── generators/                           # Code generation modules
│   │   ├── reactPageGenerator.ts            # React component generator
│   │   ├── expressAPIGenerator.ts           # Express route generator
│   │   ├── mongoSchemaGenerator.ts          # MongoDB schema generator
│   │   ├── sidebarMenuGenerator.ts          # React sidebar generator
│   │   └── documentationGenerator.ts        # Markdown documentation generator
│   ├── tools/                                # MCP tool implementations
│   │   └── codeGenerationTools.ts           # Tool wrappers & registration
│   ├── services/                             # Business logic services
│   │   ├── promptService.ts                 # Prompt template management
│   │   └── fileGenerationService.ts         # File I/O operations
│   ├── utils/
│   │   ├── logger.ts                        # Winston logger configuration
│   │   └── asyncHandler.ts                  # Async error wrapper
│   └── prompts/                              # Prompt templates
├── dist/                                     # Compiled JavaScript
├── logs/                                     # Log files
├── package.json                              # Dependencies
├── tsconfig.json                             # TypeScript configuration
├── .env.example                              # Environment template
└── MCP_SERVER_README.md                      # Comprehensive README
```

---

## 🚀 Quick Start

### 1. Installation

```bash
cd mcp-server
npm install
npm run build
npm run dev
```

### 2. Basic Tool Usage

```typescript
// Example: Generate React component
const result = await toolGenerateReactPage({
  pageName: 'Dashboard',
  componentType: 'functional',
  useHooks: true,
  withTypeScript: true,
  withStyles: true
});

console.log(result.code);     // Generated code
console.log(result.fileName); // Suggested filename
```

### 3. Integration with Claude

The MCP server automatically registers with Claude through stdio:

```
Claude Client
    ↓
Model Context Protocol (stdio)
    ↓
MCP Server (index.ts)
    ↓
Tool Execution
```

---

## 🛠️ Core Components

### Logger (utils/logger.ts)

**Features:**
- Winston logging with multiple transports
- Console output with colors
- File logging (error.log, combined.log)
- Configurable log levels

**Usage:**
```typescript
import logger from './utils/logger.js';

logger.info('Operation started', { param: 'value' });
logger.error('Something failed', { error });
logger.warn('Warning message');
logger.debug('Debug info', { data });
```

### Async Handler (utils/asyncHandler.ts)

**Purpose:** Wrap async functions to catch errors

**Usage:**
```typescript
import { asyncHandler } from './utils/asyncHandler.js';

const myAsyncFunction = asyncHandler(async (req, res) => {
  // Your async code
  // Errors are automatically caught
});
```

### Prompt Service (services/promptService.ts)

**Features:**
- Manage prompt templates
- Support template variables
- Organize by category
- Render templates with values

**Usage:**
```typescript
import { promptService } from './services/promptService.js';

// Get all prompts for React
const reactPrompts = promptService.getPrompts('react');

// Render a prompt
const rendered = promptService.renderPrompt('react-page-dashboard', {
  features: 'Analytics and Reports',
  metrics: 'Revenue, Users, Orders'
});
```

### File Generation Service (services/fileGenerationService.ts)

**Features:**
- Generate files to disk
- Batch file generation
- File reading/deletion
- Directory management

**Usage:**
```typescript
import { fileGenerationService } from './services/fileGenerationService.js';

// Generate single file
const result = await fileGenerationService.generateFile({
  fileName: 'Dashboard.tsx',
  content: componentCode,
  outputDir: './components',
  overwrite: false
});

// Batch generation
const results = await fileGenerationService.generateFiles([
  { fileName: 'Page1.tsx', content: code1 },
  { fileName: 'Page2.tsx', content: code2 }
]);
```

---

## 📚 Generators In Detail

### React Page Generator

**Generates:** Functional or class React components

**Options:**
```typescript
interface ReactPageOptions {
  pageName: string;           // Component name
  componentType?: 'functional' | 'class';
  useHooks?: boolean;         // Include useState, useEffect, etc.
  withTypeScript?: boolean;   // TypeScript types
  withStyles?: boolean;       // CSS import
  imports?: string[];         // Additional imports
}
```

**Output:** React component with selected features

**Example:**
```typescript
const code = await generateReactPage({
  pageName: 'UserProfile',
  componentType: 'functional',
  useHooks: true,
  withTypeScript: true,
  withStyles: true,
  imports: ['import { useParams } from "react-router-dom"']
});
```

### Express API Generator

**Generates:** Express routes with controller methods

**Options:**
```typescript
interface ExpressAPIOptions {
  routeName: string;                    // Route/resource name
  methods?: ('GET'|'POST'|'PUT'|'DELETE'|'PATCH')[];
  withValidation?: boolean;             // Validation middleware
  withErrorHandling?: boolean;          // Error handler
  withAuth?: boolean;                   // Auth middleware
}
```

**Output:** Express router with methods and middleware

**Example:**
```typescript
const code = await generateExpressAPI({
  routeName: 'products',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  withValidation: true,
  withErrorHandling: true,
  withAuth: true
});
```

### MongoDB Schema Generator

**Generates:** Mongoose schemas with models

**Options:**
```typescript
interface MongoSchemaOptions {
  modelName: string;
  fields: SchemaField[];
  withTimestamps?: boolean;
  withVirtuals?: boolean;
  withMethods?: boolean;
  withIndexes?: boolean;
}

interface SchemaField {
  name: string;
  type: 'String'|'Number'|'Boolean'|'Date'|'ObjectId'|'Array'|'Mixed';
  required?: boolean;
  unique?: boolean;
  index?: boolean;
  default?: any;
  ref?: string;
  description?: string;
}
```

**Output:** Mongoose schema with hooks and methods

**Example:**
```typescript
const code = await generateMongoSchema({
  modelName: 'user',
  fields: [
    { name: 'email', type: 'String', required: true, unique: true },
    { name: 'name', type: 'String', required: true },
    { name: 'age', type: 'Number' }
  ],
  withTimestamps: true,
  withMethods: true
});
```

### Sidebar Menu Generator

**Generates:** React sidebar component

**Options:**
```typescript
interface SidebarOptions {
  menuItems: MenuItem[];
  style?: 'vertical' | 'horizontal';
  withCollapse?: boolean;
  withIcons?: boolean;
  theme?: 'light' | 'dark';
  componentName?: string;
}

interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  badge?: string | number;
}
```

**Output:** React TypeScript component with collapsible menu

**Example:**
```typescript
const code = await generateSidebarMenu({
  menuItems: [
    { id: 'home', label: 'Home', path: '/', icon: '🏠' },
    {
      id: 'products',
      label: 'Products',
      icon: '📦',
      children: [
        { id: 'all', label: 'All Products', path: '/products' }
      ]
    }
  ],
  style: 'vertical',
  theme: 'light',
  withIcons: true
});
```

### Documentation Generator

**Generates:** Markdown documentation

**Options:**
```typescript
interface DocumentationOptions {
  projectName: string;
  sections: DocSection[];
  includeTableOfContents?: boolean;
  includeInstallation?: boolean;
  includeUsage?: boolean;
  includeLicense?: boolean;
}

interface DocSection {
  title: string;
  content: string;
  subsections?: DocSection[];
  codeExamples?: string[];
}
```

**Output:** Complete Markdown documentation

**Example:**
```typescript
const doc = await generateDocumentation({
  projectName: 'My API',
  sections: [
    {
      title: 'Features',
      content: 'List of features...',
      codeExamples: ['console.log("example");']
    }
  ],
  includeTableOfContents: true,
  includeInstallation: true
});
```

---

## 🔌 Tool Registration

### How Tools Are Registered

1. **Tool Definition** - Created in `src/tools/codeGenerationTools.ts`
2. **Tool Registration** - Added to `tools` array in `src/index.ts`
3. **MCP Handler** - Processed by `CallToolRequestSchema` handler

### Adding New Tools

**Step 1: Create Generator**
```typescript
// src/generators/myGenerator.ts
export async function generateMyThing(options: MyOptions): Promise<string> {
  // Implementation
  return generatedCode;
}
```

**Step 2: Wrap Tool**
```typescript
// src/tools/codeGenerationTools.ts
export async function toolGenerateMyThing(args: MyArgs): Promise<ToolResult> {
  const code = await generateMyThing(args);
  return { success: true, code, fileName: 'MyFile.ts', message: 'Generated!' };
}
```

**Step 3: Register in Server**
```typescript
// src/index.ts
const tools: Tool[] = [
  // ... existing tools
  {
    name: 'generateMyThing',
    description: 'Description...',
    inputSchema: {
      type: 'object',
      properties: {
        // Define input parameters
      },
      required: ['param1']
    }
  }
];

// Add handler
if (name === 'generateMyThing') {
  result = await toolGenerateMyThing(args as any);
}
```

---

## 📋 Resource Management

### Available Resources

1. **website://templates** - Website templates
2. **website://components** - UI components  
3. **website://generators** - Available generators

### Accessing Resources

```typescript
// From Claude
const templates = await getResource('website://templates');

// Returns JSON with available templates
{
  "templates": [
    { "id": "landing", "name": "Landing Page" },
    { "id": "blog", "name": "Blog" }
  ]
}
```

### Adding New Resources

```typescript
// In src/index.ts
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      // ... existing resources
      {
        uri: 'website://my-resource',
        name: 'My Resource',
        description: 'Description',
        mimeType: 'application/json'
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === 'website://my-resource') {
    return {
      contents: [{
        uri: 'website://my-resource',
        mimeType: 'application/json',
        text: JSON.stringify({ /* data */ })
      }]
    };
  }
});
```

---

## 🔍 Error Handling

### Error Flow

```
Generator Function
    ↓
Try-Catch Block
    ↓
Logger.error() Called
    ↓
ApiError Thrown
    ↓
Tool Handler Catches
    ↓
Returns Error Response
```

### Example Error Handling

```typescript
try {
  const code = await toolGenerateReactPage(args);
  return { success: true, code, ... };
} catch (error) {
  logger.error('Tool execution failed', { toolName: 'generateReactPage', error });
  
  return {
    content: [{
      type: 'text',
      text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }],
    isError: true
  };
}
```

---

## 📝 Logging Best Practices

```typescript
// Log operations
logger.info('Starting tool execution', { toolName, params });

// Log successes
logger.info('Tool executed successfully', { toolName, duration: 'ms' });

// Log errors with context
logger.error('Tool execution failed', { toolName, error, args });

// Log warnings
logger.warn('Deprecated feature used', { feature: 'oldAPI' });

// Log debug info
logger.debug('Internal state', { state: stateValue });
```

---

## 🧪 Testing Tools

### Local Testing

```bash
# Build the project
npm run build

# Test individual tool via stdin
echo '{"toolName": "generateReactPage", "args": {"pageName": "Test"}}' | node dist/index.js
```

### Integration Testing

```typescript
import { toolGenerateReactPage } from './tools/codeGenerationTools.js';

// Test tool directly
const result = await toolGenerateReactPage({
  pageName: 'TestComponent',
  componentType: 'functional',
  useHooks: true
});

console.assert(result.success === true);
console.assert(result.fileName === 'TestComponent.tsx');
```

---

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

```env
LOG_LEVEL=info
NODE_ENV=production
MCP_SERVER_NAME=ai-website-generator-mcp
MCP_SERVER_VERSION=1.0.0
```

### Monitoring

```bash
# Watch logs
tail -f logs/combined.log

# Check errors only
tail -f logs/error.log
```

---

## 🎓 Best Practices

### Code Generation
✅ Validate all inputs
✅ Use TypeScript interfaces
✅ Include error handling
✅ Log all operations
✅ Return meaningful results

### Architecture
✅ Separate concerns (generators, services, tools)
✅ Use dependency injection
✅ Implement error boundaries
✅ Document complex logic
✅ Use type safety

### Performance
✅ Cache frequently used data
✅ Use async/await
✅ Avoid blocking operations
✅ Implement request timeouts
✅ Monitor resource usage

---

## 📞 Troubleshooting

### Tool Not Found
- Check tool is registered in `ListToolsRequestSchema` handler
- Verify handler in `CallToolRequestSchema`
- Check tool name matches exactly

### Generation Failures
- Check logger output in `logs/combined.log`
- Validate input parameters match schema
- Test generator directly in code

### MCP Connection Issues
- Ensure Node.js version 18+
- Check environment variables
- Verify dependencies installed (`npm install`)
- Review MCP protocol logs

---

## 📚 Additional Resources

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Winston Logger Docs](https://github.com/winstonjs/winston)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/guide.html)
- [Mongoose Schema](https://mongoosejs.com/docs/guide.html)

---

**MCP Server v1.0.0 - Production Ready** ✅
