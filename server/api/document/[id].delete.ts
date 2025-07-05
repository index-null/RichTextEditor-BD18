// server/api/document/[id].delete.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import pool from '@/server/utils/db' 

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      status: 400,
      message: '文档 ID 无效'
    })
  }

  try {
    await pool.query('DELETE FROM documents WHERE id = $1 RETURNING *', [Number(id)])


    return {
      status: 200,
      message: '文档删除成功',
    }
  } catch  {

    throw createError({
      status: 500,
      message: '删除文档时出错'
    })
  }
})
