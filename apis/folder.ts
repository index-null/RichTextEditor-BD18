import request from '@/composables/http'

// 创建文件夹
export const createFolderAPI = (data: {
  userId: string,
  title: string,
}) => {
  return request({
    url: '/folders',
    method: 'POST',
    data
  })
}
// 重命名文件夹
export const renameFolderAPI = (data: {
  folderId: string,
  title: string,
}) => {
  return request({
    url: `/folders/${data.folderId}`,
    method: 'PUT',
    data
  })
}
// 删除文件夹
export const deleteFolderAPI = (folderId: string) => {
  return request({
    url: `/folders/${folderId}`,
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
  

