import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  // 只放行登录、注册等页面
  const whiteList = ["/auth/login", "/auth/register"];
  if (!auth.isAuthenticated && !whiteList.includes(to.path)) {
    return navigateTo("/auth/login");
  }
});
