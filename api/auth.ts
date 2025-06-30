import type {
  LoginForm,
  RegisterForm,
  AuthResponse,
  User,
  LoginResponse,
  RegisterResponse,
} from "@/types/auth";

// 登录 API
export const loginApi = async (form: LoginForm): Promise<AuthResponse> => {
  try {
    const response = await $fetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: form,
    });

    if (response.statusCode === 200 && response.body) {
      return {
        success: true,
        message: response.body.message,
        data: {
          user: response.body.user!,
          token: response.body.token!,
        },
      };
    } else {
      return {
        success: false,
        message: response.body?.error || "登录失败",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.body?.error || "登录失败，请重试",
    };
  }
};

// 注册 API
export const registerApi = async (
  form: RegisterForm
): Promise<AuthResponse> => {
  try {
    const response = await $fetch<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: form,
    });

    if (response.statusCode === 201) {
      return {
        success: true,
        message: "注册成功，请登录",
      };
    } else {
      return {
        success: false,
        message: response.statusMessage || "注册失败",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.statusMessage || "注册失败，请重试",
    };
  }
};

// 获取用户信息 API
export const getUserInfoApi = async (): Promise<AuthResponse> => {
  try {
    const token = process.client ? localStorage.getItem("token") : "";
    const response = await $fetch<{ message: string; user: User }>(
      "/api/auth/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.message,
      data: {
        user: response.user,
        token: localStorage.getItem("token") || "",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "获取用户信息失败",
    };
  }
};
