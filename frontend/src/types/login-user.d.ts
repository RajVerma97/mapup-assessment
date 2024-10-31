export interface LoginUserData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  __v: number;
}

export interface LoginAuthResponse {
  token: string;
  user: User;
  message: string;
}
