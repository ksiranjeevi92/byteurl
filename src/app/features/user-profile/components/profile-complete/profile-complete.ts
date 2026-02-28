import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../services/user-profile.service';
import { JwtTokenService } from '../../../../shared/services/jwt-token.service';
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest } from '../../models/user-profile.model';

@Component({
  selector: 'app-profile-complete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-complete.html',
  styleUrl: './profile-complete.scss'
})
export class ProfileCompleteComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  existingProfile: UserProfile | null = null;
  userEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['']
    });
  }

  ngOnInit(): void {
    this.userEmail = this.jwtTokenService.getEmailFromToken() || '';
    
    if (!this.userEmail) {
      this.router.navigate(['/user-account/login']);
      return;
    }

    this.loadExistingProfile();
  }

  loadExistingProfile(): void {
    this.userProfileService.getUserProfileByEmail(this.userEmail).subscribe({
      next: (profile) => {
        this.existingProfile = profile;
        this.profileForm.patchValue({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          birthDate: profile.birthDate || ''
        });
      },
      error: () => {
        // Profile doesn't exist, user will create a new one
        this.existingProfile = null;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const profileData = {
        email: this.userEmail,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        birthDate: this.profileForm.value.birthDate || undefined
      };

      if (this.existingProfile) {
        const updateRequest: UpdateUserProfileRequest = {
          id: this.existingProfile.id!,
          ...profileData
        };

        console.log('Updating profile with token:', localStorage.getItem('jwt_token'));
        this.userProfileService.updateUserProfile(updateRequest).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Error updating profile. Please try again.';
            console.error('Profile update error:', error);
          }
        });
      } else {
        const createRequest: CreateUserProfileRequest = profileData;

        console.log('Creating profile with token:', localStorage.getItem('jwt_token'));
        this.userProfileService.createUserProfile(createRequest).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Error creating profile. Please try again.';
            console.error('Profile creation error:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      birthDate: 'Birth Date'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}