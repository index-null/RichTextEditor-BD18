import request from '@/composables/http'

// 创建文件夹
export const createFolderAPI = (data: {
  name: string,
  author_id: number,
  parent_folder_id: number | null,
}) => {
  return request({
    url: '/folder/create',
    method: 'POST',
    data
  })
}
// 重命名文件夹
export const renameFolderAPI = (folderId: number,data: {
  name: string,
}) => {
  return request({
    url: `/folder/${folderId}`,
    method: 'PUT',
    data
  })
}
// 删除文件夹
export const deleteFolderAPI = (folderId: number) => {
  return request({
    url: `/folder/${folderId}`,
    method: 'DELETE'
  })
}
// 移动文件夹
export const moveFolderAPI = (folderId: number, targetParentId: number | null) => {
    return request('/folder/move', {
      method: 'POST',
      data: { folderId, targetParentId }
    })
  }
  

