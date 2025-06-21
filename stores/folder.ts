import { defineStore } from 'pinia'
export const useFolderStore = defineStore('folder',()=>{
    const userId=1 //TODO:模拟用户ID
    const createFolder = async (name: string,parent_folder_id:string|null) => {
        try {
          const response = await $fetch('/api/folder', {
            method: 'POST',
            body:{ userId,name,parentId:parent_folder_id },
          })
          return response
        } catch (error) {
          console.log('创建文件夹失败:', error)
          return {
            status: 500,
            message: '创建文件夹失败',
            error: (error as Error).message
          }
        }
    }
    return {
        createFolder
    }
    
})