import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { routes } from './app.routes';
import { UserAccountService } from './features/user-account/services/user-account.service';
import { JwtTokenService } from './shared/services/jwt-token.service';
import { ProjectService } from './features/projects/services/project.service';

// Functional interceptor for JWT tokens
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtTokenService = inject(JwtTokenService);
  const token = jwtTokenService.getStoredToken();
  
  if (token && !jwtTokenService.isTokenExpired(token)) {
    console.log('Adding JWT token to request:', req.url);
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  
  console.log('No token added to request:', req.url);
  return next(req);
};

// Functional interceptor for HTTP error handling
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid - clear and redirect to login
        jwtTokenService.removeToken();
        router.navigate(['/login']);
      }

      // Log error for debugging
      console.error('HTTP Error:', error.status, error.message);

      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    UserAccountService,
    JwtTokenService,
    ProjectService
  ]
};
