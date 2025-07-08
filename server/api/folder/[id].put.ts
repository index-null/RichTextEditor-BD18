// server/api/folder/[id].put.ts
import { z } from 'zod'
import pool from '@/server/utils/db'

const RenameSchema = z.object({
  name: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const user = event.context.user
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const parsed = RenameSchema.safeParse(body)

  if (!parsed.success) {
    return {
      status: 400,
      message: '参数校验失败',
      issues: parsed.error.issues
    }
  }

  const { name } = parsed.data

  try {
    const client = await pool.connect()
    const folderRes = await pool.query(
      'SELECT * FROM folders WHERE id = $1 AND author_id = $2',
      [id, user.id]
    );
    if (folderRes.rows.length === 0) {
      return {
        status: 404,
        message: '无权限修改'
      };
    }

    // 检查新名字是否冲突
    const nameCheck = await pool.query(
      'SELECT id FROM folders WHERE name = $1 AND author_id = $2 AND id != $3',
      [name, user.id, id]
    );
    if (nameCheck.rows.length > 0) {
      return{
        status: 409,
        Message: 'Folder name already exists'
      };
    }
    // 执行重命名操作
    const result = await client.query(
      `UPDATE folders SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    )

    client.release()

    if (result.rowCount === 0) {
      return { status: 404, message: '文件夹未找到' }
    }

    return {
      status: 200,
      message: '文件夹重命名成功',
      data: result.rows[0]
    }
  } catch (err) {
    console.error('重命名失败:', err)
    return {
      status: 500,
      message: '服务器错误'
    }
  }
})
