// server/api/auth/profile.get.ts
import { requireAuth } from '../../utils/auth' 

export default defineEventHandler(async (event) => {
  await requireAuth(event)  // ⬅️ 调用你刚定义的函数

  const user = event.context.user
  return {
    message: '查询成功', user
  }
})
