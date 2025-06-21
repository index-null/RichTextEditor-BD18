export interface CustomDocument {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
  size?: string
  type: 'document'
}
export interface User {
  id: string
  name: string
  color: string
  isOnline: boolean
}
export interface Folder {
  id: string
  title: string
  type: 'folder'
  children: (CustomDocument | Folder)[]
}
export interface ApiResponse<T> {
  status: number
  message: string
  data?: T | null
}
export const useDocumentStore = defineStore('document', () => {
  // 状态
  const currentDocument = ref<CustomDocument | null>(null)
  const documentTree = ref<(CustomDocument | Folder)[]>([])
  const recentDocuments = ref<CustomDocument[]>([])
  const onlineUsers = ref<User[]>([])
  const isLoading = ref(false)
  // TODO:获取用户ID
  const userId = "1"
  // Getters
  const allDocuments = computed(() => {
    const docs: CustomDocument[] = []
    const extractDocs = (items: (CustomDocument | Folder)[]) => {
      items.forEach(item => {
        if (item.type === 'document') {
          docs.push(item as CustomDocument)
        } else if (item.type === 'folder') {
          extractDocs((item as Folder).children)
        }
      })
    }
    extractDocs(documentTree.value)
    return docs
  })

  // Actions
  const loadDocumentTree = async (): Promise<(CustomDocument | Folder)[]> => {

    isLoading.value = true
    try {
      // 从API加载文档树
      const response = await $fetch<ApiResponse<(CustomDocument | Folder)[]>>('/api/documentTree', {
        "method": "GET",
        "query": {
          "userId": userId
        }
      })
      if (response?.status === 200 && response.data) {
        const convertTree = (items: (CustomDocument | Folder)[]): (CustomDocument | Folder)[] => {
          return items.map(item => {
            if (item.type === 'document') {
              return {
                ...item,
                createdAt: new Date(item.createdAt),
                updatedAt: new Date(item.updatedAt)
              }
            } else if ('children' in item && Array.isArray(item.children)) {
              return {
                ...item,
                children: convertTree(item.children)
              }
            } else {
              return item
            }
          })
        }
  
        documentTree.value = convertTree(response.data)

        return documentTree.value
      }
      return []
    } catch  {
      console.log('加载文档树失败')
      return []
    } finally {
      isLoading.value = false
    }
  }

  const loadRecentDocuments = async (): Promise<CustomDocument[]> => {
    try {
      // 从API加载最近访问的文档
      const response = await $fetch<ApiResponse<CustomDocument[]>>('/api/recentDocuments', {
        "method": "GET",
        "query": {
          "userId": userId
        }
      })
      console.log(response)

      if (response?.status === 200 && response.data) {

        recentDocuments.value = response.data.map(doc => ({
          ...doc,
          // 将字符串转换为 Date 对象
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt)
        }));
      }


      return recentDocuments.value.length > 0 ? recentDocuments.value : [];
    } catch (error) {
      console.error('加载最近文档失败:', error)
      return []
    }
  }

  const loadDocument = async (documentId: string): Promise<CustomDocument | null> => {
    isLoading.value = true
    try {
      // 从API加载具体文档
      const document = await $fetch<ApiResponse<CustomDocument>>('/api/document', {
        "method": "GET",
        "query": {
          "documentId": documentId
        }
      })
      if (document?.status === 200 && document.data) {
        currentDocument.value = document.data
        return currentDocument.value
      }
      return null
    } catch (error) {
      console.error('加载文档失败:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createDocument = async (title: string, folderId?: string): Promise<ApiResponse<CustomDocument|undefined>> => {
    // 调用API创建文档
    const response = await $fetch<ApiResponse<CustomDocument>>('/api/document', {
      method: 'POST',
      body: {
        title,
        folderId,
        userId: userId, 
      }
    })
    return response
  }

  const updateDocument = async (
    documentId: string,
    updates: Partial<CustomDocument>
  ): Promise<ApiResponse<CustomDocument> | undefined> => {
    try {
        const response = await $fetch<ApiResponse<CustomDocument>>('/api/document', {
          method: 'PUT',
          query: { documentId },
          body: { updatedData: updates }
        })
        return response
    } catch (error) {
      console.error('更新文档失败:', error)
      return {
        status: 500,
        message: '更新文档失败',
      }
    }
  }


  const deleteDocument = async (documentId: string): Promise<ApiResponse<CustomDocument | undefined>> => {
    try {
      // TODO: 调用API删除文档
      const response = await $fetch<ApiResponse<CustomDocument>>('/api/document', {
        method: 'DELETE',
        query: {
          documentId: documentId
        }
      })
      return response
    } catch (error) {
      console.error('删除文档失败:', error)
      return {
        status: 500,
        message: "删除文档失败"
      }
    }
  }

  const updateOnlineUsers = (users: User[]) => {
    onlineUsers.value = users
  }

  return {
    // State
    currentDocument: currentDocument,
    documentTree: documentTree,
    recentDocuments: recentDocuments,
    onlineUsers: onlineUsers,
    isLoading: isLoading,

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