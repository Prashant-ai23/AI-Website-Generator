# 🔐 Authentication System Implementation

Complete JWT-based authentication with role-based access control (RBAC).

---

## 📋 Overview

- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Admin and User roles
- **Token Storage**: LocalStorage for persistence
- **Protected Routes**: Frontend route guards
- **Auto-Logout**: Session expiration handling
- **Redux Integration**: State management

---

## 🏗️ Architecture

### Backend

**Updated Components:**
- `User.ts` - Added `role` field (user | admin)
- `middleware/auth.ts` - Added `authorize()` middleware for role checking
- `utils/jwt.ts` - Updated TokenPayload with role
- `routes/auth.ts` - Enhanced with role in responses

**Auth Endpoints:**
```
POST   /auth/register        - Register new user (returns token)
POST   /auth/login           - Login user (returns token)
GET    /auth/me              - Get current user (protected)
POST   /auth/logout          - Logout user (protected)
```

### Frontend

**New Components:**
- `LoginForm.tsx` - Login form with validation
- `RegisterForm.tsx` - Registration form with password confirmation
- `ProtectedRoute.tsx` - Route guard component
- `Navbar.tsx` - Navigation with user info and logout
- `pages/Login.tsx` - Login page
- `pages/Register.tsx` - Register page
- `pages/Dashboard.tsx` - Protected dashboard page

**Utilities:**
- `utils/api.ts` - API client with auto-auth
- `utils/useAuthInit.ts` - Auth initialization hook
- `store/slices/userSlice.ts` - Redux auth state management

---

## 🔑 JWT Token Format

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Token Expiry:** 7 days (configurable via `JWT_EXPIRE` env var)

---

## 🛡️ Role-Based Access

### Roles

- **User** (default): Regular user access
- **Admin**: Full access, admin features

### Backend Middleware Usage

```typescript
// Protected route (any authenticated user)
router.get('/endpoint', authenticate, handler);

// Admin-only route
router.delete('/endpoint', authenticate, authorize('admin'), handler);

// Multiple roles allowed
router.post('/endpoint', authenticate, authorize('user', 'admin'), handler);
```

### Frontend Route Protection

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Admin-only page
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

---

## 🔄 Authentication Flow

### Registration

```
1. User fills registration form
2. Frontend validates inputs
3. POST /auth/register with email, password, name
4. Backend hashes password, creates user
5. Backend generates JWT token
6. Frontend stores token in localStorage
7. Redux state updated with user info
8. Redirect to dashboard
```

### Login

```
1. User fills login form
2. POST /auth/login with email, password
3. Backend validates credentials
4. Backend updates lastLoginAt
5. Backend generates JWT token
6. Frontend stores token in localStorage
7. Redux state updated with user info
8. Redirect to dashboard
```

### Protected API Calls

```
1. Frontend retrieves token from localStorage
2. Adds "Authorization: Bearer {token}" header
3. Backend middleware verifies token
4. Middleware decodes payload (id, email, role)
5. Sets req.user with decoded data
6. Handler executes with user context
```

### Logout

```
1. User clicks logout button
2. Frontend calls POST /auth/logout
3. Frontend clears localStorage token
4. Redux state cleared (clearUser action)
5. Redirect to login page
```

---

## 💾 Token Storage

### LocalStorage Keys

```javascript
localStorage.getItem('auth_token')  // JWT token
```

### Automatic Restoration

On app initialization:
1. Check if token exists in localStorage
2. If exists, verify with GET /auth/me
3. Update Redux state with user info
4. If verification fails, clear token

---

## 🔗 Redux State Structure

```typescript
interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

### Actions

```typescript
setAuth(user, token)        // Set authenticated user
setUser(user)               // Set user info
setToken(token)             // Set token only
clearUser()                 // Logout
setLoading(boolean)         // Loading state
setError(message)           // Error message
restoreAuth(user)           // Restore from verification
```

---

## 📝 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Login User

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

### Logout

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 🎯 Frontend Components

### ProtectedRoute

```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// With role requirement
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

**Behavior:**
- If not authenticated → redirect to /login
- If role required but doesn't match → redirect to /dashboard
- Otherwise → render component

### LoginForm

**Features:**
- Email validation
- Password required
- Error messages
- Loading state
- Link to register

**Submission:**
```typescript
POST /auth/login
→ Redux: setAuth()
→ Navigate: /dashboard
```

### RegisterForm

**Features:**
- Name, email, password fields
- Password confirmation
- 6+ character password requirement
- Matching password validation
- Error messages
- Link to login

**Submission:**
```typescript
POST /auth/register
→ Redux: setAuth()
→ Navigate: /dashboard
```

