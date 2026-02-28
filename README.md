# Operis Angular Frontend

This project is the frontend Angular application for the Operis microservices platform. It provides user interfaces for user management, project management, and subscription services.

## Architecture Overview

The application connects to the Operis backend through the API Gateway running on `localhost:8080`. The backend consists of several microservices:

- **User Account Service** (Port 8081) - Authentication and user management
- **User Profile Service** (Port 8083) - User profile data
- **Project Service** (Port 8082) - Project and task management
- **Subscription Service** (Port 8084) - User subscriptions and features
- **API Gateway** (Port 8080) - Single entry point for all API calls
- **Discovery Service** (Port 8761) - Eureka service registry
- **Config Server** (Port 8888) - Centralized configuration

## Login Implementation

The application now includes a complete login system that authenticates users against the Operis backend and manages JWT tokens.

### Login Implementation Steps

#### Step 1: Added Login Models

- Extended `user-account.model.ts` with `LoginCredentials` and `LoginResponse` interfaces
- `LoginCredentials`: Contains email and password for authentication
- `LoginResponse`: Contains the JWT token returned from the API

#### Step 2: Created Login Component (Standalone)

- Created `UserLoginComponent` as a standalone component in `src/app/features/user-account/components/user-login/`
- Component includes form validation, error handling, and loading states
- Includes navigation link to registration page
- Stores JWT token in localStorage upon successful login

#### Step 3: Updated UserAccountService

- Added `login(credentials: LoginCredentials)` method
- Configured API endpoint: `http://localhost:8080/api/auth/login`
- Method calls the AuthController in operis-user-account-service

#### Step 4: Updated Routing Configuration

- Added login route to `user-account.routes.ts`
- Changed default redirect from 'register' to 'login'
- Added navigation between login and registration components

#### Step 5: Enhanced Login Page Design (Updated)

- Added prominent **Operis** branding with gradient logo
- Included "Project Management Platform" tagline for clear positioning
- Enhanced visual design with gradient background and subtle pattern overlay
- Added platform features showcase (Project Management, Team Collaboration, Analytics, Fast & Reliable)
- Improved card design with larger padding, rounded corners, and professional shadows
- Mobile-responsive design with optimized layouts for all screen sizes

### Authentication Flow

1. **Frontend**: User enters email and password in login form
2. **API Call**: POST request to `http://localhost:8080/api/auth/login`
3. **Backend**: AuthController authenticates credentials using Spring Security
4. **JWT Generation**: Backend generates JWT token with 1-hour expiration
5. **Response**: Frontend receives JWT token in LoginResponseDTO
6. **Storage**: JWT token stored in localStorage for future API calls

### Login API Details

**Endpoint**: `POST http://localhost:8080/api/auth/login`
**Payload**:

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### Current Routes Structure

- **Main Route**: `/user-account` (lazy loads userAccountRoutes)
- **Login Route**: `/user-account/login` (UserLoginComponent - default)
- **Registration Route**: `/user-account/register` (UserRegistrationComponent)
- **Dashboard Route**: `/dashboard` (DashboardComponent - post-login)
- **Default Redirect**: `/` → `/user-account` → `/user-account/login`

## Dashboard Implementation (Added)

The application now includes a complete dashboard layout with header, content, and footer that users see after successful login.

### Dashboard Implementation Steps

#### Step 1: Created Shared Components

- **HeaderComponent**: Standalone component with navigation, user info, and logout functionality
- **FooterComponent**: Standalone component with copyright and footer links
- Both components are reusable across the application

#### Step 2: Created Dashboard Component

- **DashboardComponent**: Main dashboard as standalone component
- Imports and uses HeaderComponent and FooterComponent
- Contains welcome message and placeholder sections for future features

#### Step 3: Added Dashboard Route

- Added `/dashboard` route to main app routes using `loadComponent` for lazy loading
- Route loads DashboardComponent as a standalone component

#### Step 4: Updated Login Flow

- Modified `UserLoginComponent` to redirect to `/dashboard` after successful login
- Complete authentication flow: Login → JWT Token → Dashboard

### Dashboard Structure

