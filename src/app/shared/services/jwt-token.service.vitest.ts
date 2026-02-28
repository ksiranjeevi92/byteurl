import { describe, it, expect, beforeEach } from 'vitest';
import { resetLocalStorage } from '../../../test-setup';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService (Vitest)', () => {
  let service: JwtTokenService;

  // Helper to create a valid JWT token
  const createMockToken = (expiresInSeconds: number, email = 'test@example.com'): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: email,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = 'mock-signature';
    return `${header}.${payload}.${signature}`;
  };

  beforeEach(() => {
    resetLocalStorage();
    service = new JwtTokenService();
  });

  describe('storeToken', () => {
    it('should store token in localStorage', () => {
      const token = 'test-token';

      service.storeToken(token);

      expect(localStorage.setItem).toHaveBeenCalledWith('jwt_token', token);
    });
  });

  describe('getStoredToken', () => {
    it('should return token from localStorage', () => {
      const token = 'stored-token';
      // Set localStorage BEFORE creating service (signal reads on init)
      localStorage.setItem('jwt_token', token);
      service = new JwtTokenService();

      const result = service.getStoredToken();

      expect(result).toBe(token);
    });

    it('should return null when no token exists', () => {
      const result = service.getStoredToken();

      expect(result).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      service.removeToken();

      expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_token');
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid JWT token', () => {
      const token = createMockToken(3600, 'user@example.com');

      const result = service.decodeToken(token);

      expect(result).not.toBeNull();
      expect(result?.sub).toBe('user@example.com');
      expect(result?.exp).toBeDefined();
    });

    it('should return null for invalid token format', () => {
      const result = service.decodeToken('invalid-token');

      expect(result).toBeNull();
    });

    it('should return null for token with wrong number of parts', () => {
      const result = service.decodeToken('part1.part2');

      expect(result).toBeNull();
    });
  });

  describe('getEmailFromToken', () => {
    it('should return email from stored token', () => {
      const token = createMockToken(3600, 'email@test.com');
      // Set localStorage BEFORE creating service (signal reads on init)
      localStorage.setItem('jwt_token', token);
      service = new JwtTokenService();

      const result = service.getEmailFromToken();

      expect(result).toBe('email@test.com');
    });

    it('should return null when no token exists', () => {
      const result = service.getEmailFromToken();

      expect(result).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid non-expired token', () => {
      const token = createMockToken(3600); // Expires in 1 hour

      const result = service.isTokenExpired(token);

      expect(result).toBe(false);
    });

    it('should return true for expired token', () => {
      const token = createMockToken(-3600); // Expired 1 hour ago

      const result = service.isTokenExpired(token);

      expect(result).toBe(true);
    });

    it('should return true for invalid token', () => {
      const result = service.isTokenExpired('invalid-token');

      expect(result).toBe(true);
    });

    it('should use stored token when no token is provided', () => {
      const token = createMockToken(3600);
      // Set localStorage BEFORE creating service (signal reads on init)
      localStorage.setItem('jwt_token', token);
      service = new JwtTokenService();

      const result = service.isTokenExpired();

      expect(result).toBe(false);
    });

    it('should return true when no token exists and none provided', () => {
      const result = service.isTokenExpired();

      expect(result).toBe(true);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when valid token exists', () => {
      const token = createMockToken(3600);
      // Set localStorage BEFORE creating service (signal reads on init)
      localStorage.setItem('jwt_token', token);
      service = new JwtTokenService();

      const result = service.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when no token exists', () => {
      const result = service.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when token is expired', () => {
      const token = createMockToken(-3600);
      // Set localStorage BEFORE creating service (signal reads on init)
      localStorage.setItem('jwt_token', token);
      service = new JwtTokenService();

      const result = service.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('getTokenExpirationDate', () => {
    it('should return expiration date for valid token', () => {
      const token = createMockToken(3600);
      // Set localStorage BEFORE creating service (signal reads on init)
      localStorage.setItem('jwt_token', token);
      service = new JwtTokenService();

      const result = service.getTokenExpirationDate();

      expect(result).toBeInstanceOf(Date);
      expect(result!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return null when no token exists', () => {
      const result = service.getTokenExpirationDate();

      expect(result).toBeNull();
    });
  });

  describe('getTimeUntilExpiration', () => {
    it('should return positive minutes for valid non-expired token', () => {
      const token = createMockToken(3600); // 1 hour = 60 minutes
      // Set localStorage BEFORE creating service (signal reads on init)
      localStorage.setItem('jwt_token', token);
      service = new JwtTokenService();

      const result = service.getTimeUntilExpiration();

      expect(result).not.toBeNull();
      expect(result).toBeGreaterThan(50); // Should be around 60 minutes
      expect(result).toBeLessThanOrEqual(60);
    });

    it('should return negative minutes for expired token', () => {
      const token = createMockToken(-3600); // Expired 1 hour ago
      // Set localStorage BEFORE creating service (signal reads on init)
      localStorage.setItem('jwt_token', token);
      service = new JwtTokenService();

      const result = service.getTimeUntilExpiration();

      expect(result).not.toBeNull();
      expect(result).toBeLessThan(0);
    });

    it('should return null when no token exists', () => {
      const result = service.getTimeUntilExpiration();

      expect(result).toBeNull();
    });
  });
});
