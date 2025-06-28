import jwt from 'jsonwebtoken'

// 从环境变量中获取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET as string

// server/utils/auth.ts

import type { H3Event } from 'h3'


export async function requireAuth(event: H3Event) {
  const authHeader = getRequestHeader(event, 'authorization') || ''

  if (!authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: '未授权：缺少 Token' })
  }

  const token = authHeader.slice(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    event.context.user = decoded // 把用户信息保存到 event 上
  } catch {
    throw createError({ statusCode: 401, statusMessage: '无效或过期的 Token' })
  }
}

