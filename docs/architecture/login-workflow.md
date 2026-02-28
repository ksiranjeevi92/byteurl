# Login Workflow - JWT Authentication

## Overview

When a user logs in, the app receives a JWT token from the backend, stores it in `localStorage`, and automatically sends it with every subsequent API call.

---

## Flow Summary

```
User submits login form
        ↓
POST /api/auth/login (email, password)
        ↓
Server returns JWT token
        ↓
Token stored in localStorage ('jwt_token')
        ↓
All future HTTP requests include: Authorization: Bearer {token}
```

---

## Step-by-Step

### 1. Login Form (`user-login.ts`)
- User enters email & password
- Form validates inputs
- Calls `userAccountService.loginWithProfile(credentials)`

### 2. Authentication Service (`user-account.service.ts`)
```typescript
// HTTP POST to backend
this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)

// On success, store token immediately
localStorage.setItem('jwt_token', loginResponse.token);
```

### 3. Token Storage (`jwt-token.service.ts`)
- **Location:** `localStorage`
- **Key:** `jwt_token`
- **Methods:**
  - `getStoredToken()` - retrieve token
  - `isTokenExpired()` - check expiration
  - `isAuthenticated()` - token exists + not expired
  - `removeToken()` - logout

### 4. HTTP Interceptor (`app.config.ts`)
```typescript
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = jwtTokenService.getStoredToken();

  if (token && !jwtTokenService.isTokenExpired(token)) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
```

**What it does:**
1. Intercepts **every** HTTP request
2. Gets token from localStorage
3. If token exists and not expired → adds `Authorization: Bearer {token}` header
4. Passes request to backend

---

## Key Files

| File | Purpose |
|------|---------|
| `features/user-account/components/user-login/user-login.ts` | Login form component |
| `features/user-account/services/user-account.service.ts` | Login API call + stores token |
| `shared/services/jwt-token.service.ts` | Token management (get, validate, remove) |
| `app.config.ts` | HTTP interceptor that adds token to requests |
| `shared/guards/auth.guard.ts` | Protects routes (checks if authenticated) |

---

## Token Lifecycle

```
LOGIN SUCCESS → Store in localStorage
        ↓
EVERY API CALL → Interceptor adds Bearer token header
        ↓
TOKEN EXPIRES → isTokenExpired() returns true → redirect to login
        ↓
LOGOUT → removeToken() clears localStorage
```
