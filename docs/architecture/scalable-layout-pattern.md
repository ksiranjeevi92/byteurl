# Scalable Layout Pattern

## Problem

In the original implementation, the header and footer components were **repeated in every feature component** that needed them:

```typescript
// dashboard.ts
imports: [CommonModule, HeaderComponent, FooterComponent, RouterModule]

// projects-page.ts
imports: [CommonModule, HeaderComponent, FooterComponent, ProjectListComponent]

// project-detail.ts
imports: [CommonModule, ReactiveFormsModule, HeaderComponent, TaskModalComponent]

// profile.ts
imports: [CommonModule, ReactiveFormsModule, HeaderComponent]
```

And in each template:

```html
<!-- dashboard.html -->
<div class="dashboard-layout">
  <app-header></app-header>
  <main>...</main>
  <app-footer></app-footer>
</div>

<!-- projects-page.html -->
<div class="projects-page-layout">
  <app-header></app-header>
  <main>...</main>
  <app-footer></app-footer>
</div>

<!-- project-detail.html -->
<app-header></app-header>
<div class="project-detail-container">...</div>

<!-- profile.html -->
<app-header></app-header>
<div class="profile-container">...</div>
```

### Issues with this approach:

1. **Code Duplication**: Header/footer import and usage repeated in every authenticated page
2. **Maintenance Burden**: Changing the layout requires updating every component
3. **Inconsistency Risk**: Easy to forget the header/footer in new components
4. **Violation of DRY**: "Don't Repeat Yourself" principle not followed
5. **Harder to Scale**: Adding new shared UI elements (sidebar, notifications) requires touching all files

---

## Solution

Created a **MainLayoutComponent** that wraps all authenticated routes with a shared layout using Angular's child routing.

### Architecture

```
Routes:
├── /user-account/*         → Login, Register (no header/footer)
├── /user-profile/complete  → ProfileComplete (no header - profile setup)
└── MainLayoutComponent (contains header + footer)
    ├── /user-profile   → ProfileComponent
    ├── /dashboard      → DashboardComponent
    ├── /projects       → ProjectsPageComponent
    └── /projects/:id   → ProjectDetailComponent
```

### How it works

**main-layout.html**:
```html
<app-header></app-header>

<main class="main-content">
  <router-outlet></router-outlet>
</main>

<app-footer></app-footer>
```

**main-layout.ts**:
```typescript
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent {}
```

**app.routes.ts**:
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/user-account', pathMatch: 'full' },
  {
    path: 'user-account',
    loadChildren: () => import('./features/user-account/user-account.routes').then(m => m.userAccountRoutes)
  },
  {
    path: 'user-profile/complete',
    loadComponent: () => import('./features/user-profile/components/profile-complete/profile-complete').then(m => m.ProfileCompleteComponent),
    canActivate: [AuthGuard]
  },
  // Routes with header/footer layout (for authenticated users)
  {
    path: '',
    loadComponent: () => import('./shared/components/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard, ProfileCompleteGuard],
    children: [
      {
        path: 'user-profile',
        loadComponent: () => import('./features/user-profile/components/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/components/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/components/projects-page/projects-page').then(m => m.ProjectsPageComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/components/project-detail/project-detail').then(m => m.ProjectDetailComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/user-account' }
];
```

### Benefits

1. **Single Source of Truth**: Header and footer defined once in MainLayoutComponent
2. **Easy to Extend**: Add sidebar, notifications bar, or any shared UI in one place
3. **Cleaner Components**: Feature components focus only on their content
4. **Consistent Layout**: All authenticated pages automatically get the same layout
5. **Better Separation of Concerns**: Layout management vs. feature content clearly separated
6. **Guards at Layout Level**: Authentication and profile completion guards applied once to the layout
7. **Lazy Loading**: Child routes are lazy-loaded for better performance

### File Structure

```
src/app/
├── shared/
│   └── components/
│       ├── main-layout/
│       │   ├── main-layout.ts
│       │   ├── main-layout.html
│       │   └── main-layout.scss
│       ├── header/
│       └── footer/
└── features/
    ├── dashboard/
    │   └── components/dashboard/  (no header/footer imports)
    ├── projects/
    │   └── components/
    │       ├── projects-page/     (no header/footer imports)
    │       └── project-detail/    (no header/footer imports)
    └── user-profile/
        └── components/profile/    (no header/footer imports)
```
