export interface User {
  id: string;
  username: string;
  email: string;
  group: string;
  avatar?: string;
  createdAt: string;
}

export interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  group: string;
  agreement: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}
