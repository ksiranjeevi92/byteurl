import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { profileCompleteGuard } from './shared/guards/profile-complete.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/user-account',
    pathMatch: 'full'
  },
  {
    path: 'user-account',
    loadChildren: () => import('./features/user-account/user-account.routes').then(m => m.userAccountRoutes)
  },
  {
    path: 'user-profile/complete',
    loadComponent: () => import('./features/user-profile/components/profile-complete/profile-complete').then(m => m.ProfileCompleteComponent),
    canActivate: [authGuard]
  },
  // Routes with header/footer layout (for authenticated users)
  {
    path: '',
    loadComponent: () => import('./shared/components/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [authGuard, profileCompleteGuard],
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
  {
    path: '**',
    redirectTo: '/user-account'
  }
];
