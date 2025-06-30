import type { FieldRule } from "@arco-design/web-vue";

// 用户名验证规则
export const usernameRules: FieldRule[] = [
  {
    required: true,
    message: "请输入用户名",
  },
  {
    minLength: 3,
    message: "用户名至少3个字符",
  },
  {
    maxLength: 20,
    message: "用户名最多20个字符",
  },
  {
    match: /^[a-zA-Z0-9_]+$/,
    message: "用户名只能包含字母、数字和下划线",
  },
];

// 邮箱验证规则
export const emailRules: FieldRule[] = [
  {
    required: true,
    message: "请输入邮箱地址",
  },
  {
    type: "email",
    message: "请输入有效的邮箱地址",
  },
];

// 密码验证规则
export const passwordRules: FieldRule[] = [
  {
    required: true,
    message: "请输入密码",
  },
  {
    minLength: 6,
    message: "密码至少6个字符",
  },
  {
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    message: "密码必须包含大小写字母和数字",
  },
];

// 确认密码验证规则
export const createConfirmPasswordRules = (password: string): FieldRule[] => [
  {
    required: true,
    message: "请确认密码",
  },
  {
    validator: (value: string, callback: (error?: string) => void) => {
      if (value !== password) {
        callback("两次输入的密码不一致");
      } else {
        callback();
      }
    },
  },
];

// 协议同意验证规则
export const agreementRules: FieldRule[] = [
  {
    type: "boolean",
    true: true,
    message: "请阅读并同意用户协议",
  },
];

// 用户组验证规则
export const groupRules: FieldRule[] = [
  {
    required: true,
    message: "请选择用户组",
  },
  {
    validator: (value: string, callback: (error?: string) => void) => {
      const validGroups = ["user", "test"];
      if (!validGroups.includes(value)) {
        callback("请选择有效的用户组");
      } else {
        callback();
      }
    },
  },
];
