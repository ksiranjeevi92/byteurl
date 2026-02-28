import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly apiUrl = 'http://localhost:8080/api/user-profiles';

  constructor(private http: HttpClient) {}

  getUserProfileByEmail(email: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/email/${email}`);
  }

  createUserProfile(profile: CreateUserProfileRequest): Observable<UserProfile> {
    console.log('Creating user profile:', profile);
    console.log('API URL:', `${this.apiUrl}`);
    return this.http.post<UserProfile>(`${this.apiUrl}`, profile);
  }

  updateUserProfile(profile: UpdateUserProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}`, profile);
  }

  isProfileComplete(profile: UserProfile): boolean {
    const isComplete = !!(profile.firstName && profile.lastName);
    console.log('Checking profile completeness:', {
      profile,
      firstName: profile.firstName,
      lastName: profile.lastName,
      isComplete
    });
    return isComplete;
  }
}