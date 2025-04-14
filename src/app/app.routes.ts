import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test',
    loadChildren: () => import('./test/test.routes').then((M) => M.TEST_ROUTES),
  },
];
