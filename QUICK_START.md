# 🚀 Quick Start Guide

Get the AI Website Generator running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB installed or Docker available
- Git installed

## Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

This installs all dependencies for the monorepo (frontend, backend, MCP server, shared).

## Step 2: Configure Environment (1 minute)

### Backend Configuration
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` - The defaults should work for local development:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-website-generator
JWT_SECRET=your-secret-key-here
```

### Frontend Configuration (Optional)
```bash
cd ../frontend
cp .env.example .env
```

The frontend defaults to `http://localhost:3000` for the API.

### MCP Server Configuration (Optional)
```bash
cd ../mcp-server
cp .env.example .env
```

## Step 3: Start MongoDB (1 minute)

### Option A: Using Docker (Recommended)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option B: Using Local MongoDB
```bash
mongod
```

## Step 4: Start Development Servers (1 minute)

Open **3 separate terminals** and run:

### Terminal 1: Frontend
```bash
npm run dev:frontend
```
Opens on http://localhost:5173

### Terminal 2: Backend
```bash
npm run dev:backend
```
Starts on http://localhost:3000

### Terminal 3: MCP Server
```bash
npm run dev:mcp
```
Starts on http://localhost:3001

## Step 5: Access the Application (1 minute)

1. Open http://localhost:5173 in your browser
2. Click **Create account**
3. Fill in name, email, password
4. Click **Register**
5. You're logged in! 🎉

## 📱 Explore the Application

### Dashboard
- See stats and your websites
- View total, published, and draft sites
- Access website grid

### Templates
- Browse 6 pre-built templates
- Click "Use Template" to start

### AI Generator
- Enter a prompt (e.g., "Tech startup website")
- Click examples or generate
- AI creates website ideas

### Settings
- Update account info
- Toggle notifications
- Change theme (light/dark)

### Projects
- Coming soon feature

## 🔧 Useful Commands

```bash
# Start all services together
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests (if configured)
npm run test
```

## 📂 File Structure

```
ai-website-generator/
├── frontend/    # React app (port 5173)
├── backend/     # Express API (port 3000)
├── mcp-server/  # MCP server (port 3001)
├── shared/      # Shared types
└── docs/        # Documentation
```

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows
```

### "Cannot connect to MongoDB"
- Check if MongoDB is running
- Verify `MONGODB_URI` in `backend/.env`
- If using Docker: `docker logs mongodb`

### "Cannot connect to API"
- Verify backend is running on port 3000
- Check `VITE_API_URL` in `frontend/.env`
- Open http://localhost:3000 to verify

### "Blank page in browser"
- Check browser console (F12) for errors
- Verify all services are running
- Try clearing cache and refreshing

## 📚 Learn More

- **Frontend**: Read `frontend/SETUP.md`
- **Backend**: Read `docs/setup/SETUP.md`
- **API Reference**: Read `docs/api/README.md`
- **Architecture**: Read `frontend/ARCHITECTURE.md`

## ✨ What's Included

- ✅ React frontend with 8 pages
- ✅ Express backend API
- ✅ MongoDB database
- ✅ JWT authentication
- ✅ Responsive design
- ✅ Tailwind CSS styling
- ✅ TypeScript everywhere
- ✅ MCP server integration

## 🎯 Next Steps After Setup

1. ✅ Register and login
2. ✅ Explore all pages
3. ✅ Test AI Generator
4. ✅ Read documentation
5. ✅ Start customizing

## 💡 Pro Tips

- Frontend hot-reloads on file changes
- Backend auto-restarts with tsx
- Check console errors (F12 in browser)
- Use Thunder Client or Postman for API testing
- Sidebar menu hides on mobile (tap hamburger)

## 🚀 Ready?

```bash
# Start the app
npm install
npm run dev:frontend &
npm run dev:backend &
npm run dev:mcp &
```

Open http://localhost:5173 and start building! 🎉

---

**Need help?** Check `PROJECT_COMPLETE.md` for detailed information.

## Monorepo Commands

Run from the root directory:

```bash
# Install all dependencies
npm install

# Build all modules
npm run build

# Run development servers (all at once, requires &)
npm run dev:frontend &
npm run dev:backend &
npm run dev:mcp &

# Or build individual modules
npm run build:frontend
npm run build:backend
npm run build:mcp
npm run build:shared
```

## API Testing

Use Postman or Insomnia to test API endpoints:

1. **Register**: POST `http://localhost:3000/api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "name": "John Doe"
   }
   ```

2. **Login**: POST `http://localhost:3000/api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Create Website**: POST `http://localhost:3000/api/websites`
   - Headers: `Authorization: Bearer <token>`
   ```json
   {
     "title": "My Website",
     "description": "My awesome website",
     "theme": "default"
   }
   ```

See [API Documentation](./docs/api/README.md) for more endpoints.

## Troubleshooting

### Port Conflicts
If port is already in use, change in `.env`:
- Frontend: Vite uses 5173, change in vite.config.ts
- Backend: Change PORT in backend/.env
- MCP: Change PORT in mcp-server/.env

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh  # MongoDB client
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

## Next Steps

- Read [Setup Guide](./docs/setup/SETUP.md)
- Review [Architecture](./docs/architecture/README.md)
- Check [Contributing](./docs/CONTRIBUTING.md)
