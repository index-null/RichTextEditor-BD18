// server/api/folder/[id].delete.ts
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    return {
      status: 400,
      message: '无效的文件夹 ID'
    }
  }
  
  const user = event.context.user;
  try {
    const client = await pool.connect()
    // 检查文件夹是否存在并属于该用户
    const folderRes = await pool.query(
      'SELECT * FROM folders WHERE id = $1 AND author_id = $2',
      [id, Number(user.id)]
    );

    if (folderRes.rows.length === 0) {
      return {
        statusCode: 404,
        statusMessage: '文件夹未找到或无权限访问'
      };
    }


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
  } catch {
    return {
      status: 500,
      message: '服务器错误'
    }
  }
})
