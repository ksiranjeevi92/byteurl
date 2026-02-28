export interface UserProfile {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
}

export interface CreateUserProfileRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
}

export interface UpdateUserProfileRequest {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
}