import { defineEventHandler, readBody } from 'h3'
import pool from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody(event)
  const {
    title,
    content = '',
    author_id,
    folder_id,
    createdAt,
    updatedAt
  } = body

  if (!title || !author_id) {
    return { status: 400, message: 'title 和 author_id 为必填项' }
  }

  try {
    // 获取用户组
    const userResult = await pool.query(
      'SELECT username, user_group FROM users WHERE id = $1',
      [author_id]
    )

    if (userResult.rowCount === 0) {
      return { status: 404, message: '用户不存在' }
    }

    const { username: author, user_group: userGroup } = userResult.rows[0]

    // ✅ 先检查标题冲突并生成唯一标题
    const baseTitle = title.trim()
    let finalTitle = baseTitle
    let suffix = 1

    while (true) {
      const check = await pool.query(
        `SELECT 1 FROM documents 
         WHERE title = $1 AND folder_id IS NOT DISTINCT FROM $2 AND user_group = $3`,
        [finalTitle, folder_id ?? null, userGroup]
      )
      if (check.rowCount === 0) break
      finalTitle = `${baseTitle} (${suffix++})`
    }

    // 插入文档
    const result = await pool.query(
      `INSERT INTO documents (title, content, author_id, folder_id, user_group, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        finalTitle,
        content,
        author_id,
        folder_id,
        userGroup,
        createdAt || new Date(),
        updatedAt || new Date()
      ]
    )

    const doc = result.rows[0]

    return {
      status: 200,
      message: '文档创建成功',
      data: {
        id: doc.id,
        title: doc.title,
        content: doc.content,
        author,
        author_id: doc.author_id,
        folder_id: doc.folder_id,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        size: `${Buffer.byteLength(doc.content) / 1024}KB`,
        type: 'document' as const
      }
    }
  } catch (err) {
    console.error('创建文档出错:', err)
    return {
      status: 500,
      message: '创建文档失败'
    }
  }
})
