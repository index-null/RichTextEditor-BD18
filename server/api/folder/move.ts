// server/api/folder/move.ts
import { defineEventHandler, readBody, createError } from 'h3'
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const user = event.context.user;
  const body = await readBody(event)
  const { folderId, targetParentId } = body

  if (!folderId) {
    throw createError({ status: 400, message: '缺少 folderId' })
  }

  const targetId = targetParentId || null

  if (targetId !== null) {
    const checkCycleSQL = `
      WITH RECURSIVE ancestors AS (
        SELECT id, parent_folder_id
        FROM folders
        WHERE id = $1
        UNION ALL
        SELECT f.id, f.parent_folder_id
        FROM folders f
        INNER JOIN ancestors a ON f.id = a.parent_folder_id
      )
      SELECT id FROM ancestors WHERE id = $2
    `
    const cycleCheckResult = await pool.query(checkCycleSQL, [targetId, folderId])
    if (cycleCheckResult.rowCount&&cycleCheckResult.rowCount > 0) {
      return{ status: 400, message: '不能将文件夹移动到其自身或子文件夹中' }
    }
  }

  try {
    const result = await pool.query(
      `UPDATE folders SET parent_folder_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [targetId, folderId]
    )
    return {
      status: 200,
      message: '文件夹移动成功',
      data: result.rows[0]
    }
  } catch (err) {
    return{ status: 500, message: '文件夹移动失败', data: (err as Error).message }
  }
})