```
Dashboard Layout:
├── Header
│   ├── Logo (Operis)
│   ├── Navigation Menu (Dashboard, Projects, Profile)
│   └── User Section (Email, Logout Button)
├── Main Content
│   ├── Welcome Section
│   │   ├── "Welcome to Operis" title
│   │   ├── Welcome message
│   │   └── Getting Started card
│   └── Placeholder Cards
│       ├── Projects (future project list)
│       ├── Analytics (future metrics)
│       └── Team (future collaboration)
└── Footer
    ├── Copyright information
    └── Footer links (Privacy, Terms, Support)
```

### Dashboard Features

- ✅ **Responsive Design**: Mobile-first approach with responsive grid layouts
- ✅ **Professional Styling**: Consistent with brand colors and modern UI patterns
- ✅ **Header Navigation**: Logo, menu items, and user controls
- ✅ **Welcome Content**: Personalized greeting with platform introduction
- ✅ **Logout Functionality**: Secure logout that clears JWT token and redirects to login
- ✅ **Placeholder Sections**: Ready for future project list and features
- ✅ **Standalone Components**: All components follow Angular 17+ best practices

### Enhanced Login Page Features

- ✅ **Operis Branding**: Prominent logo with gradient styling and platform tagline
- ✅ **Professional Design**: Gradient background with subtle pattern overlay
- ✅ **Platform Showcase**: Feature highlights (Project Management, Team Collaboration, Analytics, Performance)
- ✅ **Enhanced UX**: Larger form card with improved spacing and visual hierarchy
- ✅ **Mobile Optimized**: Fully responsive design that works on all devices
- ✅ **Consistent Styling**: Matches overall application design system
- ✅ **Clear Navigation**: Easy access to registration page for new users

## JWT Token Management (Added)

The application now includes comprehensive JWT token management for secure authentication and user information extraction.

### JWT Implementation Steps

#### Step 1: Created JWT Token Service

- **JwtTokenService**: Standalone service for JWT token operations
- Client-side JWT decoding (without verification - for reading data only)
- Base64URL decoding implementation for JWT payload extraction
- Token expiration checking and validation

#### Step 2: Email Extraction from JWT

- Extracts user email from JWT token `subject` field
- Real-time token validation and expiration checking
- Automatic redirection to login when token is invalid or expired

#### Step 3: Enhanced Header Component

- Displays actual user email from JWT token instead of placeholder
- Shows token expiration warning when < 30 minutes remaining
- Secure logout functionality that properly clears tokens
- Automatic authentication checking on component initialization

#### Step 4: Authentication Guard

- **AuthGuard**: Protects dashboard route from unauthenticated access
- Automatic redirection to login for invalid/expired tokens
- Integrated with Angular routing system

#### Step 5: Updated App Configuration

- Added JWT service to application providers
- Configured authentication guard for protected routes

### JWT Features

- ✅ **Client-side Decoding**: Safe extraction of user data from JWT payload
- ✅ **Email Display**: Real user email shown in header from token subject
- ✅ **Token Validation**: Automatic expiration checking and handling
- ✅ **Secure Logout**: Proper token cleanup on logout
- ✅ **Route Protection**: Dashboard protected by authentication guard
- ✅ **Expiration Warnings**: Visual indication when token expires soon
- ✅ **Auto-redirect**: Seamless redirect to login for expired tokens

## Project List Navigation (Added)

The application now includes a dedicated Projects page accessible through header navigation, displaying the complete project list from the operis-project-service backend.

### Navigation-Based Implementation

#### Step 1: Created Projects Page

- **ProjectsPageComponent**: Dedicated standalone page component for projects
- Full page layout with header, footer, and project list content
- Separate route from dashboard for clean navigation

#### Step 2: Enhanced Header Navigation

- Converted static navigation links to functional buttons
- Added route active state detection and highlighting
- Click handlers for Dashboard, Projects, and Profile navigation
- Real-time navigation state updates

#### Step 3: Added Projects Route

- New `/projects` route protected by authentication guard
- Lazy-loaded ProjectsPageComponent for performance
- Consistent with existing routing patterns

#### Step 4: Project List Integration

- Reused existing ProjectListComponent in the new Projects page
- Maintained all project list features (loading, error handling, etc.)
- Clean separation between dashboard and project management

### Navigation Flow

