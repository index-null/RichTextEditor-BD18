import { defineEventHandler, getQuery } from 'h3'
import mock_data from '@/database/mock_data'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId as string || '0'
    const userIdNum = parseInt(userId, 10)

    const { users, documents } = mock_data
    const userMap = new Map(users.map(user => [user.id, user.nickname]))
    const currentUser = users.find(u => u.id === userIdNum)

    if (!currentUser) {
      throw new Error('用户不存在')
    }

    const groupUserIds = users
      .filter(u => u.user_group === currentUser.user_group)
      .map(u => u.id)

    const recentDocuments = documents
      .filter(doc => groupUserIds.includes(doc.author_id))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
      .map(doc => ({
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
      data: {
        documents: recentDocuments
    }
    }
  } catch (error) {
    console.error('获取最近访问文档失败:', error)
    return {
      status: 500,
      message: '获取最近访问文档失败',
      error: (error as Error).message
    }
  }
})
