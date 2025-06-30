<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo 和标题 -->
      <div class="header-left">
        <div class="logo-wrapper">
          <Icon name="ri:file-text-line" :size="24" />
          <span class="app-title">协同文档编辑器</span>
        </div>
      </div>

      <!-- 中间导航 -->
      <div class="header-center">
        <AMenu
          mode="horizontal"
          :selected-keys="[currentRoute]"
          @menu-item-click="handleMenuClick"
        >
          <AMenuItem key="/">
            <template #icon><Icon name="ri:home-line" /></template>
            工作台
          </AMenuItem>
          <AMenuItem key="/documents">
            <template #icon><Icon name="ri:file-list-line" /></template>
            我的文档
          </AMenuItem>
          <AMenuItem key="/shared">
            <template #icon><Icon name="ri:share-line" /></template>
            共享文档
          </AMenuItem>
        </AMenu>
      </div>

      <!-- 右侧工具栏 -->
      <div class="header-right">
        <!-- 搜索 -->
        <ATooltip content="搜索文档">
          <AButton type="text" shape="circle">
            <template #icon><Icon name="ri:search-line" /></template>
          </AButton>
        </ATooltip>

        <!-- 通知 -->
        <ATooltip content="通知">
          <ABadge :count="3" dot>
            <AButton type="text" shape="circle">
              <template #icon><Icon name="ri:notification-line" /></template>
            </AButton>
          </ABadge>
        </ATooltip>

        <!-- 主题切换 -->
        <ATooltip :content="isDark ? '切换到亮色模式' : '切换到暗色模式'">
          <AButton type="text" shape="circle" @click="toggleTheme">
            <template #icon>
              <Icon :name="isDark ? 'ri:sun-line' : 'ri:moon-line'" />
            </template>
          </AButton>
        </ATooltip>

        <!-- 用户信息 -->
        <ADropdown v-if="authStore.isAuthenticated" trigger="click">
          <div class="user-info">
            <AAvatar :size="32" class="user-avatar">
              <Icon name="ri:user-line" />
            </AAvatar>
            <div class="user-details">
              <div class="user-name">
                {{ authStore.user?.nickname || authStore.user?.username }}
              </div>
              <div class="user-group">
                {{ authStore.getUserGroupLabel(authStore.userGroup) }}
              </div>
            </div>
          </div>
          <template #content>
            <ADoption>
              <template #icon><Icon name="ri:user-settings-line" /></template>
              个人设置
            </ADoption>
            <ADoption>
              <template #icon><Icon name="ri:question-line" /></template>
              帮助中心
            </ADoption>
            <ADivider style="margin: 4px 0" />
            <ADoption @click="handleLogout">
              <template #icon><Icon name="ri:logout-box-line" /></template>
              退出登录
            </ADoption>
          </template>
        </ADropdown>

        <!-- 未登录状态 -->
        <div v-else class="auth-actions">
          <AButton type="text" @click="router.push('/auth/login')">
            登录
          </AButton>
          <AButton type="primary" @click="router.push('/auth/register')">
            注册
          </AButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const { isDark, toggleTheme } = useTheme();
const authStore = useAuthStore();

const currentRoute = computed(() => route.path);

const handleMenuClick = (key: string) => {
  router.push(key);
};

const handleLogout = () => {
  authStore.logout();
  router.push("/auth/login");
};
</script>

<style scoped>
.app-header {
  height: 60px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  height: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  flex-shrink: 0;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

.app-title {
  background: linear-gradient(
    120deg,
    rgb(var(--primary-6)) 0%,
    rgb(var(--primary-5)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-center :deep(.arco-menu-horizontal) {
  border-bottom: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.user-info:hover {
  background: var(--color-fill-2);
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1);
  line-height: 1;
}

.user-group {
  font-size: 12px;
  color: var(--color-text-3);
  line-height: 1;
}

.auth-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