1. **Login Success**: User redirects to `/dashboard`
2. **Header Navigation**: User clicks "Projects" button in header
3. **Route Navigation**: App navigates to `/projects` page
4. **Project List Display**: Shows complete list with project data
5. **Active State**: "Projects" button highlighted in header

### Updated Routes Structure

- **Dashboard Route**: `/dashboard` - Welcome page with platform overview
- **Projects Route**: `/projects` - Dedicated page for project list and management
- **Profile Route**: `/profile` - Future user profile management page

### Features

- ✅ **Functional Navigation**: Header buttons navigate between pages
- ✅ **Active State Indication**: Current page highlighted in navigation
- ✅ **Real Project Data**: Fetches from operis-project-service API
- ✅ **Clean Separation**: Dashboard and projects are separate concerns
- ✅ **Consistent Layout**: Same header/footer across all pages
- ✅ **Route Protection**: All authenticated pages protected by auth guard

## Development server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

**Note**: Make sure the Operis backend services are running on `localhost:8080` (Gateway) for the frontend to work properly.

## Project Structure

```
src/app/
├── features/
│   ├── user-account/
│   │   ├── user-account.routes.ts (functional routing)
│   │   ├── components/
│   │   │   ├── user-login/
│   │   │   │   ├── user-login.ts (standalone component)
│   │   │   │   ├── user-login.html
│   │   │   │   └── user-login.scss
│   │   │   └── user-registration/
│   │   │       ├── user-registration.ts (standalone component)
│   │   │       ├── user-registration.html
│   │   │       └── user-registration.scss
│   │   ├── services/
│   │   │   └── user-account.service.ts (includes login method)
│   │   └── models/
│   │       └── user-account.model.ts (includes login models)
│   ├── dashboard/
│   │   └── components/
│   │       ├── dashboard.ts (standalone component)
│   │       ├── dashboard.html
│   │       └── dashboard.scss
│   └── projects/
│       ├── models/
│       │   └── project.model.ts (ProjectDto, TaskDto interfaces)
│       ├── services/
│       │   └── project.service.ts (API service with JWT integration)
│       └── components/
│           ├── projects-page/
│           │   ├── projects-page.ts (standalone page component)
│           │   ├── projects-page.html
│           │   └── projects-page.scss
│           └── project-list/
│               ├── project-list.ts (standalone component)
│               ├── project-list.html
│               └── project-list.scss
├── shared/
│   ├── components/
│   │   ├── header/
│   │   │   ├── header.ts (standalone component with functional navigation)
│   │   │   ├── header.html
│   │   │   └── header.scss
│   │   └── footer/
│   │       ├── footer.ts (standalone component)
│   │       ├── footer.html
│   │       └── footer.scss
│   ├── services/
│   │   └── jwt-token.service.ts (JWT decoding and management)
│   └── guards/
│       └── auth.guard.ts (route protection)
├── app.routes.ts (lazy loading standalone routes)
├── app.config.ts (service providers)
└── app.html
```

### Routing Structure (Updated for Standalone)

- **Main Route**: `/user-account` (lazy loads userAccountRoutes)
- **Feature Route**: `/user-account/register` (UserRegistrationComponent - standalone)
- **Default Redirect**: `/` → `/user-account` → `/user-account/register`

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Docker & NGINX Deployment

This project includes production-ready Docker configuration using NGINX as the web server.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DOCKER CONTAINER                                 │
│                                                                          │
│   ┌──────────────────┐              ┌─────────────────────────────────┐ │
│   │      NGINX       │    serves    │     Built Angular App           │ │
│   │    (port 80)     │ ───────────► │   (static HTML/JS/CSS files)    │ │
│   │                  │              │                                  │ │
│   └──────────────────┘              └─────────────────────────────────┘ │
│            ▲                                                             │
└────────────│─────────────────────────────────────────────────────────────┘
             │
             │ port mapping (4200:80)
             │
      ┌──────┴──────┐
      │   Browser   │
      │ localhost:4200
      └─────────────┘
```

### Multi-Stage Build Process

```
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: BUILD (node:18-alpine)                                        │
│                                                                          │
│    npm ci          →    ng build         →    dist/byteurl/      │
│    (install deps)       (compile app)         browser/ (output)         │
│                                                                          │
└────────────────────────────────────────┬────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 2: RUN (nginx:alpine)                                            │
│                                                                          │
│    Copy static files    →    Configure NGINX    →    Serve on port 80   │
│    from Stage 1              (nginx.conf)                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Why NGINX Instead of Node.js?

