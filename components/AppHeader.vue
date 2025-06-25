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
        <AMenu mode="horizontal" :selected-keys="[currentRoute]" @menu-item-click="handleMenuClick">
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
        <ADropdown trigger="click">
          <AAvatar :size="32" class="user-avatar">
            <Icon name="ri:user-line" />
          </AAvatar>
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
            <ADoption>
              <template #icon><Icon name="ri:logout-box-line" /></template>
              退出登录
            </ADoption>
          </template>
        </ADropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const currentRoute = computed(() => route.path)

const handleMenuClick = (key: string) => {
  router.push(key)
}
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
  background: linear-gradient(120deg, rgb(var(--primary-6)) 0%, rgb(var(--primary-5)) 100%);
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

.user-avatar {
  cursor: pointer;
  transition: all 0.2s;
}

.user-avatar:hover {
  transform: scale(1.05);
}
</style> 