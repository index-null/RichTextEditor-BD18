import request from '@/composables/http'

// 请求当前用户组的文档树
export const getDocumentTreeAPI = (userId: number) => {
  return request({
    url: '/documents',
    method: 'GET',
    params: {
      userId
    }
  })
}
// 请求最近文档
export const recentDocumentsAPI = (userId: number) => {
  return request({
    url: '/recentDocuments',
    method: 'GET',
    params: {
      userId
    }
  })
}
// 创建新文档
export const createDocumentAPI = (data: {
  userId: string,
  title: string,
  content: string
}) => {
  return request({
    url: '/documents',
    method: 'POST',
    data
  })
}
// 请求文档
export const getDocumentDetailAPI = (documentId: string) => {
  return request({
    url: `/documents/${documentId}`,
    method: 'GET'
  })
}
// 更新文档
export const updateDocumentAPI = (data: {
  documentId: string,
  updates: {
    title?: string,
    content?: string
  }
}) => {
  return request({
    url: `/documents/${data.documentId}`,
    method: 'PUT',
    data
  })
}
// 删除文档
export const deleteDocumentAPI = (documentId: string) => {
  return request({
    url: `/documents/${documentId}`,
    method: 'DELETE'
  })
}
// 拖动文件或文件夹的API
export const moveItemAPI = (data: {
    itemId: string,
    itemType: 'document' | 'folder',
    targetFolderId: string,
    position?: number
  }) => {
    return request({
      url: '/itemMove',
      method: 'PUT',
      data
    })
}