| Feature          | NGINX                | Node.js (ng serve)  |
| ---------------- | -------------------- | ------------------- |
| **Performance**  | 10,000+ requests/sec | ~1,000 requests/sec |
| **Memory Usage** | ~10 MB               | ~200+ MB            |
| **Purpose**      | Production           | Development         |
| **Hot Reload**   | No                   | Yes                 |
| **Static Files** | Optimized            | Not optimized       |

### NGINX Features (nginx.conf)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         NGINX CONFIGURATION                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ Gzip Compression│  Reduces file sizes by 60-80%                      │
│  └─────────────────┘                                                     │
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ Static Caching  │  JS/CSS cached for 1 year (immutable)              │
│  └─────────────────┘                                                     │
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ SPA Routing     │  All routes → index.html (Angular handles routing) │
│  └─────────────────┘                                                     │
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ Security Headers│  X-Frame-Options, X-Content-Type-Options, etc.     │
│  └─────────────────┘                                                     │
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ API Proxy       │  /api/* → backend service (for Kubernetes)         │
│  └─────────────────┘                                                     │
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ Health Check    │  /health endpoint for container orchestration      │
│  └─────────────────┘                                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Docker Files

| File                 | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `Dockerfile`         | Multi-stage build (Node build → NGINX serve) |
| `docker-compose.yml` | Container orchestration                      |
| `nginx.conf`         | NGINX configuration                          |
| `.dockerignore`      | Excludes files from build context            |

### Running with Docker Compose

```bash
# Build and run (foreground)
docker-compose up --build

# Build and run (background)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild without cache
docker-compose build --no-cache
```

App will be available at: **http://localhost:4200**

### Running with Docker Only

```bash
# Build the image
docker build -t byteurl .

# Run the container
docker run -p 4200:80 byteurl

# Run in background
docker run -d -p 4200:80 --name byteurl byteurl

# Stop and remove
docker stop byteurl && docker rm byteurl
```

### Development vs Production

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT (ng serve)                                │
│                                                                          │
│    ✅ Hot reload (instant updates)                                      │
│    ✅ Source maps (debugging)                                           │
│    ✅ Fast startup                                                       │
│    ❌ Not optimized                                                      │
│    ❌ High memory usage                                                  │
│                                                                          │
│    Command: npm start                                                    │
│    URL: http://localhost:4200                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION (Docker + NGINX)                           │
│                                                                          │
│    ✅ Optimized bundle (minified, tree-shaken)                          │
│    ✅ Gzip compression                                                   │
│    ✅ Static file caching                                                │
│    ✅ Low memory usage (~10 MB)                                          │
│    ✅ High performance (10,000+ req/sec)                                 │
│    ✅ Security headers                                                   │
│    ❌ No hot reload                                                      │
│                                                                          │
│    Command: docker-compose up --build                                    │
│    URL: http://localhost:4200                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Container Size Comparison

```
┌────────────────────┬─────────────┬───────────────────────────────────────┐
│ Image              │ Size        │ Contains                              │
├────────────────────┼─────────────┼───────────────────────────────────────┤
│ node:18-alpine     │ ~170 MB     │ Node.js runtime + npm                 │
│ nginx:alpine       │ ~25 MB      │ NGINX only                            │
│ byteurl     │ ~30 MB      │ NGINX + built Angular app             │
└────────────────────┴─────────────┴───────────────────────────────────────┘
```

The multi-stage build discards the Node.js layer, keeping only NGINX and the compiled static files.

## Firebase Hosting Deployment

Firebase Hosting is Google's static hosting service with global CDN, automatic HTTPS, and free tier.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FIREBASE DEPLOYMENT FLOW                            │
│                                                                          │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────────────────┐ │
│   │  ng build   │ ──►  │   dist/     │ ──►  │  Firebase CDN           │ │
│   │  (local)    │      │   browser/  │      │  (global edge servers)  │ │
│   └─────────────┘      └─────────────┘      └─────────────────────────┘ │
│                                                      │                   │
└──────────────────────────────────────────────────────│───────────────────┘
                                                       ▼
                                              https://your-app.web.app
                                              https://your-app.firebaseapp.com
```

### Firebase vs Docker/NGINX

| Feature            | Firebase Hosting         | Docker + NGINX              |
| ------------------ | ------------------------ | --------------------------- |
| **Setup**          | Very easy                | More complex                |
| **Cost**           | Free tier available      | Server costs                |
| **SSL**            | Automatic HTTPS          | Manual setup                |
| **CDN**            | Global CDN included      | Need separate CDN           |
| **Custom domain**  | Supported                | Supported                   |
| **Server control** | None (static only)       | Full control                |
| **API proxy**      | No (use Cloud Functions) | Yes                         |
| **Best for**       | Static sites, SPAs       | Full control, microservices |

### Firebase Files

| File            | Purpose                                     |
| --------------- | ------------------------------------------- |
| `firebase.json` | Hosting config (rewrites, headers, caching) |
| `.firebaserc`   | Project settings                            |

### Initial Setup (One-time)

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase

```bash
firebase login
```

This opens a browser for Google authentication.

#### Step 3: Create Firebase Project in Console

1. Go to https://console.firebase.google.com
2. Click **"Create a project"** (or "Add project")

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FIREBASE CONSOLE - CREATE PROJECT                     │
│                                                                          │
│   Step 1: Enter project name                                            │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  Project name: byteurl                                    │   │
│   │  Project ID:   byteurl (auto-generated, can edit)        │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   Step 2: Google Analytics (optional)                                   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  [ ] Enable Google Analytics  (can skip for demo)               │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   Step 3: Click "Create project"                                        │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  ⏳ Creating project... (takes ~30 seconds)                      │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

3. Once created, click **"Continue"** to enter the project dashboard

#### Step 4: Find Your Project ID

1. In Firebase Console, click the **gear icon** (Project Settings)
2. Copy the **Project ID** (not the Project Name)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROJECT SETTINGS                                      │
│                                                                          │
│   Project name:   Operis Angular                                        │
│   Project ID:     byteurl  ← Copy this value                     │
│   Project number: 123456789                                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 5: Update .firebaserc

Edit `.firebaserc` with your project ID:

```json
{
  "projects": {
    "default": "byteurl"
  }
}
```

#### Step 6: Deploy

```bash
npm run deploy
```

### Deploy Commands

```bash
# Build and deploy to production
npm run deploy

# Deploy to preview channel (temporary URL for testing)
npm run deploy:preview

# Or manually:
ng build
firebase deploy
```

### Firebase Configuration (firebase.json)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       FIREBASE.JSON FEATURES                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ SPA Rewrites    │  All routes → index.html (Angular handles routing) │
│  └─────────────────┘                                                     │
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ Security Headers│  X-Frame-Options, X-Content-Type-Options, XSS      │
│  └─────────────────┘                                                     │
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ Asset Caching   │  JS/CSS/images cached for 1 year (immutable)       │
│  └─────────────────┘                                                     │
│                                                                          │
│  ┌─────────────────┐                                                     │
│  │ HTML No-Cache   │  index.html always fetched fresh                   │
│  └─────────────────┘                                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Preview Channels

Firebase preview channels create temporary URLs for testing before production:

```bash
# Create preview channel
npm run deploy:preview

# Output:
# ✔ Channel URL: https://your-project--preview-abc123.web.app
# (expires in 7 days)
```

### Custom Domain Setup

1. Go to Firebase Console → Hosting → Add custom domain
2. Verify domain ownership (DNS TXT record)
3. Update DNS A records to Firebase IPs
4. SSL certificate is provisioned automatically

## Running unit tests

### Testing Stack

| Tool                | Role              | Description                                                        |
| ------------------- | ----------------- | ------------------------------------------------------------------ |
| **Jasmine**         | Testing Framework | Provides `describe()`, `it()`, `expect()` syntax for writing tests |
| **Karma**           | Test Runner       | Executes tests in real browsers, reports results                   |
| **Angular TestBed** | Testing Utilities | Configures and creates Angular components/services for testing     |

### How They Work Together

```
┌─────────────────────────────────────────────────────────┐
│  You write tests using Jasmine syntax (describe, it)    │
│                         ↓                               │
│  Karma launches a browser (Chrome/ChromeHeadless)       │
│                         ↓                               │
│  Angular TestBed creates components/services            │
│                         ↓                               │
│  Karma runs tests and reports results                   │
└─────────────────────────────────────────────────────────┘
```

### Test Commands - All Modes

```bash
# Watch mode (default) - re-runs tests on file changes
ng test

# Run once and exit
ng test --no-watch

# Headless mode - no browser window (for CI/CD)
ng test --no-watch --browsers=ChromeHeadless

# With code coverage report
ng test --no-watch --code-coverage

# Headless with coverage (CI/CD)
ng test --no-watch --browsers=ChromeHeadless --code-coverage

# Run specific test file
ng test --include=**/user-account.service.spec.ts

