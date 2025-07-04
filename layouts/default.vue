<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// 使用主题
useTheme();

// 页面标题
useHead({
  title: "协同文档编辑器",
});
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#__nuxt {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  background-color: var(--color-bg-1);
  color: var(--color-text-1);
  transition: background-color 0.3s, color 0.3s;
}

/* Arco Design 暗黑模式样式 */
body[arco-theme="dark"] {
  color-scheme: dark;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-fill-2);
}

::-webkit-scrollbar-thumb {
  background: var(--color-fill-3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-fill-4);
}
</style>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  overflow: auto;
}
</style>
