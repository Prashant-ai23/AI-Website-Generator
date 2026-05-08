# Frontend - AI Website Generator

React + TypeScript frontend application for AI Website Generator.

## Features

- 🎨 **Modern UI** - Built with Tailwind CSS
- 🎯 **React Router** - Client-side routing
- 🗄️ **Zustand** - Lightweight state management
- 🔐 **Authentication** - JWT-based auth with protected routes
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Vite** - Fast development and build
- 🧪 **TypeScript** - Full type safety

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- React Router 6
- Zustand 4
- Axios
- Lucide React Icons

## Installation

```bash
cd frontend
npm install
```

## Configuration

```bash
# Copy environment template
cp .env.example .env

# Update with your API URL (optional, defaults to http://localhost:3000)
# VITE_API_URL=http://localhost:3000
```

## Development

```bash
npm run dev
```

Runs on: `http://localhost:5173`

## Building

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Type Checking

```bash
npm run type-check
```

## Project Structure

```
src/
├── components/
│   ├── layout/           # Layout components (Header, Sidebar, Footer)
│   └── ProtectedRoute.tsx
├── config/
│   └── routes.tsx        # Route configuration
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProjectsPage.tsx
│   ├── TemplatesPage.tsx
│   ├── GeneratorPage.tsx
│   ├── SettingsPage.tsx
│   └── NotFoundPage.tsx
├── store/
│   ├── authStore.ts      # Authentication store (Zustand)
│   └── appStore.ts       # App UI store (Zustand)
├── services/
│   └── apiClient.ts      # Axios API client
├── types/
├── App.tsx
├── main.tsx
└── index.css
```

## Features

### Pages

- **Login/Register** - Authentication pages
- **Dashboard** - Main dashboard with website statistics
- **Projects** - Project management (coming soon)
- **Templates** - Pre-built website templates
- **AI Generator** - AI-powered website generation
- **Settings** - User account and preference settings

### Components

- **Header** - Top navigation with user menu
- **Sidebar** - Navigation menu with responsive toggle
- **Footer** - Footer with links and social

### State Management

Uses Zustand for:
- Authentication state (user, token, login status)
- App UI state (sidebar visibility, theme)

### API Integration

Axios client with:
- Automatic token injection
- Error handling and redirect on 401
- Base URL configuration

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Responsive navigation with mobile sidebar toggle
- Touch-friendly interface

## Performance

- Code splitting with React Router
- Lazy loading of pages
- Optimized bundle with Vite

## Environment Variables

```env
# API URL (optional, defaults to http://localhost:3000)
VITE_API_URL=http://localhost:3000
```

## Available Routes

- `/` - Redirects to dashboard
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (protected)
- `/projects` - Projects page (protected)
- `/templates` - Templates page (protected)
- `/generator` - AI Generator page (protected)
- `/settings` - Settings page (protected)
- `/*` - 404 Not Found page

## Getting Started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Ensure backend is running on port 3000
4. Run dev server: `npm run dev`
5. Open http://localhost:5173
6. Login or register to access the app

## Building for Production

```bash
npm run build
npm run preview
```

Output directory: `dist/`

## Contributing

Follow the project's contributing guidelines and code style.

## License

MIT