# Run tests matching a pattern
ng test --include=**/user-registration.spec.ts
```

### Mode Comparison

| Mode           | Command                                        | Use Case                           |
| -------------- | ---------------------------------------------- | ---------------------------------- |
| **Watch**      | `ng test`                                      | Development - auto re-runs on save |
| **Single Run** | `ng test --no-watch`                           | Quick check before commit          |
| **Headless**   | `ng test --no-watch --browsers=ChromeHeadless` | CI/CD pipelines, no UI needed      |
| **Coverage**   | `ng test --code-coverage`                      | Check test coverage percentage     |

### Example: Testing UserAccountService

#### Service Code (`user-account.service.ts`)

```typescript
@Injectable({ providedIn: "root" })
export class UserAccountService {
  private readonly apiUrl = "http://localhost:8080/api/users";

  constructor(private http: HttpClient) {}

  createUser(user: UserAccountRequest): Observable<UserAccountResponse> {
    return this.http.post<UserAccountResponse>(`${this.apiUrl}/create`, user);
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApiUrl}/login`, credentials);
  }
}
```

#### Test Code (`user-account.service.spec.ts`)

```typescript
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { UserAccountService } from "./user-account.service";

describe("UserAccountService", () => {
  let service: UserAccountService;
  let httpMock: HttpTestingController;

  // Setup before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient
        provideHttpClientTesting(), // Mocks HTTP requests
        UserAccountService,
      ],
    });
    service = TestBed.inject(UserAccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Verify no pending HTTP requests
  afterEach(() => {
    httpMock.verify();
  });

  // Test: Service is created
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // Test: createUser makes correct HTTP call
  it("should call POST /api/users/create with correct payload", () => {
    const mockRequest = { email: "test@example.com", password: "password123" };
    const mockResponse = { id: 1, email: "test@example.com", createdAt: "", updatedAt: "" };

    // Call the service method
    service.createUser(mockRequest).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Expect HTTP request and verify
    const req = httpMock.expectOne("http://localhost:8080/api/users/create");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(mockRequest);

    // Return mock response
    req.flush(mockResponse);
  });

  // Test: login makes correct HTTP call
  it("should call POST /api/auth/login with credentials", () => {
    const credentials = { email: "test@example.com", password: "password123" };
    const mockResponse = { token: "mock-jwt-token" };

    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne("http://localhost:8080/api/auth/login");
    expect(req.request.method).toBe("POST");
    req.flush(mockResponse);
  });
});
```

### Example: Testing UserRegistrationComponent

#### Test Code (`user-registration.spec.ts`)

```typescript
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { UserRegistrationComponent } from "./user-registration";
import { UserAccountService } from "../../services/user-account.service";

describe("UserRegistrationComponent", () => {
  let component: UserRegistrationComponent;
  let fixture: ComponentFixture<UserRegistrationComponent>;
  let userAccountServiceSpy: jasmine.SpyObj<UserAccountService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for dependencies
    userAccountServiceSpy = jasmine.createSpyObj("UserAccountService", ["createUser"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [UserRegistrationComponent, ReactiveFormsModule],
      providers: [
        { provide: UserAccountService, useValue: userAccountServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test: Form validation
  it("should have invalid form when fields are empty", () => {
    expect(component.registrationForm.valid).toBeFalse();
  });

  it("should have valid form with correct data", () => {
    component.registrationForm.patchValue({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(component.registrationForm.valid).toBeTrue();
  });

  // Test: Form submission
  it("should call createUser on valid submit", () => {
    userAccountServiceSpy.createUser.and.returnValue(of(mockUserResponse));
    component.registrationForm.patchValue({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    component.onSubmit();

    expect(userAccountServiceSpy.createUser).toHaveBeenCalled();
  });

  // Test: DOM rendering
  it("should render form inputs", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("input#email")).toBeTruthy();
    expect(compiled.querySelector("input#password")).toBeTruthy();
  });
});
```

### Key Testing Concepts

| Concept                            | Description                               |
| ---------------------------------- | ----------------------------------------- |
| `TestBed.configureTestingModule()` | Sets up the testing module with providers |
| `provideHttpClient()`              | Provides real HttpClient infrastructure   |
| `provideHttpClientTesting()`       | Intercepts HTTP calls for testing         |
| `HttpTestingController`            | Controls and verifies HTTP requests       |
| `jasmine.createSpyObj()`           | Creates mock objects with spy methods     |
| `fixture.detectChanges()`          | Triggers Angular change detection         |
| `fakeAsync() / tick()`             | Controls async operations in tests        |
| `httpMock.expectOne(url)`          | Expects exactly one request to URL        |
| `req.flush(data)`                  | Returns mock response data                |

### Test File Locations

```
src/app/features/user-account/
├── services/
│   ├── user-account.service.ts
│   └── user-account.service.spec.ts    # Service tests
└── components/
    └── user-registration/
        ├── user-registration.ts
        └── user-registration.spec.ts   # Component tests
```

### Code Coverage Report

After running with `--code-coverage`, open:

```
coverage/byteurl/index.html
```

### npm Scripts (Optional)

Add to `package.json` for convenience:

```json
{
  "scripts": {
    "test": "ng test",
    "test:once": "ng test --no-watch",
    "test:headless": "ng test --no-watch --browsers=ChromeHeadless",
    "test:coverage": "ng test --no-watch --code-coverage"
  }
}
```

Then run:

```bash
npm run test:headless
npm run test:coverage
```

## Running unit tests with Vitest

This project also supports **Vitest** as an alternative testing framework for pure TypeScript logic.

### Why Vitest?

Vitest is a fast, modern testing framework built on Vite. It's particularly useful for testing pure TypeScript code without Angular dependencies.

### Vitest Configuration

#### Step 1: Install Dependencies

```bash
npm install -D vitest jsdom
```

| Package  | Purpose                                                               |
| -------- | --------------------------------------------------------------------- |
| `vitest` | The test runner                                                       |
| `jsdom`  | Browser environment simulation (for `localStorage`, `document`, etc.) |

#### Step 2: Create `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enable global describe/it/expect
    environment: "jsdom", // Simulate browser environment
    include: ["src/**/*.vitest.ts"], // Only run *.vitest.ts files
    setupFiles: ["src/test-setup.ts"], // Setup file for mocks
  },
});
```

#### Step 3: Create `src/test-setup.ts`

This file mocks browser APIs like `localStorage`:

```typescript
import { vi } from "vitest";

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

