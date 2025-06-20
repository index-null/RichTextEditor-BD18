import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, LoginForm, RegisterForm } from "@/types/auth";
import { loginApi, registerApi, getUserInfoApi } from "@/api/auth";

export const useAuthStore = defineStore("auth", () => {
  // 状态
  const user = ref<User | null>(null);
  const token = ref<string>("");
  const loading = ref(false);

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userInfo = computed(() => user.value);

  // 登录方法
  const login = async (form: LoginForm) => {
    loading.value = true;
    try {
      const response = await loginApi(form);
      if (response.success && response.data) {
        token.value = response.data.token;
        user.value = response.data.user;
        localStorage.setItem("token", response.data.token);
        return { success: true, message: "登录成功" };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: "登录失败，请重试" };
    } finally {
      loading.value = false;
    }
  };

  // 注册方法
  const register = async (form: RegisterForm) => {
    loading.value = true;
    try {
      const response = await registerApi(form);
      if (response.success) {
        return { success: true, message: "注册成功，请登录" };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: "注册失败，请重试" };
    } finally {
      loading.value = false;
    }
  };

  // 登出方法
  const logout = () => {
    user.value = null;
    token.value = "";
    localStorage.removeItem("token");
  };

  // 初始化认证状态
  const initAuth = async () => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      token.value = savedToken;
      try {
        const userInfo = await getUserInfoApi();
        if (userInfo.success && userInfo.data) {
          user.value = userInfo.data.user;
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userInfo,
    login,
    register,
    logout,
    initAuth,
  };
});
