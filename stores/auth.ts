import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, LoginForm, RegisterForm, AuthResponse } from "@/types/auth";
import { loginApi, registerApi, getUserInfoApi } from "@/api/auth";

export const useAuthStore = defineStore("auth", () => {
  // 状态
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const userGroup = computed(() => user.value?.user_group || "user");

  // 获取用户组标签
  const getUserGroupLabel = (group: string) => {
    const groupLabels: Record<string, string> = {
      user: "普通用户",
      test: "测试用户",
      admin: "管理员",
    };
    return groupLabels[group] || group;
  };

  // 登录方法
  const login = async (form: LoginForm) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await loginApi(form);

      if (response.success && response.data) {
        user.value = response.data.user;
        token.value = response.data.token;

        // 保存token到localStorage
        if (process.client) {
          localStorage.setItem("token", response.data.token);
        }

        return { success: true, message: response.message };
      } else {
        error.value = response.message || "登录失败";
        return { success: false, message: response.message };
      }
    } catch (err: any) {
      error.value = err.message || "登录失败";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  // 注册方法
  const register = async (form: RegisterForm) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await registerApi(form);

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        error.value = response.message || "注册失败";
        return { success: false, message: response.message };
      }
    } catch (err: any) {
      error.value = err.message || "注册失败";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  // 登出方法
  const logout = () => {
    user.value = null;
    token.value = null;
    error.value = null;

    // 清除localStorage中的token
    if (process.client) {
      localStorage.removeItem("token");
    }
  };

  // 初始化认证状态（从localStorage恢复）
  const initAuth = async () => {
    if (process.client) {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        token.value = savedToken;

        // 尝试获取用户信息
        try {
          const response = await getUserInfoApi();
          if (response.success && response.data) {
            user.value = response.data.user;
          } else {
            // token无效，清除
            logout();
          }
        } catch (err) {
          // token无效，清除
          logout();
        }
      }
    }
  };

  // 清除错误
  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userGroup,
    login,
    register,
    logout,
    initAuth,
    clearError,
    getUserGroupLabel,
  };
});