// Helper to reset between tests
export const resetLocalStorage = () => {
  localStorageMock.store = {};
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
};
```

#### Step 4: Add npm Scripts to `package.json`

```json
{
  "scripts": {
    "test": "ng test",
    "test:vitest": "vitest",
    "test:vitest:run": "vitest run"
  }
}
```

#### Project Structure

```
byteurl/
├── vitest.config.ts                 # Vitest configuration
├── src/
│   ├── test-setup.ts                # Mocks for browser APIs
│   └── app/
│       └── shared/
│           └── services/
│               ├── jwt-token.service.ts         # Service
│               └── jwt-token.service.vitest.ts  # Vitest tests (22 tests)
```

### How Vitest Uses the Configuration

Vitest automatically discovers `vitest.config.ts` - no explicit reference needed:

```
npm run test:vitest
       ↓
vitest command executes
       ↓
Auto-discovers vitest.config.ts
       ↓
Runs setupFiles (src/test-setup.ts)
       ↓
Finds files matching include pattern (src/**/*.vitest.ts)
       ↓
Executes tests
```

This is convention-based configuration, similar to `angular.json` or `tsconfig.json`.

### Running Vitest

```bash
# Watch mode - re-runs tests on file changes
npm run test:vitest

# Single run
npm run test:vitest:run
```

### File Naming Convention

| Framework     | File Pattern  | Command               |
| ------------- | ------------- | --------------------- |
| Jasmine/Karma | `*.spec.ts`   | `npm test`            |
| Vitest        | `*.vitest.ts` | `npm run test:vitest` |

### Example: Testing JwtTokenService with Vitest

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { resetLocalStorage } from "../../../test-setup";
import { JwtTokenService } from "./jwt-token.service";

describe("JwtTokenService (Vitest)", () => {
  let service: JwtTokenService;

  // Helper to create a valid JWT token
  const createMockToken = (expiresInSeconds: number): string => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: "test@example.com",
        exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
        iat: Math.floor(Date.now() / 1000),
      }),
    );
    const signature = "mock-signature";
    return `${header}.${payload}.${signature}`;
  };

  beforeEach(() => {
    resetLocalStorage();
    service = new JwtTokenService();
  });

  it("should return true when valid token exists", () => {
    const token = createMockToken(3600); // expires in 1 hour
    localStorage.setItem("jwt_token", token);

    expect(service.isAuthenticated()).toBe(true);
  });

  it("should return false when no token exists", () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it("should decode token and extract email", () => {
    const token = createMockToken(3600);
    localStorage.setItem("jwt_token", token);

    expect(service.getEmailFromToken()).toBe("test@example.com");
  });
});
```

