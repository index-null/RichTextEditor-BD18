import ArcoVue, { Message, Notification } from '@arco-design/web-vue'

export default defineNuxtPlugin((nuxtApp) => {
  // 配置 Arco Design
  nuxtApp.vueApp.use(ArcoVue, {
    // 组件默认尺寸
    size: 'medium',
    // 组件类名前缀
    prefixCls: 'arco',
    // 全局配置
    componentConfig: {
      // 空状态全局配置
      empty: {
        description: '暂无数据'
      },
      // 全局加载中配置
      spin: {
        tip: '加载中...'
      }
    }
  })

  // 设置消息和通知的默认配置
  Message._context = nuxtApp.vueApp._context
  Notification._context = nuxtApp.vueApp._context

  // 提供全局方法
  return {
    provide: {
      message: Message,
      notification: Notification
    }
  }
}) 