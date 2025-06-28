import { defineEventHandler, getQuery } from 'h3'
import pool from '../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId

  if (!userId) {
    return {
      status: 400,
      message: '缺少用户ID'
    }
  }

  try {
    // 查询用户所在组
    const userRes = await pool.query(
      `SELECT user_group FROM users WHERE id = $1`,
      [userId]
    )

    if (userRes.rows.length === 0) {
      return { status: 404, message: '用户不存在' }
    }

    const userGroup = userRes.rows[0].user_group

    // 查询该组下的所有根文件夹
    const folderRes = await pool.query(
      `
      SELECT id, name FROM folders
      WHERE user_group = $1 AND parent_folder_id IS NULL
    `,
      [userGroup]
    )

    const folders = folderRes.rows

    // 查询该组下所有文档及其作者信息
    const docRes = await pool.query(
      `
      SELECT d.id, d.title, d.content, d.folder_id, d.created_at, d.updated_at,
             d.author_id, u.nickname as author,
             LENGTH(d.content) as content_length
      FROM documents d
      JOIN users u ON d.author_id = u.id
      WHERE d.user_group = $1
    `,
      [userGroup]
    )

    const documents = docRes.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      author: row.author,
      author_id: row.author_id, 
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      size: `${(row.content_length / 1024).toFixed(1)}KB`,
      type: 'document',
      folder_id: row.folder_id
    }))

    // 构建文档树
    const documentTree = folders.map(folder => {
      const children = documents.filter(doc => doc.folder_id === folder.id)
      return {
        id: folder.id.toString(),
        title: folder.name,
        type: 'folder',
        children
      }
    })

    return {
      status: 200,
      message: '文档树获取成功',
      data: documentTree
    }

  } catch (error) {
    console.error('数据库查询失败:', error)
    return {
      status: 500,
      message: '服务器内部错误'
    }
  }
})
