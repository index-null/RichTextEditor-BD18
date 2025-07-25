// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    host: "0.0.0.0",
    port: 4120,
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  ssr: true,

  // CSS配置 - 移除全局暗色CSS
  css: ["@arco-design/web-vue/dist/arco.css"],

  // 模块配置
  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/devtools",
    "@nuxtjs/color-mode",
  ],

  // Color Mode 配置
  colorMode: {
    preference: "light", // 默认亮色模式
    fallback: "light", // 备用模式
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },

  // TypeScript配置
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // Vite配置
  vite: {
    optimizeDeps: {
      include: [
        "@arco-design/web-vue",
        "@arco-design/web-vue/es/icon",
        "@tiptap/core",
        "@tiptap/starter-kit",
        "@tiptap/vue-3",
        "yjs",
        "dayjs",
        "dayjs/plugin/customParseFormat",
        "dayjs/plugin/isBetween",
        "dayjs/plugin/weekOfYear",
        "dayjs/plugin/advancedFormat",
        "dayjs/plugin/weekYear",
        "dayjs/plugin/quarterOfYear",
      ],
    },
    ssr: {
      noExternal: ["@arco-design/web-vue"],
    },
    define: {
      global: "globalThis",
    },
  },

  // 构建配置
  build: {
    transpile: ["@arco-design/web-vue"],
  },

  // 运行时配置
  runtimeConfig: {
    // 服务端环境变量
    public: {
      // 客户端环境变量
      websocketUrl: process.env.WEBSOCKET_URL || "ws://localhost:3001",
    },
  },
});
