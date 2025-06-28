import { recentDocumentsAPI,getDocumentTreeAPI } from "~/apis/document"

export interface Document {
  id: number
  title: string
  content: string
  author: string
  author_id:number
  createdAt: Date
  updatedAt: Date
  size?: string
  type: 'document'
}

export interface Folder {
  id: number
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
export interface ApiResponse<T>{
  statusCode:number
  body: {
    message:string
    data?:T
  }
}
export const useDocumentStore = defineStore('document', () => {
  // 状态
  const currentDocument = ref<Document | null>(null)
  const documentTree = ref<(Document | Folder)[]>([])
  const recentDocuments = ref<Document[]>([])
  const onlineUsers = ref<User[]>([])
  const isLoading = ref(false)
  // TODO
  const userId=ref(1)

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
  const myDocuments = computed(() => {
    const docs: Document[] = []
    const extractMyDocs = (items: (Document | Folder)[]) => {
      items.forEach(item => {
        if (item.type === 'document' && item.author_id === userId.value) {
          docs.push(item as Document)
        } else if (item.type === 'folder') {
          extractMyDocs((item as Folder).children)
        }
      })
    }
    extractMyDocs(documentTree.value)
    return docs
  })
  // Actions
  const loadDocumentTree = async () => {
    isLoading.value = true
    try {
      // 从API加载文档树
      const documentTreeResp = await getDocumentTreeAPI(userId.value)
      console.log("loadDocumentTree:",documentTreeResp)
      if (documentTreeResp.status === 200) {
        documentTree.value = documentTreeResp.data
      }
      
    } catch (error) {
      console.error('加载文档树失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadRecentDocuments = async () => {
    const recentDocumentsResp = await recentDocumentsAPI(userId.value)
    console.log("loadRecent:",recentDocumentsResp)
    if (recentDocumentsResp.status === 200) {
      recentDocuments.value = recentDocumentsResp.data
      console.log("最近文档：",recentDocuments.value)
    }
  }

  const loadDocument = async (documentId: number): Promise<Document | null> => {
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

  const createDocument = async (title: string, folderId?: number): Promise<Document> => {
    const newDocument: Document = {
      id: Date.now(),
      title,
      content: '',
      author: '当前用户', // TODO: 从用户状态获取
      author_id:userId.value,
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
            ; (item as Folder).children.push(newDocument)
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

  const updateDocument = async (documentId: number, updates: Partial<Document>) => {
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

  const deleteDocument = async (documentId: number) => {
    try {
      // TODO: 调用API删除文档
      const removeFromTree = (items: (Document | Folder)[]) => {
        return items.filter(item => {
          if (item.id === documentId) {
            return false
          }
          if (item.type === 'folder') {
            ; (item as Folder).children = removeFromTree((item as Folder).children)
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
    currentDocument,
    documentTree,
    recentDocuments,
    onlineUsers,
    isLoading,

    // Getters
    allDocuments,
    myDocuments,
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