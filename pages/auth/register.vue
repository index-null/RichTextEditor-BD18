<template>
  <AuthLayout>
    <div class="register-form">
      <div class="form-header">
        <h2 class="form-title">创建账户</h2>
        <p class="form-subtitle">请填写以下信息完成注册</p>
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

        <a-form-item field="email" label="邮箱">
          <a-input
            v-model="form.email"
            placeholder="请输入邮箱地址"
            size="large"
            allow-clear
          >
            <template #prefix>
              <icon-email />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item field="group" label="用户组">
          <a-select
            v-model="form.group"
            placeholder="请选择用户组"
            size="large"
            allow-clear
          >
            <a-option value="user">普通用户</a-option>
            <a-option value="test">测试用户</a-option>
          </a-select>
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
          <template #extra>
            <div class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="passwordStrengthClass"
                  :style="{ width: passwordStrengthWidth }"
                ></div>
              </div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </template>
        </a-form-item>

        <a-form-item field="confirmPassword" label="确认密码">
          <a-input-password
            v-model="form.confirmPassword"
            placeholder="请再次输入密码"
            size="large"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item field="agreement">
          <a-checkbox v-model="form.agreement">
            我已阅读并同意
            <a-link href="#" @click.prevent="showTerms = true">
              《用户协议》
            </a-link>
            和
            <a-link href="#" @click.prevent="showPrivacy = true">
              《隐私政策》
            </a-link>
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            long
            :loading="authStore.loading"
          >
            注册
          </a-button>
        </a-form-item>

        <div class="form-footer">
          <span>已有账户？</span>
          <router-link to="/auth/login" class="login-link">
            立即登录
          </router-link>
        </div>
      </a-form>
    </div>

    <!-- 用户协议弹窗 -->
    <a-modal
      v-model:visible="showTerms"
      title="用户协议"
      :footer="false"
      width="600px"
    >
      <div class="terms-content">
        <h3>1. 服务条款</h3>
        <p>
          欢迎使用我们的服务。通过访问和使用本服务，您同意遵守以下条款和条件。
        </p>

        <h3>2. 用户责任</h3>
        <p>用户有责任保护自己的账户信息，包括用户名和密码的安全。</p>

        <h3>3. 隐私保护</h3>
        <p>我们承诺保护用户的隐私信息，不会未经授权向第三方披露。</p>
      </div>
    </a-modal>

    <!-- 隐私政策弹窗 -->
    <a-modal
      v-model:visible="showPrivacy"
      title="隐私政策"
      :footer="false"
      width="600px"
    >
      <div class="privacy-content">
        <h3>信息收集</h3>
        <p>我们只收集为提供服务所必需的用户信息。</p>

        <h3>信息使用</h3>
        <p>收集的信息仅用于改善服务质量和用户体验。</p>

        <h3>信息保护</h3>
        <p>我们采用行业标准的安全措施保护用户信息。</p>
      </div>
    </a-modal>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { IconUser, IconEmail, IconLock } from "@arco-design/web-vue/es/icon";
import AuthLayout from "@/components/AuthLayout.vue";
import { useAuthStore } from "@/stores/auth";
import {
  usernameRules,
  emailRules,
  passwordRules,
  createConfirmPasswordRules,
  agreementRules,
  groupRules,
} from "@/utils/validator";
import type { RegisterForm } from "@/types/auth";
definePageMeta({
  hideHeader: true,
});
const router = useRouter();
const authStore = useAuthStore();
const formRef = ref();
const showTerms = ref(false);
const showPrivacy = ref(false);

// 表单数据
const form = reactive<RegisterForm>({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  group: "user",
  agreement: false,
});

// 密码强度计算
const passwordStrength = computed(() => {
  const password = form.password;
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 6) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^a-zA-Z\d]/.test(password)) strength += 1;

  return strength;
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return "weak";
  if (strength <= 3) return "medium";
  return "strong";
});

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 5) * 100}%`;
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return "弱";
  if (strength <= 3) return "中";
  return "强";
});

// 验证规则
const rules = computed(() => ({
  username: usernameRules,
  email: emailRules,
  password: passwordRules,
  confirmPassword: createConfirmPasswordRules(form.password),
  agreement: agreementRules,
  group: groupRules,
}));

// 监听密码变化，重新验证确认密码
watch(
  () => form.password,
  () => {
    if (form.confirmPassword) {
      formRef.value?.validateField("confirmPassword");
    }
  }
);

// 提交表单
const handleSubmit = async (data: { values: RegisterForm; errors: any }) => {
  if (data.errors) return;

  const result = await authStore.register(data.values);

  if (result.success) {
    Message.success(result.message);
    router.push("/login");
  } else {
    Message.error(result.message);
  }
};
</script>

<style scoped>
.register-form {
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

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background-color: #f2f3f5;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background-color: #f53f3f;
}

.strength-fill.medium {
  background-color: #ff7d00;
}

.strength-fill.strong {
  background-color: #00b42a;
}

.strength-text {
  font-size: 12px;
  color: #86909c;
}

.form-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #86909c;
}

.login-link {
  color: #165dff;
  text-decoration: none;
  margin-left: 4px;
}

.login-link:hover {
  text-decoration: underline;
}

.terms-content,
.privacy-content {
  max-height: 400px;
  overflow-y: auto;
}

.terms-content h3,
.privacy-content h3 {
  color: #1d2129;
  margin: 16px 0 8px 0;
}

.terms-content p,
.privacy-content p {
  color: #4e5969;
  line-height: 1.6;
  margin-bottom: 12px;
}
</style>
