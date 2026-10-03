export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  isActive?: boolean;
  location?: string;
  gardeningExperience?: string;
  bio?: string;
  expertise?: string;
  createdDate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  location?: string;
  gardeningExperience?: string;
  bio?: string;
  expertise?: string;
}

export interface AuthResponse {
  token: string;
  accessToken?: string; // fallback alias
  refreshToken: string;
  type: string;
  tokenType?: string; // fallback alias
  userId: number;
  username: string;
  email: string;
  role: string;
}
