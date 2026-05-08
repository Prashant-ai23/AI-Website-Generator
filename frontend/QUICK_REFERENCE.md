# 🎨 React Frontend - Quick Reference

## Running the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment (optional, uses defaults)
cp .env.example .env

# Start development server
npm run dev

# Open http://localhost:5173
```

## Key Features

✅ **Zustand State Management** - Lightweight auth & UI state  
✅ **React Router 6** - Client-side routing with protected routes  
✅ **Tailwind CSS** - Responsive utility-first styling  
✅ **Axios** - Preconfigured HTTP client with interceptors  
✅ **TypeScript** - Full type safety  
✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Dark Sidebar** - Modern UI with light content area  

## Pages & Routes

| Route | Component | Status | Auth Required |
|-------|-----------|--------|---|
| `/login` | LoginPage | ✅ Ready | No |
| `/register` | RegisterPage | ✅ Ready | No |
| `/dashboard` | DashboardPage | ✅ Ready | Yes |
| `/projects` | ProjectsPage | ✅ Ready | Yes |
| `/templates` | TemplatesPage | ✅ Ready | Yes |
| `/generator` | GeneratorPage | ✅ Ready | Yes |
| `/settings` | SettingsPage | ✅ Ready | Yes |
| `*` | NotFoundPage | ✅ Ready | No |

## Sidebar Menu

```
Dashboard     (Dashboard stats & websites)
Projects      (Project management)
Templates     (6 pre-built templates)
AI Generator  (Prompt-based generation)
Settings      (Account & preferences)
```

## Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx        (Top nav, user menu)
│   │   ├── Sidebar.tsx       (Left menu, responsive)
│   │   ├── Footer.tsx        (Bottom footer)
│   │   └── MainLayout.tsx    (Layout wrapper)
│   └── ProtectedRoute.tsx    (Auth guard)
│
├── config/
│   └── routes.tsx            (Route definitions)
│
├── pages/                    (8 pages)
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProjectsPage.tsx
│   ├── TemplatesPage.tsx
│   ├── GeneratorPage.tsx
│   ├── SettingsPage.tsx
│   └── NotFoundPage.tsx
│
├── store/                    (Zustand stores)
│   ├── authStore.ts          (Auth state)
│   └── appStore.ts           (UI state)
│
├── services/
│   └── apiClient.ts          (Axios client)
│
├── App.tsx
├── main.tsx
└── index.css                 (Tailwind + custom)
```

## Tailwind Classes

**Buttons:**
- `btn-primary` - Blue, filled
- `btn-secondary` - Gray, filled
- `btn-ghost` - Transparent
- `btn-base` - Base styles

**Inputs:**
- `input-base` - Form inputs with focus state

**Cards:**
- `card` - Container with shadow
- `card-hover` - Interactive card

## State Management

**Auth Store:**
```typescript
const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

**App Store:**
```typescript
const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useAppStore();
```

## API Client

Pre-configured methods:
```typescript
// Auth
apiClient.register(email, password, name)
apiClient.login(email, password)
apiClient.getCurrentUser()

// Websites
apiClient.getWebsites()
apiClient.getWebsite(id)
apiClient.createWebsite(data)
apiClient.updateWebsite(id, data)
apiClient.deleteWebsite(id)
```

## Responsive Breakpoints

- **Mobile** (< 640px) - Full screen, sidebar hidden
- **Tablet** (640px-1024px) - Adapted layout
- **Desktop** (> 1024px) - Sidebar always visible

## Environment

```bash
VITE_API_URL=http://localhost:3000  # API endpoint
```

## Build & Deploy

```bash
# Production build
npm run build

# Preview build
npm run preview

# Output: dist/ folder
```

## Development Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview prod build
npm run lint          # Check code style
npm run type-check    # TypeScript check
```

## Features Showcase

### 📊 Dashboard
- Statistics cards (total, published, drafts, storage)
- Website grid with edit/view actions
- Loading and empty states

### 🔐 Authentication
- Login with email/password
- Registration with confirmation
- Protected routes
- Auto redirect on 401

### 🎨 Templates
- 6 template cards
- Visual icons
- Use template buttons

### ⚡ AI Generator
- Textarea for prompts
- Dropdown for industry
- Example prompts
- Generation status

### ⚙️ Settings
- Account info (name, email)
- Notification preferences
- Theme selection
- Danger zone (delete account)

## Colors

- **Primary:** Sky blue (#0ea5e9)
- **Dark:** Gray 900 (#111827)
- **Light:** Gray 50 (#f9fafb)
- **Success:** Green (#10b981)
- **Warning:** Yellow (#f59e0b)
- **Error:** Red (#ef4444)

## Icons (Lucide React)

- Menu, LogOut, Settings (Header)
- LayoutDashboard, Folder, Palette, Wand2 (Sidebar)
- Plus, Loader, AlertCircle (Components)
- Mail, Lock, User, Sparkles (Forms)
- Save, Bell, Palette, Trash2 (Settings)

## Performance

- ⚡ Vite fast refresh
- 📦 Code splitting per route
- 🎯 Optimized bundles
- 🚀 Fast page loads

## Next Steps

1. Install: `npm install`
2. Configure: `cp .env.example .env`
3. Run: `npm run dev`
4. Visit: `http://localhost:5173`
5. Login or register
6. Explore features

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API errors | Check backend on port 3000 |
| Styles not loading | Restart dev server |
| TypeScript errors | Run `npm run type-check` |
| Port in use | Change in vite.config.ts |

## Documentation

- [Setup Guide](./SETUP.md)
- [Main README](./README.md)
- [Root README](../README.md)
- [API Docs](../docs/api/README.md)

---

**Ready to start? Run `npm run dev` and open http://localhost:5173! 🚀**
