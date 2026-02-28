import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAccountService } from '../../services/user-account.service';
import { UserProfileService } from '../../../user-profile/services/user-profile.service';
import { JwtTokenService } from '../../../../shared/services/jwt-token.service';
import { LoginCredentials } from '../../models/user-account.model';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-login.html',
  styleUrl: './user-login.scss'
})
export class UserLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userAccountService: UserAccountService,
    private userProfileService: UserProfileService,
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginCredentials: LoginCredentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.userAccountService.loginWithProfile(loginCredentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          console.log('Login successful, token:', response.loginResponse.token);
          console.log('User profile:', response.userProfile);
          
          if (!response.userProfile) {
            console.log('No profile found - redirecting to profile completion');
            this.router.navigate(['/user-profile/complete']);
          } else if (this.userProfileService.isProfileComplete(response.userProfile)) {
            console.log('Profile is complete - redirecting to dashboard');
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Profile exists but incomplete - redirecting to profile completion');
            this.router.navigate(['/user-profile/complete']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password. Please try again.';
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Password'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  navigateToRegister(): void {
    this.router.navigate(['/user-account/register']);
  }
}