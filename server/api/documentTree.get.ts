// server/api/document-tree.ts
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
    // 查询用户组
    const userRes = await pool.query(
      `SELECT user_group FROM users WHERE id = $1`,
      [userId]
    )
    if (userRes.rows.length === 0) {
      return { status: 404, message: '用户不存在' }
    }
    const userGroup = userRes.rows[0].user_group

    // 获取该用户组下所有文件夹
    const folderRes = await pool.query(
      `SELECT id, name, parent_folder_id FROM folders WHERE user_group = $1`,
      [userGroup]
    )
    const folders = folderRes.rows

    // 获取该用户组下所有文档
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
      key:`doc_${row.id}`,
      // content: row.content,
      author: row.author,
      author_id: row.author_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      size: `${(row.content_length / 1024).toFixed(1)}KB`,
      type: 'document',
      folder_id: row.folder_id
    }))

    const topLevelDocs = documents.filter(doc => doc.folder_id === null)

    // === 构建嵌套树结构 ===

    // 构建 folder map，并加入 parent_folder_id 字段
    const folderMap = new Map()
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        id: folder.id,
        key:`folder_${folder.id}`,
        title: folder.name,
        type: 'folder',
        parent_folder_id: folder.parent_folder_id ?? null,
        children: []
      })
    })

    // 把文档挂到对应文件夹中
    documents.forEach(doc => {
      if (doc.folder_id && folderMap.has(doc.folder_id)) {
        folderMap.get(doc.folder_id).children.push(doc)
      }
    })

    // 构建嵌套文件夹结构
   const topLevelFolders: any[] = []
    folders.forEach(folder => {
      const current = folderMap.get(folder.id)
      if (folder.parent_folder_id && folderMap.has(folder.parent_folder_id)) {
        folderMap.get(folder.parent_folder_id).children.push(current)
      } else {
        topLevelFolders.push(current)
      }
    })

    // ✅ 排序每个文件夹的 children：文件夹在前，文档在后
    for (const folder of folderMap.values()) {
      folder.children.sort((a, b) => {
        if (a.type === b.type) return 0
        return a.type === 'folder' ? -1 : 1
      })
    }

    // 合并成最终文档树
    const documentTree = [...topLevelFolders, ...topLevelDocs]

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
