# 🚀 AI Website Generator - MCP Server

Model Context Protocol (MCP) Server for the AI Website Generator project. Provides intelligent code generation tools for React components, Express APIs, MongoDB schemas, UI menus, and project documentation.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Tools](#tools)
- [Architecture](#architecture)
- [Usage](#usage)
- [Logging](#logging)
- [Development](#development)

---

## 🎯 Overview

The MCP Server acts as a bridge between Claude AI and the AI Website Generator project, enabling:

- **Code Generation** - Generate React components, Express APIs, and MongoDB schemas
- **UI Generation** - Create sidebar menus and navigation components
- **Documentation** - Generate comprehensive project documentation
- **Resource Management** - Access templates, components, and generators
- **Logging & Monitoring** - Full logging with Winston logger

**Technology Stack:**
- Node.js with TypeScript
- Model Context Protocol SDK 0.3.1
- Express.js patterns
- MongoDB/Mongoose integration
- Winston logging

---

## ✨ Features

### Core Features
✅ **5 Code Generation Tools**
- React Page Generator
- Express API Generator
- MongoDB Schema Generator
- Sidebar Menu Generator
- Documentation Generator

✅ **Resource Management**
- Website templates
- UI components
- Available generators

✅ **Production-Ready**
- Comprehensive error handling
- Full TypeScript support
- Winston logging with file output
- Async/await patterns

✅ **Type Safety**
- Full TypeScript interfaces
- Strict type checking
- IDE autocomplete support

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Navigate to MCP server directory
cd mcp-server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Build TypeScript
npm run build

# Start development server
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```env
# Logging
LOG_LEVEL=info              # debug, info, warn, error
MCP_SERVER_PORT=3001       # MCP Server port (if using HTTP)
NODE_ENV=development       # development or production

# Server
MCP_SERVER_NAME=ai-website-generator-mcp
MCP_SERVER_VERSION=1.0.0
```

### Project Structure

```
src/
├── index.ts                     # Main MCP server
├── generators/                  # Code generators
│   ├── reactPageGenerator.ts    # React component generation
│   ├── expressAPIGenerator.ts   # Express route generation
│   ├── mongoSchemaGenerator.ts  # Mongoose schema generation
│   ├── sidebarMenuGenerator.ts  # React menu component generation
│   └── documentationGenerator.ts # Markdown documentation
├── tools/                       # MCP tool wrappers
│   └── codeGenerationTools.ts   # All tool implementations
├── services/                    # Business logic services
├── utils/
│   └── logger.ts               # Winston logger setup
└── prompts/                    # Prompt templates
```

---

## 🛠️ Tools

### 1. **generateReactPage**

Generate React components with TypeScript support, hooks, and styling.

**Input:**
```json
{
  "pageName": "Dashboard",
  "componentType": "functional",
  "useHooks": true,
  "withTypeScript": true,
  "withStyles": true,
  "imports": ["import { useSelector } from 'react-redux'"]
}
```

**Output:**
- React TypeScript component
- File name suggestion
- Success message

**Features:**
- Functional & class components
- React hooks support
- TypeScript interfaces
- CSS file imports
- Custom imports

---

### 2. **generateExpressAPI**

Generate Express.js routes with controller methods and middleware.

**Input:**
```json
{
  "routeName": "users",
  "methods": ["GET", "POST", "PUT", "DELETE"],
  "withValidation": true,
  "withErrorHandling": true,
  "withAuth": true
}
```

**Output:**
- Express router with all methods
- Controller methods for each HTTP verb
- Middleware integration
- Error handling wrapper

**Features:**
- RESTful route design
- Multiple HTTP methods
- Authentication middleware
- Validation middleware
- Async error handling

---

### 3. **generateMongoSchema**

Generate Mongoose schemas with validation, indexes, and hooks.

**Input:**
```json
{
  "modelName": "user",
  "fields": [
    {
      "name": "email",
      "type": "String",
      "required": true,
      "unique": true,
      "index": true
    },
    {
      "name": "name",
      "type": "String",
      "required": true
    },
    {
      "name": "createdAt",
      "type": "Date",
      "default": "Date.now"
    }
  ],
  "withTimestamps": true,
  "withMethods": true,
  "withIndexes": true
}
```

**Output:**
- Mongoose schema definition
- Model export
- Pre/post hooks
- Custom methods

**Features:**
- Multiple field types
- Validation rules
- Database indexes
- Pre-save hooks
- Schema methods
- Virtual fields

---

### 4. **generateSidebarMenu**

Generate React sidebar menu component with nested items.

**Input:**
```json
{
  "menuItems": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "path": "/dashboard",
      "icon": "📊"
    },
    {
      "id": "projects",
      "label": "Projects",
      "icon": "📁",
      "children": [
        {
          "id": "my-projects",
          "label": "My Projects",
          "path": "/projects"
        }
      ]
    }
  ],
  "style": "vertical",
  "theme": "light",
  "withIcons": true,
  "withCollapse": true
}
```

**Output:**
- React TypeScript component
- CSS styling hooks
- Collapsible functionality

**Features:**
- Nested menu items
- Icon support
- Badge support
- Collapsible submenus
- Light/dark themes
- Vertical/horizontal layouts

---

### 5. **generateDocumentation**

Generate comprehensive project documentation in Markdown.

**Input:**
```json
{
  "projectName": "My Awesome Project",
  "sections": [
    {
      "title": "Features",
      "content": "List of amazing features...",
      "codeExamples": ["console.log('Hello');"]
    }
  ],
  "includeTableOfContents": true,
  "includeInstallation": true,
  "includeUsage": true,
  "includeLicense": true
}
```

**Output:**
- Markdown documentation
- Table of contents
- Code examples
- API documentation section

**Features:**
- Auto-generated table of contents
- Installation instructions
- Usage examples
- API documentation
- Contributing guidelines
- License section

---

## 🏗️ Architecture

### Data Flow

```
Claude AI Client
    ↓
MCP Protocol (stdio)
    ↓
MCP Server (index.ts)
    ↓
Tool Registry (ListTools)
    ↓
Tool Executor (CallTool)
    ↓
Code Generator (generators/)
    ↓
Logger (utils/logger.ts)
    ↓
Response to Client
```

### Tool Execution Pipeline

```
Request → Validation → Logger.info → Generator → Result Processing → Logger.success → Response
                                        ↓
                                     Error Caught
                                        ↓
                                    Logger.error → Error Response
```

### Resource Management

**Available Resources:**
1. **website://templates** - Website templates
2. **website://components** - UI components
3. **website://generators** - Available generators

---

## 💻 Usage

### Development

```bash
# Start development with watch mode
npm run dev

# Build TypeScript
npm run build

# Run linting
npm run lint

# Run production
npm run start
```

### With Claude

The MCP server integrates with Claude through the Model Context Protocol:

```
Claude: "Generate a React dashboard component with hooks"
    ↓
Claude calls → generateReactPage
    Arguments: {
      pageName: "Dashboard",
      componentType: "functional",
      useHooks: true
    }
    ↓
MCP Server processes and returns code
    ↓
Claude receives component code and integrates it
```

### Example Tool Calls

**Generate React Page:**
```typescript
const result = await callTool('generateReactPage', {
  pageName: 'UserProfile',
  componentType: 'functional',
  useHooks: true,
  withTypeScript: true
});
```

**Generate Express API:**
```typescript
const result = await callTool('generateExpressAPI', {
  routeName: 'products',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  withAuth: true
});
```

---

## 📝 Logging

### Winston Logger Configuration

Log levels: `debug`, `info`, `warn`, `error`

**Log Output:**
- **Console:** Colored, human-readable format
- **Files:**
  - `logs/error.log` - Errors only
  - `logs/combined.log` - All logs

### Example Logs

```
2026-05-07 14:23:45 [info] MCP Server initializing...
2026-05-07 14:23:46 [info] Tool called: generateReactPage { pageName: 'Dashboard' }
2026-05-07 14:23:46 [info] React page generated successfully { pageName: 'Dashboard', lines: 42 }
```

### Log Entry Format

```json
{
  "level": "info",
  "message": "Tool executed successfully",
  "timestamp": "2026-05-07 14:23:46",
  "toolName": "generateReactPage",
  "service": "mcp-server"
}
```

---

## 👨‍💻 Development

### Adding New Tools

1. **Create Generator:**
```typescript
// src/generators/myGenerator.ts
export async function generateMyThing(options: MyOptions): Promise<string> {
  // Implementation
  return result;
}
```

2. **Create Tool Wrapper:**
```typescript
// src/tools/codeGenerationTools.ts
export async function toolGenerateMyThing(args: MyArgs): Promise<{ success: boolean; ... }> {
  // Call generator and format result
}
```

3. **Register in MCP Server:**
```typescript
// src/index.ts
const tools: Tool[] = [
  // ... existing tools
  {
    name: 'generateMyThing',
    description: 'Description...',
    inputSchema: { ... }
  }
];
```

### Code Style

- **TypeScript:** Strict mode enabled
- **Async/Await:** Preferred over callbacks
- **Error Handling:** Try-catch with logging
- **Logging:** Winston logger for all operations

### Testing

```bash
# Test tool output locally
npm run build
node dist/index.ts < test-input.json
```

---

## 🔧 Troubleshooting

### Common Issues

**MCP Server won't start:**
```bash
# Check Node.js version (need 18+)
node --version

# Rebuild dependencies
rm -rf node_modules
npm install
npm run build
```

**Generator errors:**
```bash
# Check logs
tail -f logs/combined.log

# Validate input schema
npm run lint
```

**Missing modules:**
```bash
npm install @modelcontextprotocol/sdk
npm install winston
```

---

## 📚 Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Winston Logger](https://github.com/winstonjs/winston)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ✅ Status

**MCP Server Status:** ✅ Production Ready

```
✅ 5 Code Generation Tools
✅ Resource Management
✅ Winston Logging
✅ TypeScript Support
✅ Error Handling
✅ Full Documentation
```

---

**Made with ❤️ for the AI Website Generator**
