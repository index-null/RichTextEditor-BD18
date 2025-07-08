import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    return { status: 400, message: '文档 ID 无效' }
  }

  const body = await readBody(event)
  const { title, content, updatedAt, folder_id } = body

  if (title === undefined && content === undefined && updatedAt === undefined) {
    return { status: 400, message: '缺少更新内容' }
  }

  // 先查询当前文档，拿到原 folder_id 用于检查重名
  const originalRes = await pool.query('SELECT * FROM documents WHERE id = $1', [id])
  if (originalRes.rowCount === 0) {
    return { status: 404, message: '文档未找到' }
  }
  const original = originalRes.rows[0]

  // 构造更新字段
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  // 如果标题有改动且不和自己相同，检查是否同文件夹内重名
  if (title !== undefined && title !== original.title) {
    const checkRes = await pool.query(
      `SELECT id FROM documents WHERE title = $1 
       AND (folder_id = $2 OR (folder_id IS NULL AND $2 IS NULL))
       AND id <> $3`,
      [title, folder_id ?? original.folder_id, id]
    )
    if (checkRes.rowCount&&checkRes.rowCount > 0) {
      // 重名，但内容还要保存，所以不抛错，改成提示信息返回
      return {
        status: 409,
        message: '同一文件夹下已有同名文档，标题未修改',
      }
    }
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

  // folder_id也可能需要更新（如果传了）
  if (folder_id !== undefined) {
    updates.push(`folder_id = $${paramIndex++}`)
    values.push(folder_id)
  }

  values.push(id) // 最后是 where id = $N

  if (updates.length === 0) {
    // 无更新字段，返回当前文档
    return {
      status: 200,
      message: '无更新内容，保持原文档',
      data: original
    }
  }

  const query = `UPDATE documents SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`

  try {
    const result = await pool.query(query, values)
    if (result.rowCount === 0) {
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
      message: '更新文档失败',
      
    }
  }
})
