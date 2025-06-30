<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- 使用 NuxtLayout 来包装 NuxtPage -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";

// 初始化认证状态
const authStore = useAuthStore();
// 在客户端初始化认证状态
onMounted(async () => {
  await authStore.initAuth();
});
</script>
