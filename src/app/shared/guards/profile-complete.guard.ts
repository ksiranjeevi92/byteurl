import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap, catchError } from 'rxjs';
import { UserProfileService } from '../../features/user-profile/services/user-profile.service';
import { JwtTokenService } from '../services/jwt-token.service';

export const profileCompleteGuard: CanActivateFn = () => {
  const userProfileService = inject(UserProfileService);
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);

  const email = jwtTokenService.getEmailFromToken();

  if (!email) {
    router.navigate(['/user-account/login']);
    return of(false);
  }

  return userProfileService.getUserProfileByEmail(email).pipe(
    switchMap(profile => {
      if (userProfileService.isProfileComplete(profile)) {
        return of(true);
      } else {
        router.navigate(['/user-profile/complete']);
        return of(false);
      }
    }),
    catchError(() => {
      router.navigate(['/user-profile/complete']);
      return of(false);
    })
  );
};
