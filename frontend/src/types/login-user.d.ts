export interface LoginUserData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string; // You can change this to UserRole if you want to enforce specific roles
  __v: number;
}

export interface LoginAuthResponse {
  token: string;
  user: User;
  message: string;
}
