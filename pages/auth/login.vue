<template>
  <AuthLayout>
    <div class="login-form">
      <div class="form-header">
        <h2 class="form-title">欢迎回来</h2>
        <p class="form-subtitle">请登录您的账户</p>
      </div>

      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        @submit="handleSubmit"
      >
        <a-form-item field="username" label="用户名">
          <a-input
            v-model="form.username"
            placeholder="请输入用户名"
            size="large"
            allow-clear
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item field="password" label="密码">
          <a-input-password
            v-model="form.password"
            placeholder="请输入密码"
            size="large"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <div class="form-options">
            <a-checkbox v-model="form.remember"> 记住我 </a-checkbox>
            <a-link href="#" class="forgot-password"> 忘记密码？ </a-link>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            long
            :loading="authStore.loading"
          >
            登录
          </a-button>
        </a-form-item>

        <div class="form-footer">
          <span>还没有账户？</span>
          <router-link to="/auth/register" class="register-link">
            立即注册
          </router-link>
        </div>
      </a-form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import AuthLayout from "@/components/AuthLayout.vue";
import { useAuthStore } from "@/stores/auth";
import { usernameRules, passwordRules } from "@/utils/validator";
import type { LoginForm } from "@/types/auth";
definePageMeta({
  hideHeader: true,
});
const router = useRouter();
const authStore = useAuthStore();
const formRef = ref();

// 表单数据
const form = reactive<LoginForm>({
  username: "",
  password: "",
  remember: false,
});

// 验证规则
const rules = {
  username: usernameRules,
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
};

// 提交表单
const handleSubmit = async (data: { values: LoginForm; errors: any }) => {
  if (data.errors) return;

  const result = await authStore.login(data.values);

  if (result.success) {
    Message.success(result.message);
    router.push("/");
  } else {
    Message.error(result.message);
  }
};
</script>

<style scoped>
.login-form {
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-size: 14px;
  color: #86909c;
  margin: 0;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  margin-left: 0;
  font-size: 14px;
}

.form-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #86909c;
}

.register-link {
  color: #165dff;
  text-decoration: none;
  margin-left: 4px;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
