export interface RegisterUserData {
  email: string;
  password: string;
  username: string;
  role: UserRole;
}

export interface RegisterAuthResponse {
  message: string;
}
