import { TestBed } from '@angular/core/testing';
import { JwtTokenService } from './jwt-token.service';

/**
 * Unit tests for JwtTokenService
 *
 * These tests use mocked localStorage to ensure:
 * - Tests are fast and isolated
 * - We only test our code logic, not browser APIs
 * - Tests are reliable and don't depend on environment
 */
describe('JwtTokenService', () => {
  // Service instance to test
  let service: JwtTokenService;

  // Jasmine spies to mock localStorage methods
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;
  let removeItemSpy: jasmine.Spy;

  // Constants used in tests
  const TOKEN_KEY = 'jwt_token';  // Must match the key used in the service
  const mockToken = 'test-jwt-token';

  /**
   * Setup before each test:
   * - Create spies on localStorage methods to intercept calls
   * - Configure TestBed and inject the service
   */
  beforeEach(() => {
    // Create spies on localStorage methods
    // spyOn intercepts calls to these methods so we can verify they were called correctly
    getItemSpy = spyOn(localStorage, 'getItem');
    setItemSpy = spyOn(localStorage, 'setItem');
    removeItemSpy = spyOn(localStorage, 'removeItem');

    // Configure Angular testing module and get service instance
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtTokenService);
  });

  // Basic test to verify service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Tests for storeToken method
   * Verifies that the token is stored correctly in localStorage
   */
  describe('storeToken', () => {
    it('should call localStorage.setItem with correct key and token', () => {
      // Act: call the method we're testing
      service.storeToken(mockToken);

      // Assert: verify setItem was called with the right arguments
      expect(setItemSpy).toHaveBeenCalledWith(TOKEN_KEY, mockToken);
    });

    it('should call localStorage.setItem exactly once', () => {
      // Act
      service.storeToken(mockToken);

      // Assert: ensure the method is not called multiple times
      expect(setItemSpy).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Tests for getStoredToken method
   * Verifies that the token is retrieved correctly from localStorage
   */
  describe('getStoredToken', () => {
    it('should call localStorage.getItem with correct key', () => {
      // Act
      service.getStoredToken();

      // Assert: verify getItem was called with the correct key
      expect(getItemSpy).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('should return null when localStorage returns null', () => {
      // Arrange: configure the spy to return null (simulating no token stored)
      getItemSpy.and.returnValue(null);

      // Act & Assert
      expect(service.getStoredToken()).toBeNull();
    });

    it('should return token when localStorage has token', () => {
      // Arrange: configure the spy to return a token
      getItemSpy.and.returnValue(mockToken);

      // Act & Assert
      expect(service.getStoredToken()).toBe(mockToken);
    });
  });

  /**
   * Tests for removeToken method
   * Verifies that the token is removed correctly from localStorage
   */
  describe('removeToken', () => {
    it('should call localStorage.removeItem with correct key', () => {
      // Act
      service.removeToken();

      // Assert: verify removeItem was called with the correct key
      expect(removeItemSpy).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('should call localStorage.removeItem exactly once', () => {
      // Act
      service.removeToken();

      // Assert: ensure the method is not called multiple times
      expect(removeItemSpy).toHaveBeenCalledTimes(1);
    });
  });
});