### Syntax Comparison: Jasmine vs Vitest

| Feature        | Jasmine                          | Vitest                               |
| -------------- | -------------------------------- | ------------------------------------ |
| Mock function  | `jasmine.createSpy()`            | `vi.fn()`                            |
| Spy on method  | `spyOn(obj, 'method')`           | `vi.spyOn(obj, 'method')`            |
| Return value   | `spy.and.returnValue(x)`         | `mock.mockReturnValue(x)`            |
| Verify called  | `expect(spy).toHaveBeenCalled()` | `expect(mock).toHaveBeenCalled()`    |
| Setup/Teardown | `beforeEach()`, `afterEach()`    | `beforeEach()`, `afterEach()` (same) |
| Test structure | `describe()`, `it()`             | `describe()`, `it()` (same)          |

---

## Jasmine/Karma vs Vitest: Recommendation for Angular 20

### When to use Jasmine/Karma (Recommended for Angular)

| Use Case               | Why                                             |
| ---------------------- | ----------------------------------------------- |
| **Components**         | Full Angular TestBed support, template testing  |
| **Guards with DI**     | `inject()` requires Angular's injection context |
| **Directives & Pipes** | Need Angular compilation                        |
| **HTTP testing**       | `HttpTestingController` integration             |
| **Official support**   | Angular CLI default, maintained by Angular team |

