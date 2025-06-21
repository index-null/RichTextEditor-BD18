import { defineEventHandler, getQuery } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

// json 文件路径，假设位于项目根的 database 文件夹中
const mockDataPath = path.resolve(process.cwd(), 'database/mockData.json')

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const docId = parseInt(query.documentId as string)

    if (isNaN(docId)) {
      return {
        status: 400,
        message: '文档 ID 无效'
      }
    }

    // 读取 json 文件内容
    const jsonStr = await fs.readFile(mockDataPath, 'utf-8')
    const mockData = JSON.parse(jsonStr)

    // 查找文档索引
    const index = mockData.documents.findIndex((doc: any) => doc.id === docId)
    if (index === -1) {
      return {
        status: 404,
        message: '文档未找到'
      }
    }

    // 删除文档
    mockData.documents.splice(index, 1)

    // 写回文件
    await fs.writeFile(mockDataPath, JSON.stringify(mockData, null, 2), 'utf-8')

    return {
      status: 200,
      message: '文档删除成功'
    }
  } catch (error) {
    console.error('删除文档失败:', error)
    return {
      status: 500,
      message: '删除文档失败',
      error: (error as Error).message
    }
  }
})
