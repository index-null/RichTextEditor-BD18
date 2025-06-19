export interface Document {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
  size?: string
  type: 'document'
}

export interface Folder {
  id: string
  title: string
  type: 'folder'
  children: (Document | Folder)[]
}

export interface User {
  id: string
  name: string
  color: string
  isOnline: boolean
}

export const useDocumentStore = defineStore('document', () => {
  // 状态
  const currentDocument = ref<Document | null>(null)
  const documentTree = ref<(Document | Folder)[]>([])
  const recentDocuments = ref<Document[]>([])
  const onlineUsers = ref<User[]>([])
  const isLoading = ref(false)

  // Getters
  const allDocuments = computed(() => {
    const docs: Document[] = []
    const extractDocs = (items: (Document | Folder)[]) => {
      items.forEach(item => {
        if (item.type === 'document') {
          docs.push(item as Document)
        } else if (item.type === 'folder') {
          extractDocs((item as Folder).children)
        }
      })
    }
    extractDocs(documentTree.value)
    return docs
  })

  // Actions
  const loadDocumentTree = async () => {
    isLoading.value = true
    try {
      // TODO: 从API加载文档树
      // 模拟数据
      documentTree.value = [
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
    } catch (error) {
      console.error('加载文档树失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadRecentDocuments = async () => {
    try {
      // TODO: 从API加载最近访问的文档
      recentDocuments.value = [
        {
          id: '1',
          title: '项目技术方案',
          content: '# 技术方案\n项目技术方案内容...',
          author: '张三',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15'),
          type: 'document'
        },
        {
          id: '2',
          title: '产品需求文档',
          content: '# 产品需求\n产品需求内容...',
          author: '李四',
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-14'),
          type: 'document'
        }
      ]
    } catch (error) {
      console.error('加载最近文档失败:', error)
    }
  }

  const loadDocument = async (documentId: string): Promise<Document | null> => {
    isLoading.value = true
    try {
      // TODO: 从API加载具体文档
      const document = allDocuments.value.find(doc => doc.id === documentId)
      if (document) {
        currentDocument.value = document
        return document
      }
      return null
    } catch (error) {
      console.error('加载文档失败:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createDocument = async (title: string, folderId?: string): Promise<Document> => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title,
      content: '',
      author: '当前用户', // TODO: 从用户状态获取
      createdAt: new Date(),
      updatedAt: new Date(),
      type: 'document'
    }

    // TODO: 调用API创建文档
    // 模拟添加到本地状态
    if (folderId) {
      // 添加到指定文件夹
      const addToFolder = (items: (Document | Folder)[]) => {
        items.forEach(item => {
          if (item.type === 'folder' && item.id === folderId) {
            ;(item as Folder).children.push(newDocument)
          } else if (item.type === 'folder') {
            addToFolder((item as Folder).children)
          }
        })
      }
      addToFolder(documentTree.value)
    } else {
      // 添加到根目录
      documentTree.value.push(newDocument)
    }

    return newDocument
  }

  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    try {
      // TODO: 调用API更新文档
      if (currentDocument.value && currentDocument.value.id === documentId) {
        Object.assign(currentDocument.value, {
          ...updates,
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('更新文档失败:', error)
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      // TODO: 调用API删除文档
      const removeFromTree = (items: (Document | Folder)[]) => {
        return items.filter(item => {
          if (item.id === documentId) {
            return false
          }
          if (item.type === 'folder') {
            ;(item as Folder).children = removeFromTree((item as Folder).children)
          }
          return true
        })
      }
      documentTree.value = removeFromTree(documentTree.value)
    } catch (error) {
      console.error('删除文档失败:', error)
    }
  }

  const updateOnlineUsers = (users: User[]) => {
    onlineUsers.value = users
  }

  return {
    // State
    currentDocument: readonly(currentDocument),
    documentTree: readonly(documentTree),
    recentDocuments: readonly(recentDocuments),
    onlineUsers: readonly(onlineUsers),
    isLoading: readonly(isLoading),
    
    // Getters
    allDocuments,
    
    // Actions
    loadDocumentTree,
    loadRecentDocuments,
    loadDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    updateOnlineUsers
  }
}) 