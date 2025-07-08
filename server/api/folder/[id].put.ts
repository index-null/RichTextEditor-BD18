// server/api/folder/[id].put.ts
import { z } from 'zod'
import pool from '@/server/utils/db'

const RenameSchema = z.object({
  name: z.string().min(1)
})

export default defineEventHandler(async (event) => {
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
  await requireAuth(event);
  const { name } = parsed.data

  try {
    const client = await pool.connect()

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
