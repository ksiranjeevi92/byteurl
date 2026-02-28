import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserAccountService } from './user-account.service';
import { UserProfileService } from '../../user-profile/services/user-profile.service';
import { UserAccountRequest, UserAccountResponse, LoginCredentials, LoginResponse } from '../models/user-account.model';

describe('UserAccountService', () => {
  let service: UserAccountService;
  let httpMock: HttpTestingController;
  let userProfileServiceSpy: jasmine.SpyObj<UserProfileService>;

  const mockUserRequest: UserAccountRequest = {
    email: 'test@example.com',
    password: 'password123'
  };

  const mockUserResponse: UserAccountResponse = {
    id: 1,
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockLoginCredentials: LoginCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  const mockLoginResponse: LoginResponse = {
    token: 'mock-jwt-token'
  };

  beforeEach(() => {
    userProfileServiceSpy = jasmine.createSpyObj('UserProfileService', ['getUserProfileByEmail']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserAccountService,
        { provide: UserProfileService, useValue: userProfileServiceSpy }
      ]
    });
    service = TestBed.inject(UserAccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUser', () => {
    it('should call POST /api/users/create with correct payload', () => {
      service.createUser(mockUserRequest).subscribe(response => {
        expect(response).toEqual(mockUserResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUserRequest);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      req.flush(mockUserResponse);
    });
  });

  describe('getUserById', () => {
    it('should call GET /api/users/:id', () => {
      const userId = 1;

      service.getUserById(userId).subscribe(response => {
        expect(response).toEqual(mockUserResponse);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/users/${userId}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockUserResponse);
    });
  });

  describe('login', () => {
    it('should call POST /api/auth/login with credentials', () => {
      service.login(mockLoginCredentials).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginCredentials);

      req.flush(mockLoginResponse);
    });
  });
});
