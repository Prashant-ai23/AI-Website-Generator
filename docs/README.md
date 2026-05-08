# AI Website Generator - Project Structure

## Overview
This is a full-stack monorepo for the AI Website Generator application, a comprehensive platform for creating AI-powered websites with modern web technologies.

## Project Structure

```
ai-website-generator/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Express + MongoDB backend
│   ├── src/
│   │   ├── server.ts        # Main server file
│   │   ├── config/          # Configuration
│   │   ├── middleware/      # Middleware (auth, error handling)
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   └── utils/           # Utilities
│   ├── package.json
│   └── tsconfig.json
│
├── mcp-server/              # MCP (Model Context Protocol) server
│   ├── src/
│   │   ├── index.ts         # MCP server entry point
│   │   └── tools/           # MCP tools
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                  # Shared types and utilities
│   ├── src/
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Shared utilities
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                    # Project documentation
│   ├── api/                 # API documentation
│   ├── architecture/        # Architecture documentation
│   ├── setup/               # Setup guides
│   └── CONTRIBUTING.md      # Contributing guidelines
│
├── package.json             # Root package.json (monorepo)
└── README.md               # Main README
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool
- **Redux Toolkit** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### MCP Server
- **@modelcontextprotocol/sdk** - MCP protocol
- **TypeScript** - Type safety

### Shared
- **TypeScript** - Type definitions and utilities

## Key Features

1. **User Authentication**
   - JWT-based authentication
   - Secure password hashing with bcrypt
   - User registration and login

2. **Website Management**
   - Create, read, update, delete websites
   - Multiple template support
   - Theme customization
   - Content management

3. **AI Integration**
   - MCP-based AI tool interface
   - Website generation
   - Content analysis
   - Performance optimization

4. **Modern UI**
   - Responsive design with Tailwind CSS
   - Component-based architecture
   - State management with Redux

## Getting Started

See [Setup Guide](./setup/SETUP.md) for detailed instructions.

### Quick Start

```bash
# Install dependencies for all modules
npm install

# Start development servers
npm run dev

# Build all modules
npm run build
```

## Environment Configuration

Each module has its own `.env.example` file:
- `backend/.env.example`
- `mcp-server/.env.example`
- `frontend/.env.example` (if needed)

## API Endpoints

See [API Documentation](./api/README.md) for complete endpoint reference.

## Contributing

See [Contributing Guidelines](./CONTRIBUTING.md)

## License

MIT
