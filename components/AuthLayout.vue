<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-left">
        <div class="brand">
          <div class="brand-logo">
            <a-avatar :size="48" style="background-color: #165dff">
              <icon-user />
            </a-avatar>
          </div>
          <h1 class="brand-title">协同文档编辑器</h1>
          <p class="brand-subtitle">欢迎使用18组的协同文档编辑器</p>
        </div>
        <div class="features">
          <div class="feature-item">
            <icon-check-circle class="feature-icon" />
            <span>支持多人协同创作</span>
          </div>
          <div class="feature-item">
            <icon-check-circle class="feature-icon" />
            <span>优雅的用户界面设计</span>
          </div>
          <div class="feature-item">
            <icon-check-circle class="feature-icon" />
            <span>完整的表单验证体系</span>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { IconUser, IconCheckCircle } from "@arco-design/web-vue/es/icon";
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  max-width: 1000px;
  width: 100%;
  min-height: 600px;
}

.auth-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand {
  margin-bottom: 60px;
}

.brand-logo {
  margin-bottom: 24px;
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}

.features {
  space-y: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.feature-icon {
  margin-right: 12px;
  font-size: 20px;
  color: #52c41a;
}

.auth-right {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    max-width: 400px;
  }

  .auth-left {
    padding: 40px 20px;
  }

  .auth-right {
    padding: 40px 20px;
  }
}
</style>
