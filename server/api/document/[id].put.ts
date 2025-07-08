// server/api/document/[id].put.ts
import { defineEventHandler, getRouterParam, readBody } from 'h3'
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    return { status: 400, message: '文档 ID 无效' }
  }

  const body = await readBody(event)
  const { title, content, updatedAt } = body

  if (title === undefined && content === undefined && updatedAt === undefined) {
    return { status: 400, message: '缺少更新内容' }
  }

  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  if (title !== undefined) {
    updates.push(`title = $${paramIndex++}`)
    values.push(title)
  }

  if (content !== undefined) {
    updates.push(`content = $${paramIndex++}`)
    values.push(content)
  }

  if (updatedAt !== undefined) {
    updates.push(`updated_at = $${paramIndex++}`)
    values.push(new Date(updatedAt))
  }

  values.push(Number(id))

  try {
    const query = `UPDATE documents SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`
    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return { status: 404, message: '文档未找到' }
    }

    return {
      status: 200,
      message: '文档更新成功',
      data: result.rows[0]
    }
  } catch {
    return {
      status: 500,
      message: '更新文档失败'
    }
  }
})
