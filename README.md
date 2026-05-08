# AI Website Generator

A full-stack application for generating AI-powered websites using React, Express, MongoDB, and Model Context Protocol (MCP).

## 🚀 Features

- **React Frontend**: Modern UI with React Router, Tailwind CSS, and Zustand state management
- **Express Backend**: RESTful API with MongoDB integration and JWT authentication
- **MCP Server**: AI-powered tools for website generation and optimization
- **User Authentication**: JWT-based secure authentication with bcrypt password hashing
- **Website Management**: Create, read, update, and delete websites with customizable templates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation across all modules
- **Scalable Architecture**: Modular monorepo structure with shared types and utilities

## 📋 Prerequisites

- **Node.js**: 18+ (includes npm)
- **MongoDB**: 5.0+ (local or cloud)
- **Git**: For version control
- **Docker**: (Optional) For running MongoDB

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-website-generator
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for all modules:
- Frontend (React + Vite + Tailwind)
- Backend (Express + Mongoose)
- MCP Server
- Shared utilities

### 3. Configure Environment Variables

#### Frontend Configuration (Optional - uses defaults)

```bash
cd frontend
cp .env.example .env
# VITE_API_URL defaults to http://localhost:3000
```

#### Backend Configuration

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

#### MCP Server Configuration

```bash
cd ../mcp-server
cp .env.example .env
```

Edit `mcp-server/.env`:
```env
PORT=3001
NODE_ENV=development
BACKEND_API_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key-here
```

### 4. Start MongoDB

```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use existing MongoDB installation
mongod
```

### 5. Start Development Servers

Open separate terminals for each service:

```bash
# Terminal 1: Frontend (React on http://localhost:5173)
npm run dev:frontend

# Terminal 2: Backend (Express on http://localhost:3000)
npm run dev:backend

# Terminal 3: MCP Server (on http://localhost:3001)
npm run dev:mcp
```

## 📱 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MCP Server**: http://localhost:3001

## 📦 Project Structure

```
ai-website-generator/
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      # Header, Sidebar, Footer, MainLayout
│   │   │   └── ProtectedRoute.tsx
│   │   ├── config/
│   │   │   └── routes.tsx   # Route definitions
│   │   ├── pages/           # 8 pages (Login, Register, Dashboard, etc)
│   │   ├── store/           # Zustand stores (auth, app)
│   │   ├── services/        # API client
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css        # Global Tailwind styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── FRONTEND_COMPLETE.md # Frontend overview
│
├── backend/               # Express + MongoDB backend
│   ├── src/
│   │   ├── server.ts     # Entry point
│   │   ├── routes/       # API routes (auth, websites)
│   │   ├── models/       # MongoDB schemas (User, Website)
│   │   ├── middleware/   # Auth, error handling
│   │   ├── controllers/  # Request handlers
│   │   └── config/       # Database config
│   ├── package.json
│   └── tsconfig.json
│
├── mcp-server/           # Model Context Protocol server
│   ├── src/
│   │   ├── index.ts      # MCP server
│   │   └── tools/        # Website generation tools
│   ├── package.json
│   └── tsconfig.json
│
├── shared/               # Shared types and utilities
│   ├── src/
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Shared utilities
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                 # Project documentation
│   ├── api/             # API reference
│   ├── architecture/    # Architecture diagrams
│   ├── setup/          # Setup guides
│   └── README.md        # Documentation index
│
├── package.json          # Monorepo configuration
└── README.md            # This file
```

## 🎨 Frontend Pages

The React frontend includes 8 pages:

| Page | Route | Features | Auth |
|------|-------|----------|------|
| **Login** | `/login` | Email/password auth, remember me, link to register | No |
| **Register** | `/register` | Full name, email, password confirmation | No |
| **Dashboard** | `/dashboard` | Stats cards, website grid, empty state | Yes |
| **Projects** | `/projects` | Project management interface | Yes |
| **Templates** | `/templates` | 6 pre-built website templates | Yes |
| **AI Generator** | `/generator` | Prompt-based website generation | Yes |
| **Settings** | `/settings` | Account, notifications, appearance, danger zone | Yes |
| **404** | `/*` | Not found page | N/A |

### Sidebar Navigation
The sidebar displays 5 menu items with icons:
- 🏠 Dashboard
- 📁 Projects
- 🎨 Templates
- ✨ AI Generator
- ⚙️ Settings

### Layout Components
- **Header** - Logo, app name, user profile, logout button
- **Sidebar** - Responsive navigation (hidden on mobile, toggleable)
- **Footer** - Links, social icons, copyright

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Websites
- `GET /api/websites` - List user's websites (protected)
- `GET /api/websites/:id` - Get website details (protected)
- `POST /api/websites` - Create website (protected)
- `PUT /api/websites/:id` - Update website (protected)
- `DELETE /api/websites/:id` - Delete website (protected)

See [API Documentation](./docs/api/README.md) for detailed information.

## 🚀 Building for Production

### Build All Modules

```bash
npm run build
```

### Build Individual Modules

```bash
npm run build:frontend  # React build
npm run build:backend   # TypeScript compilation
npm run build:mcp      # MCP server build
npm run build:shared   # Shared types build
```

### Output Directories
- Frontend: `frontend/dist/`
- Backend: `backend/dist/`
- MCP Server: `mcp-server/dist/`
- Shared: `shared/dist/`

## 📚 Documentation

- **Setup Guide**: [docs/setup/SETUP.md](./docs/setup/SETUP.md)
- **API Reference**: [docs/api/README.md](./docs/api/README.md)
- **Architecture**: [docs/architecture/README.md](./docs/architecture/README.md)
- **Contributing**: [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test them
3. Commit with descriptive messages: `git commit -m "feat: add new feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

See [Contributing Guidelines](./docs/CONTRIBUTING.md) for more details.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- Verify database name

### Port Already in Use
- Change `PORT` in respective `.env` file
- Or kill process using the port

### Module Not Found Errors
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
npm run typecheck
```

## 📊 Technology Stack

### Frontend
- React 18
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Vite
- React Router

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- CORS
- Axios

### MCP Server
- @modelcontextprotocol/sdk
- TypeScript
- Axios

### Shared
- TypeScript
- No external dependencies

## 🔐 Security

- JWT tokens for API authentication
- bcrypt for password hashing
- CORS for cross-origin protection
- Environment variables for sensitive data
- Input validation and error handling

## 📈 Performance

- Vite for fast frontend builds
- Optimized MongoDB queries
- Caching ready (Redis)
- Lazy loading components

## 🗺️ Roadmap

- [ ] User profile management
- [ ] Website templates library
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Custom domain support
- [ ] Email notifications
- [ ] Payment integration
- [ ] AI image generation

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- Open an issue for bugs
- Check documentation first
- Review existing issues

## 👥 Team

- Frontend: React development
- Backend: Node.js + Express
- DevOps: Deployment and infrastructure
- AI: MCP integration and tools

---

**Happy Building! 🎉**
// Use typed hooks instead of useDispatch and useSelector
```

### Making API Calls
```typescript
import { apiClient } from '@/utils/apiClient';

const data = await apiClient.get('/endpoint');
const response = await apiClient.post('/endpoint', { data });
```

### Adding Routes
Edit `src/routes/routes.tsx`:
```typescript
{
  path: '/new-page',
  element: <NewPage />,
}
```

## Environment Variables
Create a `.env` file based on `.env.example`:
```
VITE_API_URL=http://localhost:3000/api
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT

## Author
Prashant-ai23
```
