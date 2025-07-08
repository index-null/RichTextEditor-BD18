// server/api/document/[id].get.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      status: 400,
      message: '文档 ID 无效'
    })
  }

  try {
    const { rows } = await pool.query('SELECT * FROM documents WHERE id = $1', [Number(id)])
    if (rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: '文档未找到' })
    }

    return {
      status: 200,
      message:"获取文档成功",
      data: rows[0]
    }
  } catch {
    throw createError({
      statusCode: 500,
      message: '获取文档失败'
    })
  }
})
