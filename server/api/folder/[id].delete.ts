// server/api/folder/[id].delete.ts
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    return {
      status: 400,
      message: '无效的文件夹 ID'
    }
  }

  try {
    const client = await pool.connect()

    // 可选：检查是否还有子文件夹或文档
    const childCheck = await client.query(
      `SELECT 1 FROM folders WHERE parent_folder_id = $1 LIMIT 1`,
      [id]
    )

    if (childCheck.rowCount&&childCheck.rowCount > 0) {
      client.release()
      return { status: 400, message: '请先删除该文件夹下的子文件' }
    }

    const result = await client.query(
      `DELETE FROM folders WHERE id = $1 RETURNING *`,
      [id]
    )

    client.release()

    if (result.rowCount === 0) {
      return { status: 404, message: '文件夹不存在' }
    }

    return {
      status: 200,
      message: '文件夹已删除',
      data: result.rows[0]
    }
  } catch (err) {
    console.error('删除文件夹失败:', err)
    return {
      status: 500,
      message: '服务器错误'
    }
  }
})
