import { Message } from "@arco-design/web-vue"
import { recentDocumentsAPI, getDocumentTreeAPI, deleteDocumentAPI, createDocumentAPI, updateDocumentAPI, getDocumentDetailAPI,  moveDocumentAPI } from "~/apis/document"



export interface Document {
  id: number
  title: string
  content: string
  author: string
  author_id: number
  folder_id: number | null
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

export const useDocumentStore = defineStore('document', () => {
  // 状态
  const currentDocument = ref<Document | null>(null)
  const documentTree = ref<(Document | Folder)[]>([])
  const recentDocuments = ref<Document[]>([])
  const onlineUsers = ref<User[]>([])
  const isLoading = ref(false)
  // TODO
  const userId = ref(1)

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
      if (documentTreeResp.status === 200) {
        documentTree.value = documentTreeResp.data
      }
      console.log("文档树：", documentTreeResp)
    } catch (error) {
      console.error('加载文档树失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadRecentDocuments = async () => {
    const recentDocumentsResp = await recentDocumentsAPI(userId.value)
    if (recentDocumentsResp.status === 200) {
      recentDocuments.value = recentDocumentsResp.data
    }
  }

  const loadDocument = async (documentId: number): Promise<Document | null> => {
    isLoading.value = true
    try {
      // 从API加载具体文档
      const documentResp = await getDocumentDetailAPI(documentId)
      if (documentResp.status === 200) {
        currentDocument.value = documentResp.data
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

  const createDocument = async (title: string, folderId?: number | null): Promise<Document> => {
    const newDocumentTemp: Partial<Document> = {
      title: title || "",
      content: '',
      author_id: userId.value,
      folder_id: folderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    // 调用API创建文档
    const res = await createDocumentAPI(newDocumentTemp as {
      title: string
      content: string
      author_id: number
      folder_id: number | null
      createdAt: Date
      updatedAt: Date
    })
    const newDocument = res.data
    currentDocument.value = res.data
    console.log(res)
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
      // 调用API更新文档
      if (currentDocument.value && currentDocument.value.id === documentId) {
        Object.assign(currentDocument.value, {
          ...updates,
          ...(updates.content ? { updatedAt: new Date() } : {})
        })
        const updatedData = {
          ...updates,
          ...(updates.content ? { updatedAt: new Date() } : {})
        }
        await updateDocumentAPI(
          documentId,
          updatedData
        )
      }
    } catch (error) {
      console.error('更新文档失败:', error)
    }
  }

  const deleteDocument = async (documentId: number) => {
    try {
      // 删除树中文档
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
      // 从数据库删除
      const res = await deleteDocumentAPI(documentId)
      if (res.status === 200) {
        // 从树中移除
        documentTree.value = removeFromTree(documentTree.value)
        await loadRecentDocuments()
        Message.success('文档已删除')
        console.log("删除文档后的最近文档：", recentDocuments)
      }
    } catch (error) {
      console.error('删除文档失败:', error)
    }
  }
  const moveDocument=async(documentId:number,targetFolderId:number|null)=>{
    const result=await moveDocumentAPI(documentId,targetFolderId)
    if(result.status===200){
      await loadDocumentTree()
      Message.success("文件移动成功")

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
    updateOnlineUsers,
    moveDocument
  }
})