### Navbar

**Features:**
- Shows user name and role
- Logout button (authenticated)
- Login/Register links (anonymous)
- Role badge (👑 Admin or 👤 User)

**Logout:**
```typescript
POST /auth/logout
→ Redux: clearUser()
→ Navigate: /login
```

---

## 🛠️ API Utilities

### `apiCall(endpoint, options)`

Generic API call with auto-auth:

```typescript
const response = await apiCall('/projects', {
  method: 'GET',
  includeAuth: true  // default
});
```

**Auto-adds:**
- `Authorization: Bearer {token}` header
- `Content-Type: application/json`

### `apiCallJson<T>(endpoint, options)`

Type-safe JSON API call:

```typescript
const user = await apiCallJson<User>('/auth/me');
```

---

## 🔒 Security Considerations

### Token Management

✅ **Good Practices:**
- Store in localStorage (simple, works with REST APIs)
- Include in Authorization header
- Clear on logout
- Set reasonable expiration (7 days)
- Use HTTPS in production

⚠️ **Considerations:**
- XSS vulnerability: localStorage can be accessed by scripts
- CSRF: Use SameSite cookies for state-changing requests
- Token expiration: Implement refresh tokens for long sessions

### Password Security

✅ **Backend:**
- Passwords hashed with bcrypt (10 rounds)
- Never returned in responses
- Selected via `.select('+password')` when needed

### Authorization

✅ **Backend:**
- All protected routes check JWT token
- Role-based middleware enforces access control
- User can only access their own resources (implement in handlers)

---

## 🚀 Setup Instructions

### Backend

1. User role field already in schema
2. Auth middleware with role support ready
3. Endpoints handle role in token

**Run:**
```bash
cd backend
npm run dev
```

### Frontend

1. Redux auth state configured
2. Auth components created
3. Protected routes set up
4. Token storage automatic

**Setup:**
```bash
cd frontend
cp .env.example .env.local
npm run dev
```

**Environment:**
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 📊 Testing

### Test User Flow

1. **Register:**
   - Go to http://localhost:5173/register
   - Fill form with test data
   - Should redirect to dashboard

2. **Login:**
   - Go to http://localhost:5173/login
   - Use credentials from registration
   - Should redirect to dashboard

3. **Protected Route:**
   - Try accessing /dashboard without auth
   - Should redirect to /login

4. **Logout:**
   - Click logout in navbar
   - Token cleared from localStorage
   - Redirect to login

5. **Token Persistence:**
   - Login and refresh page
   - Should stay logged in
   - Token restored from localStorage

### Test Admin Role

1. Register first user (role: user)
2. In MongoDB, manually update user role to 'admin'
3. Login with admin account
4. Dashboard shows admin badge and panel

---

## 🔄 Future Enhancements

- [ ] Refresh token rotation
- [ ] Multi-device session management
- [ ] Two-factor authentication
- [ ] OAuth integrations (Google, GitHub)
- [ ] Session activity tracking
- [ ] IP-based restrictions
- [ ] Rate limiting on auth endpoints
- [ ] Passwordless authentication

---

## 📚 File Reference

**Backend:**
- `src/models/User.ts` - User schema with role
- `src/middleware/auth.ts` - Authentication & authorization
- `src/utils/jwt.ts` - Token utilities
- `src/routes/auth.ts` - Auth endpoints

**Frontend:**
- `src/store/slices/userSlice.ts` - Redux auth state
- `src/components/LoginForm.tsx` - Login form
- `src/components/RegisterForm.tsx` - Register form
- `src/components/ProtectedRoute.tsx` - Route guard
- `src/components/Navbar.tsx` - Navigation
- `src/pages/Login.tsx` - Login page
- `src/pages/Register.tsx` - Register page
- `src/pages/Dashboard.tsx` - Protected dashboard
- `src/utils/api.ts` - API client
- `src/App.tsx` - App initialization

---

## ✅ Checklist

- ✅ User role field in schema
- ✅ JWT token generation with role
- ✅ Auth middleware with role support
- ✅ Role-based authorization middleware
- ✅ Register endpoint
- ✅ Login endpoint with lastLoginAt tracking
- ✅ Get current user endpoint
- ✅ Logout endpoint
- ✅ Frontend login form
- ✅ Frontend register form
- ✅ Protected route component
- ✅ Token storage in localStorage
- ✅ Auto token restoration
- ✅ Redux auth state management
- ✅ API client with auto-auth
- ✅ Navbar with logout
- ✅ Dashboard page
- ✅ Home page with navigation

---

**Status:** ✅ Complete  
**Version:** 1.0.0  
**Last Updated:** May 7, 2026
