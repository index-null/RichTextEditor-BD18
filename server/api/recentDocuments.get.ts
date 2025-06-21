import { defineEventHandler, getQuery } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId as string || '0'
    const userIdNum = parseInt(userId, 10)

    // 读取 mockData.json 文件
    const filePath = path.resolve(process.cwd(), 'database/mockData.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const mock_data = JSON.parse(fileContent)

    const { users, documents } = mock_data
    const userMap = new Map(users.map((user: any) => [user.id, user.nickname]))
    const currentUser = users.find((u: any) => u.id === userIdNum)

    if (!currentUser) {
      throw new Error('用户不存在')
    }

    const groupUserIds = users
      .filter((u: any) => u.user_group === currentUser.user_group)
      .map((u: any) => u.id)

    const recentDocuments = documents
      .filter((doc: any) => groupUserIds.includes(doc.author_id))
      .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
      .map((doc: any) => ({
        id: doc.id.toString(),
        title: doc.title,
        content: doc.content,
        author: userMap.get(doc.author_id) || '未知作者',
        createdAt: new Date(doc.created_at),
        updatedAt: new Date(doc.updated_at),
        type: 'document'
      }))

    return {
      status: 200,
      message: '获取最近访问文档成功',
      data: recentDocuments
    }
  } catch (error) {
    return {
      status: 500,
      message: '获取最近访问文档失败',
      error: (error as Error).message
    }
  }
})
