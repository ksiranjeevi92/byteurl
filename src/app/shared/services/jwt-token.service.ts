import { Injectable, signal, effect, computed } from '@angular/core';

export interface JwtPayload {
  sub: string; // subject (email)
  exp: number; // expiration time
  iat?: number; // issued at
}

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {
  private readonly TOKEN_KEY = 'jwt_token';

  // Signal: single source of truth for token state
  private token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  // Computed: derived values from token signal
  isAuthenticated = computed(() => {
    const tokenValue = this.token();
    return tokenValue !== null && !this.isTokenExpired(tokenValue);
  });

  userEmail = computed(() => {
    const tokenValue = this.token();
    if (!tokenValue) return null;
    const payload = this.decodeToken(tokenValue);
    return payload?.sub || null;
  });

  tokenExpirationDate = computed(() => {
    const tokenValue = this.token();
    if (!tokenValue) return null;
    const payload = this.decodeToken(tokenValue);
    if (!payload || !payload.exp) return null;
    return new Date(payload.exp * 1000);
  });

  timeUntilExpiration = computed(() => {
    const expirationDate = this.tokenExpirationDate();
    if (!expirationDate) return null;
    const now = new Date();
    const timeRemaining = expirationDate.getTime() - now.getTime();
    return Math.floor(timeRemaining / (1000 * 60)); // Convert to minutes
  });

  constructor() {
    // EFFECT: Automatically sync token signal to localStorage
    // When token() changes, this side effect runs automatically
    this.setupStorageEffect();
  }

  // Flag to track if effect was successfully created
  private effectActive = false;

  /**
   * Sets up the effect for localStorage synchronization.
   * Wrapped in try-catch for testability outside Angular's injection context.
   */
  private setupStorageEffect(): void {
    try {
      effect(() => {
        const tokenValue = this.token();
        if (tokenValue === null) {
          localStorage.removeItem(this.TOKEN_KEY);
          console.log('Token removed from localStorage');
        } else {
          localStorage.setItem(this.TOKEN_KEY, tokenValue);
          console.log('Token stored in localStorage');
        }
      });
      this.effectActive = true;
    } catch {
      // Effect requires injection context - fallback for testing
      // Manual localStorage sync will be used via storeToken/removeToken
      this.effectActive = false;
    }
  }

  /**
   * Gets the stored JWT token
   */
  getStoredToken(): string | null {
    return this.token();
  }

  /**
   * Stores the JWT token - effect handles localStorage automatically
   */
  storeToken(token: string): void {
    this.token.set(token);
    // Fallback: sync to localStorage if effect is not active (testing)
    if (!this.effectActive) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Removes the token - effect handles localStorage automatically
   */
  removeToken(): void {
    this.token.set(null);
    // Fallback: sync to localStorage if effect is not active (testing)
    if (!this.effectActive) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Gets the email from the stored JWT token
   * @deprecated Use userEmail computed signal instead
   */
  getEmailFromToken(): string | null {
    return this.userEmail();
  }

  /**
   * Gets token expiration date
   * @deprecated Use tokenExpirationDate computed signal instead
   */
  getTokenExpirationDate(): Date | null {
    return this.tokenExpirationDate();
  }

  /**
   * Gets time remaining before token expires (in minutes)
   * @deprecated Use timeUntilExpiration computed signal instead
   */
  getTimeUntilExpiration(): number | null {
    return this.timeUntilExpiration();
  }

  /**
   * Checks if the token is expired
   */
  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.token();
    if (!tokenToCheck) {
      return true;
    }

    const payload = this.decodeToken(tokenToCheck);
    if (!payload || !payload.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Decodes a JWT token without verification (client-side only)
   * Note: This is for reading token data, not for security validation
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format');
        return null;
      }

      const payload = parts[1];
      const decoded = this.base64UrlDecode(payload);
      const parsed = JSON.parse(decoded);

      return parsed as JwtPayload;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Base64 URL decode implementation
   */
  private base64UrlDecode(str: string): string {
    // Convert base64url to base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if necessary
    switch (base64.length % 4) {
      case 0:
        break;
      case 2:
        base64 += '==';
        break;
      case 3:
        base64 += '=';
        break;
      default:
        throw new Error('Invalid base64url string');
    }

    // Decode base64
    return atob(base64);
  }
}
