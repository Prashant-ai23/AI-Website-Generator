# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB 5.0+
- Git

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-website-generator
```

### 2. Install dependencies

Install dependencies for all modules:

```bash
npm install
```

This will install dependencies for:
- Frontend
- Backend
- MCP Server
- Shared utilities

### 3. Environment Configuration

#### Backend Setup

Copy the environment template and update with your values:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-website-generator
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MCP_SERVER_URL=http://localhost:3001
```

#### MCP Server Setup

```bash
cd mcp-server
cp .env.example .env
```

Edit `mcp-server/.env`:

```env
PORT=3001
NODE_ENV=development
BACKEND_API_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key-here
```

### 4. Database Setup

Make sure MongoDB is running:

```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or if MongoDB is installed locally
mongod
```

### 5. Start Development Servers

In separate terminals:

```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: MCP Server
cd mcp-server
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MCP Server: http://localhost:3001

## Building for Production

### Build all modules

```bash
npm run build
```

### Build individual modules

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build

# MCP Server
cd mcp-server && npm run build

# Shared
cd shared && npm run build
```

## Troubleshooting

### MongoDB Connection Issues

If you get a connection error:

1. Verify MongoDB is running
2. Check the `MONGODB_URI` in `.env`
3. Ensure the database name is correct

### Port Already in Use

If a port is already in use, update the `PORT` in the respective `.env` file.

### Module Import Errors

If you encounter module import errors:

1. Ensure all dependencies are installed: `npm install`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Rebuild TypeScript: `npm run build`

## Next Steps

- See [API Documentation](../api/README.md)
- See [Architecture Documentation](../architecture/README.md)
- Check [Contributing Guidelines](../CONTRIBUTING.md)
