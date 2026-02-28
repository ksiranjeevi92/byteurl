import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../services/user-profile.service';
import { JwtTokenService } from '../../../../shared/services/jwt-token.service';
import { UserProfile, UpdateUserProfileRequest } from '../../models/user-profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  userProfile: UserProfile | null = null;
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

    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userProfileService.getUserProfileByEmail(this.userEmail).subscribe({
      next: (profile) => {
        this.isLoading = false;
        this.userProfile = profile;
        this.profileForm.patchValue({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          birthDate: profile.birthDate || ''
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading profile. Please try again.';
        console.error('Profile load error:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.userProfile) {
      this.isSaving = true;
      this.errorMessage = '';
      this.successMessage = '';

      const updateRequest: UpdateUserProfileRequest = {
        id: this.userProfile.id!,
        email: this.userEmail,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        birthDate: this.profileForm.value.birthDate || undefined
      };

      this.userProfileService.updateUserProfile(updateRequest).subscribe({
        next: (updatedProfile) => {
          this.isSaving = false;
          this.userProfile = updatedProfile;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = 'Error updating profile. Please try again.';
          console.error('Profile update error:', error);
        }
      });
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