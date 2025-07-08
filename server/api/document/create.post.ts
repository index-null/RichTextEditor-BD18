import { defineEventHandler, readBody } from 'h3'
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readBody(event)
  const {
    title,
    content = '',
    author_id,
    folder_id,
    createdAt,
    updatedAt,
  } = body

  if (!title || !author_id) {
    return { status: 400, message: 'title 和 author_id 为必填项' }
  }

  try {
    // 查询用户信息
    const userResult = await pool.query(
      'SELECT username, user_group FROM users WHERE id = $1',
      [author_id]
    )

    if (userResult.rowCount === 0) {
      return { status: 404, message: '用户不存在' }
    }

    const { username: author, user_group: userGroup } = userResult.rows[0]

    // 插入文档
    const result = await pool.query(
      `INSERT INTO documents (title, content, author_id, folder_id, user_group, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        content,
        author_id,
        folder_id,
        userGroup,
        createdAt || new Date(),
        updatedAt || new Date()
      ]
    )

    const doc = result.rows[0]

    // 构造返回数据结构
    const response = {
      id: doc.id,
      title: doc.title,
      content: doc.content,
      author,                         // 从 user 表获取的 username
      author_id: doc.author_id,
      folder_id: doc.folder_id,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
      size: `${Buffer.byteLength(doc.content) / 1024}KB`, // 可按需计算 size，如 Buffer.byteLength(content)
      type: 'document' as const
    }

    return {
      status: 200,
      message: '文档创建成功',
      data: response
    }

  } catch {
    return {
      status: 500,
      message: '创建文档失败'
    }
  }
})
