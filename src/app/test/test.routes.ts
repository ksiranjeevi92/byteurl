import { Routes } from '@angular/router';
import { TestComponent } from './test.component';

export const TEST_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'one',
        component: TestComponent,
      },
    ],
  },
];
