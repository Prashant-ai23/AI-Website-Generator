# 🔐 Authentication System Documentation

Complete authentication implementation with JWT, roles, and protected routes.

---

## 📋 Overview

The authentication system provides:
- **JWT-based authentication** with secure token management
- **Role-based access control** (User, Admin)
- **Protected routes** with authorization
- **Frontend token storage** with localStorage
- **Backend middleware** for token verification
- **Password hashing** with bcrypt
- **Automatic request interceptors** for token injection

---

## 🏗️ Architecture

```
Frontend (React)                Backend (Express)
├── Login Form       ────→      POST /api/v1/auth/login
├── Register Form    ────→      POST /api/v1/auth/register
├── Auth Store       ←────      JWT Token + User
├── Protected Routes ────→      GET /api/v1/auth/me (with Bearer token)
└── API Client       ────→      All requests with Authorization header
```

---

## 🔐 Backend Implementation

### User Model

**File:** `backend/src/models/User.ts`

```typescript
interface IUser extends Document {
  email: string;
  password: string; // Hashed with bcrypt
  name: string;
  role: 'user' | 'admin';  // NEW: Role-based access
  profile?: { avatar?: string; bio?: string; location?: string };
  preferences?: { theme?: 'light' | 'dark'; ... };
  stats?: { projectsCount?: number; ... };
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}
```

**Key Features:**
- Email: Unique, lowercase, validated format
- Password: Hashed automatically in pre-save hook
- Role: Enum field (user | admin), indexed for queries
- Last login tracking for activity monitoring

### Authentication Service

**File:** `backend/src/services/authService.ts`

```typescript
class AuthService {
  // Register new user
  async register(email: string, password: string, name: string)
    → Returns: { user, token }

  // Login existing user
  async login(email: string, password: string)
    → Returns: { user, token }

  // Verify token and get user
  async verifyToken(token: string)
    → Returns: User document

  // Generate new JWT
  private generateToken(payload: AuthPayload)
    → Returns: JWT token string

  // Refresh existing token
  async refreshToken(token: string)
    → Returns: { token }
}
```

**Token Payload:**
```typescript
interface AuthPayload {
  id: string;           // User ID
  email: string;        // User email
  name: string;         // User name
  role: 'user' | 'admin'; // NEW: User role
}
```

### Authentication Middleware

**File:** `backend/src/middleware/auth.ts`

#### authenticate(req, res, next)
Verifies JWT token from Authorization header.

```typescript
// Usage in routes:
router.get('/protected', authenticate, controller)

// Sets req.user with:
{
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
}
```

#### authorize(...allowedRoles)
Role-based authorization middleware.

```typescript
// Usage in routes:
router.delete('/user/:id', authenticate, authorize('admin'), controller)

// Only admins can access
router.get('/admin/panel', authenticate, authorize('admin'), controller)

// Multiple roles allowed:
router.get('/projects', authenticate, authorize('user', 'admin'), controller)
```

#### optionalAuth(req, res, next)
Optional authentication - doesn't fail if no token.

```typescript
// Usage in routes:
router.get('/public-projects', optionalAuth, controller)
```

### API Endpoints

#### POST /api/v1/auth/register

Register new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### POST /api/v1/auth/login

Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### GET /api/v1/auth/me

Get current authenticated user. Requires Bearer token.

**Request:**
```
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "isActive": true,
  "createdAt": "2026-05-07T10:00:00Z",
  "updatedAt": "2026-05-07T10:00:00Z"
}
```

#### POST /api/v1/auth/refresh

Refresh JWT token. Requires valid token.

**Request:**
```
POST /api/v1/auth/refresh
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/v1/auth/logout

Logout user (optional - mainly frontend token removal).

**Request:**
```
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 💻 Frontend Implementation

### Redux Auth Store

**File:** `src/store/slices/userSlice.ts`

```typescript
interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Actions
setUser(user)              // Set user data
setToken(token)            // Set JWT token
setAuth({ user, token })   // Set both simultaneously
clearUser()                // Clear auth state
setLoading(boolean)        // Set loading state
setError(error)            // Set error message
restoreAuth(user)          // Restore user from storage
```

**Features:**
- Auto-persist token in localStorage as 'auth_token'
- Restore auth state on page reload
- Track loading and error states
- Manage isAuthenticated boolean

### Auth Service

**File:** `src/services/authService.ts`

Frontend API service for authentication.

```typescript
class AuthService {
  // Register new user
  async register(email, password, name): Promise<RegisterResponse>

  // Login user
  async login(email, password): Promise<LoginResponse>

  // Get current user
  async getCurrentUser(): Promise<User>

  // Logout
  async logout(): Promise<void>

  // Refresh token
  async refreshToken(): Promise<{ token: string }>

  // Token management
  getToken(): string | null
  setToken(token: string): void
  removeToken(): void
  isAuthenticated(): boolean
}
```

### API Client

**File:** `src/utils/apiClient.ts`

Axios instance with automatic token injection.

```typescript
// Automatically adds:
Authorization: Bearer <token>

// On 401 errors:
- Could redirect to login
- Could refresh token and retry
```

### Login Component

**File:** `src/components/LoginForm.tsx`

```typescript
<LoginForm />

Features:
✓ Email and password inputs
✓ Form validation
✓ Error message display
✓ Loading state
✓ Redux dispatch for auth
✓ Navigation on success
✓ Link to register page
```

