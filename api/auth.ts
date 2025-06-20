import type { LoginForm, RegisterForm, AuthResponse, User } from "@/types/auth";

// 模拟 API 延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    group: "user",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    createdAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "2",
    username: "tester",
    email: "tester@example.com",
    group: "test",
    avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    createdAt: "2025-06-01T00:00:00Z",
  },
];

// 模拟已注册用户（包含密码）
const mockUserCredentials = [
  { username: "admin", password: "123456", userId: "1" },
  { username: "tester", password: "123456", userId: "2" },
];

// 登录 API
export const loginApi = async (form: LoginForm): Promise<AuthResponse> => {
  await delay(1000); // 模拟网络延迟

  const credential = mockUserCredentials.find(
    (c) => c.username === form.username && c.password === form.password
  );

  if (credential) {
    const user = mockUsers.find((u) => u.id === credential.userId);
    if (user) {
      return {
        success: true,
        message: "登录成功",
        data: {
          user,
          token: `mock-token-${user.id}-${Date.now()}`,
        },
      };
    }
  }

  return {
    success: false,
    message: "用户名或密码错误",
  };
};

// 注册 API
export const registerApi = async (
  form: RegisterForm
): Promise<AuthResponse> => {
  await delay(1000);

  // 检查用户名是否已存在
  const existingUser = mockUserCredentials.find(
    (c) => c.username === form.username
  );
  if (existingUser) {
    return {
      success: false,
      message: "用户名已存在",
    };
  }

  // 检查邮箱是否已存在
  const existingEmail = mockUsers.find((u) => u.email === form.email);
  if (existingEmail) {
    return {
      success: false,
      message: "邮箱已被注册",
    };
  }

  // 创建新用户
  const newUser: User = {
    id: String(mockUsers.length + 1),
    username: form.username,
    email: form.email,
    group: form.group,
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);
  mockUserCredentials.push({
    username: form.username,
    password: form.password,
    userId: newUser.id,
  });

  return {
    success: true,
    message: "注册成功",
  };
};

// 获取用户信息 API
export const getUserInfoApi = async (): Promise<AuthResponse> => {
  await delay(500);

  // 这里应该根据 token 获取用户信息
  // 为了简化，我们返回第一个用户
  const user = mockUsers[0];

  return {
    success: true,
    message: "获取用户信息成功",
    data: {
      user,
      token: localStorage.getItem("token") || "",
    },
  };
};
