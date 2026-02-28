# Angular Project Organization - byteurl

This document explains the folder organization and architectural patterns used in the byteurl project. This application follows a **feature-based modular architecture** with clear separation between business features and shared utilities.

## Table of Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Features Folder](#features-folder)
- [Shared Folder](#shared-folder)
- [Architectural Patterns](#architectural-patterns)
- [Route Guards & Security](#route-guards--security)
- [Data Flow](#data-flow)

---

## Overview

The byteurl application is organized using a **feature-based architecture** where:

- Each feature is **self-contained** with its own components, models, services, and routes
- **Shared** resources (reusable components, guards, interceptors) are centralized
- **Standalone components** are used throughout (no NgModule required)
- Features are **lazy-loaded** for optimal performance

### Technology Stack

- **Angular**: 20.1.0 (latest with standalone components)
- **TypeScript**: 5.8.2
- **RxJS**: 7.8.0 for reactive programming
- **JWT**: Token-based authentication

---

## Folder Structure

```
byteurl/
├── src/
│   ├── app/
│   │   ├── app.ts                    # Root component
│   │   ├── app.html                  # Root template
│   │   ├── app.routes.ts            # Main routing configuration
│   │   ├── app.config.ts            # Application providers & config
│   │   │
│   │   ├── features/                # Feature modules (business domains)
│   │   │   ├── dashboard/           # Dashboard feature
│   │   │   ├── projects/            # Projects management
│   │   │   ├── user-account/        # Authentication
│   │   │   └── user-profile/        # User profile
│   │   │
│   │   └── shared/                  # Shared resources
│   │       ├── components/          # Reusable UI components
│   │       ├── guards/              # Route guards
│   │       ├── interceptors/        # HTTP interceptors
│   │       └── services/            # Shared services
│   │
│   ├── index.html                   # Main HTML page
│   ├── main.ts                      # Application entry point
│   └── styles.scss                  # Global styles
│
├── angular.json                     # Angular CLI configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript configuration
```

---

## Features Folder

**Path**: `src/app/features/`

The features folder contains all **business domain features** of the application. Each feature is self-contained and organized consistently.

### Feature Organization Pattern

Each feature follows this structure:

```
feature-name/
├── components/              # Feature-specific components
│   ├── component-a/
│   │   ├── component-a.ts    # TypeScript logic
│   │   ├── component-a.html  # HTML template
│   │   └── component-a.scss  # Component styles
│   └── component-b/
│
├── models/                  # Feature-specific data models
│   └── feature.model.ts     # Interfaces, DTOs, types
│
├── services/                # Feature-specific services
│   └── feature.service.ts   # HTTP calls, business logic
│
└── feature.routes.ts        # Feature-specific routes (optional)
```

### Features Overview

#### 1. Dashboard Feature

**Path**: `features/dashboard/`

**Purpose**: Displays application statistics and overview

**Components**:

- `dashboard.ts`: Main dashboard page with statistics cards

**Features**:

- Shows counts of projects, active/completed tasks
- Displays user email from JWT token
- Lazy-loaded from main routes

**Route**: `/dashboard`

---

#### 2. Projects Feature

**Path**: `features/projects/`

**Purpose**: Complete project and task management

**Structure**:

```
projects/
├── components/
│   ├── project-list/        # List of all projects
│   ├── project-detail/      # Single project details & tasks
│   └── projects-page/       # Main container page
├── models/
│   └── project.model.ts     # Project, Task, and DTO interfaces
└── services/
    └── project.service.ts   # Project/Task CRUD operations
```

**Key Models** (`project.model.ts`):

```typescript
interface ProjectDto {
  id: number;
  name: string;
  description: string;
  owner: string;
  members: string[];
  tasks: TaskDto[];
}

interface TaskDto {
  id: number;
  title: string;
  description: string;
  assignee: string;
  status: TaskStatus;
}

enum TaskStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}
```

**Service Methods** (`project.service.ts`):

- `getProjects()`: Fetch all projects
- `getProjectById(id)`: Get single project
- `createProject(dto)`: Create new project
- `updateProject(id, dto)`: Update project
- `deleteProject(id)`: Delete project
- `addTaskToProject(projectId, taskDto)`: Add task
- `updateTask(projectId, taskId, dto)`: Update task
- `deleteTask(projectId, taskId)`: Delete task

**Routes**:

- `/projects` - List view
- `/projects/:id` - Detail view

**Protected by**: AuthGuard, ProfileCompleteGuard

---

#### 3. User Account Feature

**Path**: `features/user-account/`

**Purpose**: User authentication (login and registration)

**Structure**:

```
user-account/
├── components/
│   ├── user-login/          # Login form
│   └── user-registration/   # Registration form
├── models/
│   └── user-account.model.ts  # Auth interfaces
├── services/
│   └── user-account.service.ts # Login, register, create user
└── user-account.routes.ts   # Child routes (login, register)
```

**Key Models** (`user-account.model.ts`):

```typescript
interface LoginRequestDto {
  email: string;
  password: string;
}

interface LoginResponseDto {
  token: string;
}

interface RegisterUserRequestDto {
  email: string;
  password: string;
}

interface CreateUserAccountRequestDto {
  email: string;
  password: string;
}
```

**Service Methods** (`user-account.service.ts`):

- `login(email, password)`: Authenticate user, store JWT token
- `register(email, password)`: Register new user
- `logout()`: Clear token and redirect

**Routes**:

- `/user-account/login` - Login page
- `/user-account/register` - Registration page

**Access**: Public (no guards)

---

#### 4. User Profile Feature

**Path**: `features/user-profile/`

**Purpose**: User profile management and completion

**Structure**:

```
user-profile/
├── components/
│   ├── profile/             # View/edit profile
│   └── profile-complete/    # First-time profile completion
├── models/
│   └── user-profile.model.ts  # Profile interfaces
└── services/
    └── user-profile.service.ts # Profile CRUD operations
```

**Key Models** (`user-profile.model.ts`):

```typescript
interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
}

interface CreateUserProfileDto {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface UpdateUserProfileDto {
  firstName: string;
  lastName: string;
  birthDate: string;
}
```

**Service Methods** (`user-profile.service.ts`):

- `getUserProfile(email)`: Fetch user profile
- `getUserProfiles(emails)`: Fetch multiple profiles
- `createUserProfile(dto)`: Create profile (first-time)
- `updateUserProfile(email, dto)`: Update existing profile

**Routes**:

- `/user-profile` - View/edit profile
- `/user-profile/complete` - Complete profile after registration

**Protected by**:

- `/user-profile/complete`: AuthGuard only
- `/user-profile`: AuthGuard + ProfileCompleteGuard

---

## Shared Folder

**Path**: `src/app/shared/`

The shared folder contains **reusable resources** used across multiple features.

### Shared Components

**Path**: `shared/components/`

#### HeaderComponent

**Path**: `shared/components/header/`

**Purpose**: Application navigation bar

**Features**:

- Displays user email extracted from JWT token
- Navigation links (Dashboard, Projects, Profile)
- Logout button
- Active route highlighting
- Responsive design

**Used in**: All authenticated pages

**Dependencies**: JwtTokenService, Router

```typescript
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
```

---

#### FooterComponent

**Path**: `shared/components/footer/`

**Purpose**: Application footer

**Features**:

- Displays copyright with dynamic year
- Minimal, reusable across all pages

**Used in**: All pages (via app.html)

---

#### ProjectModalComponent

**Path**: `shared/components/project-modal/`

**Purpose**: Modal dialog for creating/editing projects

**Features**:

- Form with name, description, owner, members
- Create or edit mode
- Emits events to parent component
- Reusable across project management

**Used in**: Projects list, project detail

**Inputs**:

- `project`: ProjectDto (for edit mode)
- `mode`: 'create' | 'edit'

**Outputs**:

- `onSave`: Emits saved project data
- `onCancel`: Emits close event

---

#### TaskModalComponent

**Path**: `shared/components/task-modal/`

**Purpose**: Modal dialog for creating/editing tasks

**Features**:

- Form with title, description, assignee, status
- Create or edit mode
- Status dropdown (TO_DO, IN_PROGRESS, DONE)
- Emits events to parent

**Used in**: Project detail page

**Inputs**:

- `task`: TaskDto (for edit mode)
- `projectMembers`: string[] (for assignee dropdown)
- `mode`: 'create' | 'edit'

**Outputs**:

- `onSave`: Emits saved task data
- `onCancel`: Emits close event

---

#### ConfirmDialogComponent

**Path**: `shared/components/confirm-dialog/`

**Purpose**: Generic confirmation dialog for destructive actions

**Features**:

- Displays custom message
- Yes/No buttons
- Emits confirmation result

**Used in**: Delete operations (projects, tasks)

**Inputs**:

- `message`: string
- `title`: string

**Outputs**:

- `onConfirm`: Emits true/false

---

### Shared Guards

**Path**: `shared/guards/`

Guards control access to routes based on conditions.

#### AuthGuard

**Path**: `shared/guards/auth.guard.ts`

**Purpose**: Protects routes that require authentication

**Implementation**:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);

  if (jwtTokenService.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  return router.parseUrl("/user-account/login");
};
```

**Applied to**:

- `/dashboard`
- `/projects`
- `/user-profile`
- `/user-profile/complete`

**How it works**:

1. Checks if JWT token exists and is valid
2. If yes, allows access
3. If no, redirects to `/user-account/login`

---

#### ProfileCompleteGuard

**Path**: `shared/guards/profile-complete.guard.ts`

**Purpose**: Ensures user has completed their profile before accessing main features

**Implementation**:

```typescript
export const profileCompleteGuard: CanActivateFn = (route, state) => {
  const jwtTokenService = inject(JwtTokenService);
  const userProfileService = inject(UserProfileService);
  const router = inject(Router);

  const email = jwtTokenService.getEmailFromToken();

  return userProfileService.getUserProfile(email).pipe(
    map((profile) => {
      if (profile && profile.firstName) {
        return true; // Profile complete
      }
      return router.parseUrl("/user-profile/complete");
    }),
    catchError(() => {
      return of(router.parseUrl("/user-profile/complete"));
    }),
  );
};
```

**Applied to**:

- `/dashboard`
- `/projects`
- `/user-profile` (view mode)

**How it works**:

1. Gets user email from JWT token
2. Fetches user profile from API
3. If profile exists with firstName, allows access
4. If profile incomplete, redirects to `/user-profile/complete`

---

### Shared Interceptors

**Path**: `shared/interceptors/`

Interceptors process HTTP requests/responses globally.

#### jwtInterceptor

**Path**: `shared/interceptors/jwt.interceptor.ts`

**Purpose**: Automatically adds JWT token to HTTP requests

**Implementation**:

```typescript
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtTokenService = inject(JwtTokenService);
  const token = jwtTokenService.getStoredToken();

  if (token && !jwtTokenService.isTokenExpired(token)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
```

**Applied to**: All HTTP requests globally (configured in `app.config.ts`)

**How it works**:

1. Intercepts every HTTP request
2. Checks if valid JWT token exists
3. Clones request and adds `Authorization` header
4. Passes modified request to next handler

**Benefits**:

- No need to manually add token to each request
- Centralized token management
- Automatic token validation

---

### Shared Services

**Path**: `shared/services/`

#### JwtTokenService

**Path**: `shared/services/jwt-token.service.ts`

**Purpose**: Centralized JWT token management

**Key Methods**:

```typescript
@Injectable({ providedIn: "root" })
export class JwtTokenService {
  // Storage
  getStoredToken(): string | null;
  removeToken(): void;

  // Validation
  isAuthenticated(): boolean;
  isTokenExpired(token: string): boolean;
  getTimeUntilExpiration(token: string): number;

  // Decoding
  decodeToken(token: string): any;
  getEmailFromToken(): string | null;
}
```

**How it works**:

- **Storage**: Uses `localStorage` to persist tokens across sessions
- **Decoding**: Client-side JWT decoding (base64 decode, no verification)
- **Validation**: Checks token expiration using `exp` claim
- **Security**: Does NOT verify signature (server-side responsibility)

**Used by**:

- `jwtInterceptor`: Add token to requests
- `authGuard`: Check authentication status
- `HeaderComponent`: Display user email
- All services: Via interceptor

**Token Structure** (decoded):

```json
{
  "sub": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890
}
```

---

## Architectural Patterns

### 1. Feature-Based Organization

**Principle**: Group code by business feature, not by technical type

**Benefits**:

- High cohesion: Related code stays together
- Easy to find: All project logic in `features/projects/`
- Scalable: Add new features without affecting others
- Clear ownership: Each feature is self-contained

**Example**:

```
✅ Good (Feature-based):
features/
  projects/
    models/project.model.ts
    services/project.service.ts
    components/project-list/

❌ Bad (Type-based):
models/project.model.ts
services/project.service.ts
components/project-list/
```

---

### 2. Standalone Components

**What**: Components that declare their own dependencies

**Benefits**:

- No NgModule boilerplate
- Better tree-shaking
- Simpler mental model
- Easier testing

**Example**:

```typescript
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: "./dashboard.html",
})
export class DashboardComponent {}
```

---

### 3. Lazy Loading

**What**: Load features on-demand, not at startup

**Benefits**:

- Faster initial load
- Smaller initial bundle
- Better performance

**Configuration** (`app.routes.ts`):

```typescript
export const routes: Routes = [
  {
    path: "dashboard",
    loadComponent: () => import("./features/dashboard/components/dashboard").then((m) => m.DashboardComponent),
    canActivate: [authGuard, profileCompleteGuard],
  },
  {
    path: "projects",
    loadChildren: () => import("./features/projects/projects.routes").then((m) => m.projectsRoutes),
    canActivate: [authGuard, profileCompleteGuard],
  },
];
```

---

### 4. Dependency Injection

**Services are singletons** provided at root level:

```typescript
@Injectable({ providedIn: "root" })
export class ProjectService {}
```

**Benefits**:

- Single instance across app
- Automatic tree-shaking
- Easy testing with mocks

---

### 5. Reactive Programming with RxJS

**Services return Observables**:

```typescript
getProjects(): Observable<ProjectDto[]> {
  return this.http.get<ProjectDto[]>(`${this.apiUrl}/projects`);
}
```

**Components subscribe**:

```typescript
this.projectService.getProjects().subscribe({
  next: (projects) => (this.projects = projects),
  error: (error) => console.error(error),
});
```

**Benefits**:

- Composable async operations
- Cancellable requests
- Error handling

---

### 6. Naming Conventions

| Type        | Convention                          | Example                 |
| ----------- | ----------------------------------- | ----------------------- |
| Component   | `name.ts`, `name.html`, `name.scss` | `dashboard.ts`          |
| Service     | `name.service.ts`                   | `project.service.ts`    |
| Model       | `name.model.ts`                     | `user-profile.model.ts` |
| Guard       | `name.guard.ts`                     | `auth.guard.ts`         |
| Interceptor | `name.interceptor.ts`               | `jwt.interceptor.ts`    |
| Routes      | `name.routes.ts`                    | `projects.routes.ts`    |

---

## Route Guards & Security

### Authentication Flow

```
User Login
    ↓
UserAccountService.login()
    ↓
JWT Token received from API
    ↓
Store token in localStorage
    ↓
Redirect to /user-profile/complete
    ↓
ProfileCompleteGuard checks profile
    ↓
If incomplete → /user-profile/complete
If complete → /dashboard
```

### Route Protection Levels

**Level 1: Public Routes** (No guards)

- `/user-account/login`
- `/user-account/register`

**Level 2: Authenticated Only** (AuthGuard)

- `/user-profile/complete`

**Level 3: Authenticated + Profile Complete** (AuthGuard + ProfileCompleteGuard)

- `/dashboard`
- `/projects`
- `/user-profile`

### Guard Execution Order

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard, profileCompleteGuard]
}
```

**Execution**:

1. `authGuard` runs first
   - If fails → Redirect to login
   - If passes → Continue to next guard
2. `profileCompleteGuard` runs
   - If fails → Redirect to profile-complete
   - If passes → Allow access

---

## Data Flow

### Example: Creating a Project

```
1. User clicks "New Project" in ProjectListComponent
       ↓
2. ProjectModalComponent opens (shared component)
       ↓
3. User fills form and clicks "Save"
       ↓
4. Modal emits onSave event with form data
       ↓
5. ProjectListComponent calls ProjectService.createProject()
       ↓
6. jwtInterceptor adds Authorization header
       ↓
7. HTTP POST to http://localhost:8080/api/projects
       ↓
8. Backend validates token and creates project
       ↓
9. Response received (new project with ID)
       ↓
10. ProjectListComponent refreshes project list
       ↓
11. UI updates with new project
```

### HTTP Request/Response Flow

```
Component → Service → HttpClient → Interceptor → Backend API
                                        ↓
                            (adds JWT token)
                                        ↓
Component ← Service ← Observable ← Response from API
```

---

## Best Practices

### 1. Separation of Concerns

- **Components**: UI logic only
- **Services**: Business logic and HTTP calls
- **Models**: Data structures
- **Guards**: Access control
- **Interceptors**: Request/response processing

### 2. Don't Repeat Yourself (DRY)

- Reusable components in `shared/components/`
- Shared services in `shared/services/`
- Common models can be extracted to shared if used by multiple features

### 3. Type Safety

- All models are TypeScript interfaces
- Strongly typed service methods
- Type-safe HTTP requests

### 4. Error Handling

- Services handle HTTP errors
- Components display user-friendly messages
- Guards handle authentication errors

### 5. Security

- JWT tokens stored in localStorage
- Tokens automatically added to requests
- Guards protect routes
- Server validates tokens (not client)

---

## Summary

The byteurl project uses a **modern, scalable architecture**:

✅ **Feature-based** organization for maintainability
✅ **Standalone components** for simplicity
✅ **Lazy loading** for performance
✅ **Shared resources** for reusability
✅ **Route guards** for security
✅ **JWT authentication** for user management
✅ **RxJS** for reactive programming
✅ **TypeScript** for type safety

This organization makes it easy to:

- Add new features without affecting existing code
- Find and modify specific functionality
- Test components and services in isolation
- Scale the application as requirements grow
- Onboard new developers quickly

---

## Next Steps

To extend this application:

1. **Add a new feature**: Create folder in `features/`, follow the pattern
2. **Add shared component**: Create in `shared/components/` if reusable
3. **Add route guard**: Create in `shared/guards/` for new access rules
4. **Add HTTP interceptor**: Create in `shared/interceptors/` for request/response processing
5. **Add shared service**: Create in `shared/services/` if used across features
