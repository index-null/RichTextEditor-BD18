export default [
    {
      id: '1',
      title: '工作文档',
      type: 'folder',
      children: [
        {
          id: '1-1',
          title: '项目计划.md',
          content: '# 项目计划\n这是项目计划文档...',
          author: '张三',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15'),
          size: '2.3KB',
          type: 'document'
        },
        {
          id: '1-2',
          title: '需求文档.md',
          content: '# 需求文档\n这是需求文档...',
          author: '李四',
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-14'),
          size: '1.8KB',
          type: 'document'
        }
      ]
    },
    {
      id: '2',
      title: '个人笔记',
      type: 'folder',
      children: [
        {
          id: '2-1',
          title: '学习笔记.md',
          content: '# 学习笔记\n记录学习内容...',
          author: '王五',
          createdAt: new Date('2024-01-08'),
          updatedAt: new Date('2024-01-13'),
          size: '3.1KB',
          type: 'document'
        }
      ]
    }
  ]