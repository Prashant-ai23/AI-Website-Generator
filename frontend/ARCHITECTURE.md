# Frontend Architecture & Design

## Layout Structure

```
┌─────────────────────────────────────────────────┐
│         Header (Sticky Top)                     │  Header.tsx
│  [Logo] [App Name]      [User] [Settings] [✕] │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │         Main Content Area            │
│ (Toggle) │                                      │
│          │      (Dashboard/Pages)               │ MainLayout.tsx
│ • Dash   │                                      │
│ • Projects                                      │
│ • Templ  │      + Footer (Sticky Bottom)        │ Footer.tsx
│ • AI Gen │      [Links] [Copyright]             │
│ • Settng │                                      │
└──────────┴──────────────────────────────────────┘

Mobile (< 640px):
┌──────────────────────────┐
│ Header [Menu Icon]       │
├──────────────────────────┤
│                          │
│  Main Content (fullwidth)│
│                          │
├──────────────────────────┤
│ Footer                   │
└──────────────────────────┘
(Sidebar slides in on menu click)
```

## Component Hierarchy

```
App
└── RouterProvider
    └── <Route>
        └── LoginPage / RegisterPage
            (No layout, full page)
        
        └── ProtectedRoute
            └── MainLayout
                ├── Header
                │   ├── Logo + Title
                │   ├── [Mobile Menu Button]
                │   └── [User Menu]
                │
                ├── Sidebar (Overlay on mobile)
                │   ├── [Close Button] (mobile only)
                │   ├── Menu Items (5)
                │   │   ├── Dashboard
                │   │   ├── Projects
                │   │   ├── Templates
                │   │   ├── AI Generator
                │   │   └── Settings
                │   └── Version Info
                │
                ├── Main Content
                │   └── <Page Component>
                │       (DashboardPage, etc.)
                │
                └── Footer
                    ├── Links (Product, Company, Legal)
                    ├── Social Icons
                    └── Copyright

States (Zustand):
├── useAuthStore
│   ├── user
│   ├── token
│   ├── isAuthenticated
│   ├── isLoading
│   └── error
│
└── useAppStore
    ├── sidebarOpen
    ├── toggleSidebar()
    ├── theme
    └── toggleTheme()
```

## Page Layouts

### Dashboard Page
```
┌─ Dashboard ─────────────────────┐
│ [Title] [Description]           │
│                                 │
│ [Stat Card] [Stat Card]         │
│ [Stat Card] [Stat Card]         │
│                                 │
│ [New Website Button]            │
│                                 │
│ [Website Card] [Website Card]   │
│ [Website Card] [Website Card]   │
│ [Website Card] [Website Card]   │
└─────────────────────────────────┘
```

### Login Page
```
┌────────────────────────────┐
│                            │
│    [Logo]                  │
│ Website Generator          │
│ Sign in to your account    │
│                            │
│ ┌──────────────────────┐   │
│ │ Email: [__________]  │   │
│ │ Password: [_____]    │   │
│ │                      │   │
│ │ [ Remember Me ] [?]  │   │
│ │                      │   │
│ │ [Sign in]            │   │
│ │ ─────────────────    │   │
│ │ [Create account]     │   │
│ └──────────────────────┘   │
│                            │
│ © 2024 All rights reserved │
└────────────────────────────┘
```

### Generator Page
```
┌─ AI Generator ──────────────────┐
│ [Title] [Description]           │
│                                 │
│ ┌─ Input ──────────┐ ┌─ Examples ─┐
│ │ Describe your    │ │ • Tech     │
│ │ website:         │ │ • Portfolio│
│ │                  │ │ • Commerce │
│ │ [______________] │ │ • Wellness │
│ │ [______________] │ │            │
│ │ [______________] │ └────────────┘
│ │                  │
│ │ Industry: [----] │
│ │ [Generate]       │
│ │                  │
│ └──────────────────┘
└─────────────────────────────────┘
```

## Responsive Behavior

### Mobile (< 640px)
- Sidebar hidden by default
- Menu button in header
- Sidebar slides in as overlay
- Full-width content
- Single column layouts
- Touch-friendly spacing

### Tablet (640px - 1024px)
- Sidebar might show/hide
- 2-column grid layouts
- Adjusted padding

### Desktop (> 1024px)
- Sidebar always visible
- 2-3 column grids
- Hover effects
- Optimized spacing

## Color Palette

