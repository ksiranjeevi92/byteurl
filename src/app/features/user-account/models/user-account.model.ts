export interface UserAccount {
  id?: number;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAccountRequest {
  email: string;
  password: string;
}

export interface UserAccountResponse {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}