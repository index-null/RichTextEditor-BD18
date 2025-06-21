import { defineEventHandler, readBody } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, folderId, userId } = body

    if (!title || !userId) {
      return {
        status: 400,
        message: '缺少必要字段 title 或 author'
      }
    }

    const filePath = path.resolve(process.cwd(), 'database/mockData.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const mock_data = JSON.parse(fileContent)

    const newId = mock_data.documents.length > 0
      ? Math.max(...mock_data.documents.map((d: any) => d.id)) + 1
      : 1

    const now = new Date().toISOString()
    const newDoc = {
      id: newId,
      title,
      content: '',
      author_id: userId, // TODO: 实际项目中根据 author 名字查 user.id
      folder_id: folderId ? parseInt(folderId) : null,
      created_at: now,
      updated_at: now,
      user_group: 'editor',
      size: '0KB'
    }

    mock_data.documents.push(newDoc)

    await fs.writeFile(filePath, JSON.stringify(mock_data, null, 2), 'utf-8')

    return {
      status: 200,
      message: '文档创建成功',
      data: {
        id: newDoc.id.toString(),
        title: newDoc.title,
        content: '',
        author:'张三',
        createdAt: newDoc.created_at,
        updatedAt: newDoc.updated_at,
        type: 'document',
        size: newDoc.size
      }
    }
  } catch (error) {
    console.error('创建文档失败:', error)
    return {
      status: 500,
      message: '创建文档失败',
      error: (error as Error).message
    }
  }
})
