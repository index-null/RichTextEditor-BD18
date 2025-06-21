// 获取文档列表API
export default defineEventHandler(async (_event) => {
  // 模拟文档数据
  const mockDocuments = [
    {
      id: '1',
      title: '项目技术方案',
      content: '# 技术方案\n这是项目技术方案的内容...',
      author: '张三',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
      size: '2.3KB',
      type: 'document'
    },
    {
      id: '2',
      title: '产品需求文档',
      content: '# 产品需求\n这是产品需求文档的内容...',
      author: '李四',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-14'),
      size: '1.8KB',
      type: 'document'
    }
  ]

  return {
    success: true,
    data: mockDocuments
  }
}) 