# Frontend Setup Guide

## Prerequisites

- Node.js 18+ (with npm)
- Basic knowledge of React and TypeScript
- API backend running on http://localhost:3000

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs all dependencies including:
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Zustand
- Axios
- Lucide React (icons)

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit if needed (defaults work locally)
# VITE_API_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

Opens http://localhost:5173

### 4. Login/Register

- Create a new account or login
- You'll be redirected to the dashboard

## Development

### Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Top navigation
│   │   ├── Sidebar.tsx        # Left sidebar menu
│   │   ├── Footer.tsx         # Bottom footer
│   │   ├── MainLayout.tsx     # Layout wrapper
│   │   └── index.ts
│   └── ProtectedRoute.tsx     # Route protection
├── config/
│   └── routes.tsx             # All routes
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProjectsPage.tsx
│   ├── TemplatesPage.tsx
│   ├── GeneratorPage.tsx
│   ├── SettingsPage.tsx
│   ├── NotFoundPage.tsx
│   └── index.ts
├── store/
│   ├── authStore.ts           # Zustand auth store
│   └── appStore.ts            # Zustand app UI store
├── services/
│   └── apiClient.ts           # Axios HTTP client
├── types/
├── constants/
├── hooks/
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/config/routes.tsx`
3. Add sidebar menu item in `src/components/layout/Sidebar.tsx`

Example:

```typescript
// src/pages/MyNewPage.tsx
import { MainLayout } from '@/components/layout';

export function MyNewPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">My New Page</h1>
      </div>
    </MainLayout>
  );
}
```

### Adding API Calls

Use the pre-configured `apiClient`:

```typescript
import { apiClient } from '@/services/apiClient';

// In a component or effect
const response = await apiClient.getWebsites();
const websites = response.data;
```

### State Management with Zustand

```typescript
import { useAuthStore } from '@/store/authStore';

// In your component
const { user, logout } = useAuthStore();
```

### Tailwind CSS Classes

Common utility classes used:

- `btn-primary` - Blue button
- `btn-secondary` - Gray button
- `btn-ghost` - Transparent button
- `input-base` - Form input
- `card` - Card container
- `card-hover` - Clickable card
- `container-wrapper` - Max-width container

## Building for Production

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the built app locally for testing.

## Linting and Type Checking

```bash
# Lint code
npm run lint

# Type check
npm run type-check
```

## Responsive Design

The app is fully responsive:

- **Mobile** (< 640px)
- **Tablet** (640px - 1024px)
- **Desktop** (> 1024px)

Key responsive features:
- Sidebar hides on mobile, toggles with menu button
- Grid layouts adapt to screen size
- Touch-friendly buttons and spacing

## API Integration

The `apiClient` automatically:
1. Adds Bearer token to requests
2. Handles 401 errors by redirecting to login
3. Sets proper headers
4. Provides base URL from environment

Example endpoints available:

```typescript
// Auth
await apiClient.register(email, password, name);
await apiClient.login(email, password);
await apiClient.getCurrentUser();

// Websites
await apiClient.getWebsites();
await apiClient.getWebsite(id);
await apiClient.createWebsite(data);
await apiClient.updateWebsite(id, data);
await apiClient.deleteWebsite(id);
```

## Common Tasks

### Change Primary Color

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color-here',
        600: '#darker-shade',
        // ...
      },
    },
  },
}
```

### Add New Sidebar Menu Item

Edit `src/components/layout/Sidebar.tsx`:

```typescript
const menuItems = [
  // ... existing items
  {
    icon: YourIcon,
    label: 'Your Item',
    path: '/your-path',
  },
];
```

### Create Protected Page

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<ProtectedRoute>
  <YourPage />
</ProtectedRoute>
```

## Troubleshooting

### API Connection Issues

1. Ensure backend is running on port 3000
2. Check `VITE_API_URL` in `.env`
3. Look at browser console for CORS errors

### Tailwind Styles Not Applying

1. Restart dev server
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check class names match `tailwind.config.js`

### Build Errors

1. Check TypeScript: `npm run type-check`
2. Fix linting: `npm run lint`
3. Clear dist: `rm -rf dist && npm run build`

## Performance Tips

- Use lazy loading for pages
- Images in components will be optimized by Vite
- Keep components small and focused
- Memoize expensive computations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Next Steps

1. Run `npm run dev`
2. Create your account
3. Start building features
4. Check [API documentation](../docs/api/README.md)

## Resources

- [React docs](https://react.dev)
- [Tailwind CSS docs](https://tailwindcss.com)
- [React Router docs](https://reactrouter.com)
- [Zustand docs](https://github.com/pmndrs/zustand)
- [Axios docs](https://axios-http.com)
