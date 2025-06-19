import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'





// 设置中文语言环境
dayjs.locale('zh-cn')

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs
    }
  }
}) 