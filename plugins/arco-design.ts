import ArcoVue from '@arco-design/web-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ArcoVue, {
    // 可以在这里配置Arco Design的全局设置
  })
}) 