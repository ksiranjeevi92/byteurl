import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.routes').then((M) => M.AUTH_ROUTES),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/pages/login/login.component').then(
        (C) => C.LoginComponent
      ),
  },
];
