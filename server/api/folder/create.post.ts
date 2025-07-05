// server/api/folder/create.post.ts
import { z } from 'zod'
import pool from '@/server/utils/db'

const FolderSchema = z.object({
  name: z.string().min(1),
  author_id: z.number().int(),
  parent_folder_id: z.number().int().nullable().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = FolderSchema.safeParse(body)
  if (!parsed.success) {
    return {
      status: 400,
      message: '参数校验失败'
    }
  }

  const { name, author_id, parent_folder_id } = parsed.data

  try {
    const client = await pool.connect()

    // 1. 查询用户所属 user_group
    const userRes = await client.query(
      `SELECT user_group FROM users WHERE id = $1`,
      [author_id]
    )

    if (userRes.rowCount === 0) {
      client.release()
      return {
        status: 404,
        message: '用户不存在'
      }
    }

    const user_group = userRes.rows[0].user_group

    // 2. 插入文件夹记录，包括 user_group
    const insertQuery = `
      INSERT INTO folders (name, author_id, parent_folder_id, user_group)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const values = [name, author_id, parent_folder_id ?? null, user_group]

    const result = await client.query(insertQuery, values)
    client.release()

    return {
      status: 200,
      message: '文件夹创建成功',
      data: result.rows[0]
    }
  } catch (err) {
    console.error('创建文件夹出错:', err)
    return {
      status: 500,
      message: '创建文件夹失败'
    }
  }
})
