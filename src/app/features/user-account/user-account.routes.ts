import { Routes } from '@angular/router';

export const userAccountRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/user-login/user-login').then(m => m.UserLoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/user-registration/user-registration').then(m => m.UserRegistrationComponent)
  }
];