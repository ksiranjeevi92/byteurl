import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtTokenService } from '../services/jwt-token.service';

export const authGuard: CanActivateFn = () => {
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);

  if (jwtTokenService.isAuthenticated()) {
    return true;
  }

  console.warn('Access denied. Redirecting to login.');
  router.navigate(['/user-account/login']);
  return false;
};