```
Primary Colors:
├── primary-50   #f0f9ff
├── primary-100  #e0f2fe
├── primary-500  #0ea5e9 ← Main accent
├── primary-600  #0284c7
├── primary-700  #0369a1
└── primary-900  #082f49

Dark Colors:
├── dark-50      #f9fafb
├── dark-100     #f3f4f6
├── dark-800     #1f2937
└── dark-900     #111827 ← Sidebar bg

Semantic:
├── green        #10b981 ✓ Success
├── yellow       #f59e0b ⚠ Warning
├── red          #ef4444 ✕ Error
└── gray         #6b7280 ℹ Info
```

## Typography

```
Headings:
├── h1  text-3xl font-bold
├── h2  text-2xl font-bold
├── h3  text-xl font-semibold
└── h4  text-lg font-semibold

Body:
├── Large     text-base
├── Normal    text-sm
└── Small     text-xs

Links:
└── text-primary-600 hover:text-primary-700
```

## Interactive States

```
Button States:
├── Default   bg-primary-600 text-white
├── Hover     bg-primary-700
├── Active    border-2 border-primary-600
├── Disabled  opacity-50 cursor-not-allowed
└── Loading   spinner animation

Input States:
├── Default   border-gray-300
├── Focus     ring-2 ring-primary-500 border-transparent
├── Error     border-red-300 ring-red-500
└── Disabled  opacity-50 cursor-not-allowed

Card States:
├── Default   bg-white shadow
├── Hover     shadow-lg cursor-pointer (card-hover)
└── Active    border-primary-500
```

## Navigation Flow

```
Public Routes:
┌─ / ────────────────┐
│ (Redirect to dash) │
├────────────────────┤
│ /login             │
│ /register          │
└────────────────────┘

Protected Routes (Auth Required):
┌────────────────────────┐
│ /dashboard (default)   │
│ /projects              │
│ /templates             │
│ /generator             │
│ /settings              │
└────────────────────────┘

Not Found:
└── /* → /404
```

## Form Patterns

```
Text Input:
┌─────────────────────────┐
│ Label                   │
│ [Icon] [Input...]       │
│ <error message>         │
└─────────────────────────┘

Select:
┌─────────────────────────┐
│ Label                   │
│ [▼ Choose option  ...] │
└─────────────────────────┘

Checkbox:
┌─────────────────────────┐
│ ☑ Label text            │
└─────────────────────────┘

TextArea:
┌─────────────────────────┐
│ Label                   │
│ ┌───────────────────┐   │
│ │                   │   │
│ │ Multiple lines... │   │
│ │                   │   │
│ └───────────────────┘   │
└─────────────────────────┘
```

## Data Flow (State Management)

```
User Action
    ↓
Component (useState)
    ↓
API Call (axios)
    ↓
Response
    ↓
Update Store (Zustand)
    ↓
Component Re-render
```

## Error Handling

```
Try Block:
├── API Call
├── Data Processing
└── State Update

Catch Block:
├── User-friendly message
├── Log to console
├── Show error UI
└── Reset loading state

Interceptor:
└── 401 Unauthorized
    ├── Clear token
    ├── Logout user
    └── Redirect to /login
```

## Performance Optimizations

1. **Code Splitting**
   - Each page route = separate chunk
   - Loaded on demand

2. **Lazy Components**
   - Dialog/Modal components
   - Heavy feature components

3. **Memoization**
   - UseMemo for expensive calculations
   - UseCallback for event handlers

4. **Asset Optimization**
   - Vite handles bundling
   - CSS minification
   - JS tree-shaking

## Accessibility (a11y)

```
Features:
├── Semantic HTML
├── ARIA labels
├── Keyboard navigation
├── Focus management
├── Color contrast
├── Screen reader support
└── Touch targets (min 44x44px)

Components follow:
├── WAI-ARIA patterns
├── WCAG 2.1 AA standards
└── Keyboard-first design
```

## Browser Compatibility

```
Supported:
├── Chrome (latest)
├── Firefox (latest)
├── Safari (latest)
├── Edge (latest)
└── Mobile browsers

Modern Features Used:
├── ES2020+
├── CSS Grid/Flexbox
├── CSS Custom Properties
└── LocalStorage API
```

---

This architecture ensures:
✅ Responsive design on all devices
✅ Type-safe development
✅ Efficient state management
✅ Fast performance
✅ Good accessibility
✅ Easy to maintain and extend
