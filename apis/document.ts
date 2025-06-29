import request from '@/composables/http'

// 请求当前用户组的文档树
export const getDocumentTreeAPI = (userId: number) => {
    return request({
        url: '/documentTree',
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
    title: string,
    content: string,
    author_id: number,
    folder_id: number | null,
    createdAt: Date,
    updatedAt: Date
}) => {
    return request({
        url: '/document/create',
        method: 'POST',
        data
    })
}
// 请求文档
export const getDocumentDetailAPI = (documentId: number) => {
    return request({
        url: `/document/${documentId}`,
        method: 'GET'
    })
}
// 更新文档
export const updateDocumentAPI = (
    documentId: number,
    data: {
        title?: string,
        content?: string
    }
) => {
    return request({
        url: `/document/${documentId}`,
        method: 'PUT',
        data
    })
}
// 删除文档
export const deleteDocumentAPI = (documentId: number) => {
    return request({
        url: `/document/${documentId}`,
        method: 'DELETE'
    })
}
// 拖动文件API
export const moveDocumentAPI = (documentId: number, targetFolderId: number | null) => {
    return request({
        url: '/document/move',
        method: 'POST',
        data: { documentId, targetFolderId }
    })
}
