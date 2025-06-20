<template>
  <div class="app-layout">
    <ALayout>
      <!-- 顶部导航栏 -->
      <ALayoutHeader v-if="showHeader" class="header">
        <div class="header-content">
          <div class="logo">
            <h2>协同文档编辑器</h2>
          </div>
          <div class="header-actions">
            <!-- 用户相关操作 -->
            <template v-if="isAuthenticated">
              <a-dropdown @select="handleDropdownSelect" trigger="hover">
                <a-avatar :src="user?.avatar" style="cursor: pointer">
                  {{ user?.username?.[0] || "U" }}
                </a-avatar>
                <template #content>
                  <a-doption key="user-info">
                    {{ getUserGroupLabel(user?.group) }}
                  </a-doption>
                  <a-doption key="logout" @click="handleLogout()"
                    >退出登录</a-doption
                  >
                </template>
              </a-dropdown>
            </template>
            <template v-else>
              <AButton type="primary" @click="toLogin()">登录</AButton>
            </template>
          </div>
        </div>
      </ALayoutHeader>

      <!-- 主要内容区域 -->
      <ALayoutContent class="main-content">
        <slot />
      </ALayoutContent>
    </ALayout>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
const route = useRoute();

const showHeader = computed(() => {
  // 默认显示header，只有meta里明确hideHeader为true才隐藏
  return route.meta.hideHeader !== true;
});
// 页面标题
useHead({
  title: "协同文档编辑器",
});
const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);

// 根据用户组别返回对应的标签
const getUserGroupLabel = (group?: string) => {
  switch (group) {
    case "user":
      return "普通用户";
    case "test":
      return "测试用户";
  }
};

function toLogin() {
  router.push("/auth/login");
}
function handleLogout() {
  authStore.logout();
  router.push("/auth/login");
}
function handleDropdownSelect(key: string) {
  if (key === "logout") handleLogout();
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e5e6eb;
  padding: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo h2 {
  margin: 0;
  color: #1d2129;
}

.main-content {
  padding: 20px;
  background: #f7f8fa;
  min-height: calc(100vh - 64px);
}
</style>
