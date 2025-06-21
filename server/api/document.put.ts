import { defineEventHandler, getQuery, readBody } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const documentId = parseInt(query.documentId as string, 10)

    if (!documentId) {
      return {
        status: 400,
        message: '缺少文档 ID'
      }
    }

    const body = await readBody(event)
    const updatedData = body.updatedData

    // 读取 mockData.json 文件
    const filePath = path.resolve(process.cwd(), 'database/mockData.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const mock_data = JSON.parse(fileContent)

    const document = mock_data.documents.find((doc: any) => doc.id === documentId)

    if (!document) {
      return {
        status: 404,
        message: '文档不存在'
      }
    }

    // 合并修改
    Object.assign(document, updatedData)
    document.updated_at = new Date().toISOString()

    // 写入回 JSON 文件
    await fs.writeFile(filePath, JSON.stringify(mock_data, null, 2), 'utf-8')

    return {
      status: 200,
      message: '文档更新成功',
      data: document
    }
  } catch (error) {
    console.error('更新文档失败:', error)
    return {
      status: 500,
      message: '更新文档失败',
      error: (error as Error).message
    }
  }
})
