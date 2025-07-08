// server/api/document/move.ts
import { defineEventHandler, readBody, createError } from 'h3'
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const user = event.context.user;
  const body = await readBody(event)
  const { documentId, targetFolderId } = body

  if (!documentId) {
    throw createError({ status: 400, message: '缺少 documentId' })
  }

  // targetFolderId允许为null，表示移动到根目录
  const folderId = targetFolderId || null

  try {
    // 检查是否是用户自己的文档
    const docRes = await pool.query(
      'SELECT * FROM documents WHERE id = $1 AND author_id = $2',
      [documentId, user.id]
    );

    if (docRes.rows.length === 0) {
      return{
        status: 404,
        message: '无权限移动'
      };
    }

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
