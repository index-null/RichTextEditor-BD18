<template>
  <div class="app-layout">
    <ALayout>
      <!-- 顶部导航栏 -->
      <ALayoutHeader class="header">
        <div class="header-content">
          <div class="logo">
            <h2>协同文档编辑器</h2>
          </div>
          <div class="header-actions">
            <!-- 用户相关操作 -->
            <AButton type="primary">登录</AButton>
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
// 页面标题
useHead({
  title: '协同文档编辑器'
})
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