// server/api/document/move.ts
import { defineEventHandler, readBody, createError } from 'h3'
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { documentId, targetFolderId } = body

  if (!documentId) {
    throw createError({ status: 400, message: '缺少 documentId' })
  }

  // targetFolderId允许为null，表示移动到根目录
  const folderId = targetFolderId || null

  try {
    const result = await pool.query(
      `UPDATE documents SET folder_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [folderId, documentId]
    )
    return {
      status: 200,
      message: '文档移动成功',
      data: result.rows[0]
    }
  } catch (err) {
    throw createError({ status: 500, message: '文档移动失败', data: (err as Error).message })
  }
})
