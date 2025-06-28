import { defineEventHandler, getQuery } from 'h3'
import pool from '../utils/db'

function isNewDocument(updatedAt: Date): boolean {
  const now = new Date()
  const diffTime = now.getTime() - updatedAt.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return diffDays <= 7
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId

    if (!userId) {
      return {
        status: 400,
        message: '缺少用户ID参数'
      }
    }

    const sql = `
      SELECT d.id, d.title, d.updated_at, u.nickname AS author
      FROM documents d
      JOIN users u ON d.author_id = u.id
      WHERE d.author_id = $1
      ORDER BY d.updated_at DESC
      LIMIT 20
    `
    const result = await pool.query(sql, [userId])

    const documents = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      updatedAt: row.updated_at,
      author: row.author || '未知',
      isNew: isNewDocument(new Date(row.updated_at))
    }))

    return {
      status: 200,
      message: '最近文档获取成功',
      data: documents
    }

  } catch (error) {
    console.error('数据库查询错误', error)
    return {
      status: 500,
      message: '服务器内部错误'
    }
  }
})