### When to use Vitest

| Use Case                     | Why                                            |
| ---------------------------- | ---------------------------------------------- |
| **Pure TypeScript services** | No Angular DI needed, just class instantiation |
| **Utility functions**        | Simple logic, no framework dependencies        |
| **Models/Interfaces**        | Type validation, data transformation           |
| **Speed**                    | 10-100x faster than Karma for pure logic       |

### Recommendation for Angular 20

```
┌─────────────────────────────────────────────────────────────────┐
│                    RECOMMENDATION                                │
├─────────────────────────────────────────────────────────────────┤
│  Use Jasmine/Karma as PRIMARY testing framework                 │
│  - Official Angular support                                     │
│  - Full DI and TestBed integration                              │
│  - Component and template testing                               │
│                                                                 │
│  Use Vitest as SUPPLEMENTARY for:                               │
│  - Pure TypeScript utility functions                            │
│  - Services without Angular dependencies                        │
│  - Fast feedback during development                             │
└─────────────────────────────────────────────────────────────────┘
```

### Current Limitation with Angular 20

The `@analogjs/vite-plugin-angular` (required for full Angular + Vitest integration) does not yet fully support Angular 20. Until support is added:

- **Jasmine/Karma**: Full Angular testing (components, guards, services with DI)
- **Vitest**: Pure TypeScript only (no `inject()`, no `TestBed`)

### Test Files in This Project

```
src/app/shared/
├── services/
│   ├── jwt-token.service.ts           # The service
│   └── jwt-token.service.vitest.ts    # Vitest tests (22 tests)
```

---

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
