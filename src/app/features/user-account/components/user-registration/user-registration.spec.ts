import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserRegistrationComponent } from './user-registration';
import { UserAccountService } from '../../services/user-account.service';
import { UserAccountResponse } from '../../models/user-account.model';

describe('UserRegistrationComponent', () => {
  let component: UserRegistrationComponent;
  let fixture: ComponentFixture<UserRegistrationComponent>;
  let userAccountServiceSpy: jasmine.SpyObj<UserAccountService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUserResponse: UserAccountResponse = {
    id: 1,
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    userAccountServiceSpy = jasmine.createSpyObj('UserAccountService', ['createUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserRegistrationComponent, ReactiveFormsModule],
      providers: [
        { provide: UserAccountService, useValue: userAccountServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should have invalid form when fields are empty', () => {
      expect(component.registrationForm.valid).toBeFalse();
    });

    it('should have valid form with correct data', () => {
      component.registrationForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      expect(component.registrationForm.valid).toBeTrue();
    });

    it('should detect password mismatch', () => {
      component.registrationForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different'
      });
      expect(component.registrationForm.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.registrationForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });

    it('should call userAccountService.createUser() on valid submit', () => {
      userAccountServiceSpy.createUser.and.returnValue(of(mockUserResponse));

      component.onSubmit();

      expect(userAccountServiceSpy.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should display success message on successful creation', fakeAsync(() => {
      userAccountServiceSpy.createUser.and.returnValue(of(mockUserResponse));

      component.onSubmit();
      tick();

      expect(component.successMessage).toContain('User created successfully');
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('DOM Tests', () => {
    it('should render email, password, confirmPassword inputs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('input#email')).toBeTruthy();
      expect(compiled.querySelector('input#password')).toBeTruthy();
      expect(compiled.querySelector('input#confirmPassword')).toBeTruthy();
    });

    it('should display error message when API fails', fakeAsync(() => {
      component.registrationForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      userAccountServiceSpy.createUser.and.returnValue(throwError(() => new Error('API Error')));

      component.onSubmit();
      tick();
      fixture.detectChanges();

      expect(component.errorMessage).toBe('Failed to create user. Please try again.');
    }));

    it('should show loading spinner during submission', fakeAsync(() => {
      component.registrationForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      userAccountServiceSpy.createUser.and.returnValue(of(mockUserResponse));

      component.isLoading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.loading-spinner')).toBeTruthy();
    }));

    it('should display success message in template', fakeAsync(() => {
      component.registrationForm.patchValue({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      userAccountServiceSpy.createUser.and.returnValue(of(mockUserResponse));

      component.onSubmit();
      tick();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.success-message')?.textContent).toContain('User created successfully');
    }));
  });

  describe('Navigation', () => {
    it('should navigate to login page when navigateToLogin() is called', () => {
      component.navigateToLogin();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-account/login']);
    });
  });
});
