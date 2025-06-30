export interface User {
  id: string;
  username: string;
  nickname: string;
  user_group: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  nickname: string;
  userGroup: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    user: User;
    token: string;
  };
  user?: User;
  token?: string;
  statusCode?: number;
}

export interface LoginResponse {
  statusCode: number;
  body: {
    message?: string;
    error?: string;
    user?: User;
    token?: string;
  };
}

export interface RegisterResponse {
  statusCode: number;
  data?: User;
  statusMessage?: string;
}