### Register Component

**File:** `src/components/RegisterForm.tsx`

```typescript
<RegisterForm />

Features:
✓ Email, password, confirm password, name inputs
✓ Password matching validation
✓ Password length validation (6+ chars)
✓ Error message display
✓ Loading state
✓ Redux dispatch for auth
✓ Navigation on success
✓ Link to login page
```

### Protected Route Component

**File:** `src/components/ProtectedRoute.tsx`

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// Redirects to /login if not authenticated
// Redirects to /dashboard if role doesn't match
```

### Routes Setup

**File:** `src/routes/routes.tsx`

```typescript
{
  path: '/login',
  element: <LoginPage />,
}

{
  path: '/register',
  element: <RegisterPage />,
}

{
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
}

{
  path: '/admin',
  element: (
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  ),
}
```

---

## 🔄 Authentication Flow

### Login Flow

```
1. User enters email/password → LoginForm
2. Form validates inputs
3. POST /api/v1/auth/login
4. Backend verifies credentials
5. Backend generates JWT token
6. Response contains token + user data
7. Frontend stores token in localStorage
8. Redux store updated with user + token
9. setAuth() dispatched
10. Navigate to /dashboard
```

### Protected Route Flow

```
1. User navigates to /dashboard
2. <ProtectedRoute> checks Redux state
3. isAuthenticated = !!token
4. If false → redirect to /login
5. If true → render component
6. <Component> makes API call
7. API client adds Authorization header
8. Backend middleware verifies token
9. req.user populated with decoded token
10. Response returned to frontend
```

### Role-Based Access Flow

```
1. Admin navigates to /admin
2. <ProtectedRoute requiredRole="admin"> checks
3. Redux state: user.role = 'admin'
4. Role matches → render component
5. Component makes admin-only API call
6. Backend middleware: authorize('admin')
7. User role verified
8. Endpoint executed
9. Response returned
```

---

## 🛡️ Security Features

### Backend
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token expiration (7 days by default)
- ✅ Token verification middleware
- ✅ Role-based authorization
- ✅ Email uniqueness validation
- ✅ HTTP-only cookies support (optional)

### Frontend
- ✅ Token stored in localStorage (secure for XSS with CSP)
- ✅ Token auto-removal on logout
- ✅ Protected routes with role checking
- ✅ Automatic token injection in requests
- ✅ 401 error handling

### Best Practices
- Tokens never exposed in URLs (use Bearer header)
- Passwords never stored in Redux/localStorage
- Tokens validated on each protected request
- Role checks on both frontend and backend
- HTTPS required in production

---

## 📝 Usage Examples

### Login User

```typescript
import authService from '@/services/authService';
import { setAuth } from '@/store/slices/userSlice';
import { useDispatch } from 'react-redux';

const dispatch = useDispatch();

try {
  const response = await authService.login('user@example.com', 'password');
  dispatch(setAuth({
    user: response.user,
    token: response.token,
  }));
} catch (error) {
  console.error('Login failed:', error);
}
```

### Register User

```typescript
const response = await authService.register(
  'new@example.com',
  'password123',
  'John Doe'
);

dispatch(setAuth({
  user: response.user,
  token: response.token,
}));
```

### Make Authenticated Request

```typescript
import { apiClient } from '@/utils/apiClient';

// Token automatically added via interceptor
const response = await apiClient.get('/v1/projects');
```

### Check Authentication Status

```typescript
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const { isAuthenticated, user } = useSelector(
  (state: RootState) => state.user
);

if (isAuthenticated) {
  console.log('Logged in as:', user?.name);
}
```

### Admin Route

```typescript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/ai-website-generator
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:3000/api
```

---

## 📊 User Roles

### User Role
- Create and manage own projects
- Access personal dashboard
- View public projects
- Edit own profile

### Admin Role
- All User permissions
- Manage all users
- Access admin panel
- View system analytics
- Manage system settings

---

## 🐛 Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Invalid credentials | Wrong email/password | Verify email and password |
| 401 Invalid or expired token | Token expired | Refresh token or login again |
| 403 Access denied | Insufficient role | Login with correct role |
| 400 Email already registered | Email exists | Use different email |
| 400 Password too short | < 6 characters | Use 6+ character password |

---

## 🧪 Testing

### Test Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Test Protected Route

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

### Test Admin Route

```bash
curl -X GET http://localhost:3000/api/v1/admin/users \
  -H "Authorization: Bearer <admin-token>"
```

---

## 📈 Scalability

**Improvements for production:**
- Move tokens to secure cookies (httpOnly)
- Implement refresh token rotation
- Add rate limiting on auth endpoints
- Add email verification
- Add password reset flow
- Add two-factor authentication
- Add audit logging
- Add IP whitelisting for admin

---

## 📚 Related Files

- Backend auth: `backend/src/routes/v1/auth.ts`
- Backend services: `backend/src/services/authService.ts`
- Backend middleware: `backend/src/middleware/auth.ts`
- Backend models: `backend/src/models/User.ts`
- Frontend store: `src/store/slices/userSlice.ts`
- Frontend service: `src/services/authService.ts`
- Frontend components: `src/components/{LoginForm,RegisterForm,ProtectedRoute}.tsx`

---

**Created:** May 7, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
