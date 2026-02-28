import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, of, catchError } from 'rxjs';
import { UserAccountRequest, UserAccountResponse, LoginCredentials, LoginResponse } from '../models/user-account.model';
import { UserProfileService } from '../../user-profile/services/user-profile.service';
import { UserProfile } from '../../user-profile/models/user-profile.model';
import { JwtTokenService } from '../../../shared/services/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  private readonly apiUrl = 'http://localhost:8080/api/users';
  private readonly authApiUrl = 'http://localhost:8080/api/auth';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private userProfileService: UserProfileService,
    private jwtTokenService: JwtTokenService
  ) { }

  createUser(user: UserAccountRequest): Observable<UserAccountResponse> {
    return this.http.post<UserAccountResponse>(`${this.apiUrl}/create`, user, this.httpOptions);
  }

  getUserById(id: number): Observable<UserAccountResponse> {
    return this.http.get<UserAccountResponse>(`${this.apiUrl}/${id}`);
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApiUrl}/login`, credentials, this.httpOptions);
  }

  loginWithProfile(credentials: LoginCredentials): Observable<{loginResponse: LoginResponse, userProfile: UserProfile | null}> {
    return this.login(credentials).pipe(
      switchMap(loginResponse => {
        // Store token immediately after login so it can be used for profile fetch
        this.jwtTokenService.storeToken(loginResponse.token);

        return this.userProfileService.getUserProfileByEmail(credentials.email).pipe(
          switchMap(userProfile => {
            console.log('Profile fetched successfully:', userProfile);
            return of({loginResponse, userProfile});
          }),
          catchError((error) => {
            console.log('Profile fetch error (user has no profile):', error);
            return of({loginResponse, userProfile: null});
          })
        );
      })
    );
  }

  logout(): void {
    this.jwtTokenService.removeToken();
  }
}