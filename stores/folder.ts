import { useDocumentStore } from './document'
import { useAuthStore } from './auth'
import { moveFolderAPI,createFolderAPI,deleteFolderAPI,renameFolderAPI } from '~/api/folder'
import { Message } from '@arco-design/web-vue'

export const useFolderStore = defineStore('folder', () => {
    const documentStore = useDocumentStore()
    const userStore=useAuthStore()
    const userId= Number(userStore.user?.id)
    const createFolder=async(title:string,parentFolderId:number|null)=>{
        const result = await createFolderAPI({
            name: title,
            author_id: userId,
            parent_folder_id: parentFolderId
        })
        console.log(result)
        if (result.status === 200) {
            await documentStore.loadDocumentTree()
            // Message.success("文件夹创建成功")
        }
    }
    const deleteFolder=async(folderId:number)=>{
        const result = await deleteFolderAPI(folderId)
        if (result.status === 200) {
            await documentStore.loadDocumentTree()
            Message.success("文件夹删除成功")
        }
    }
    const renameFolder=async(folderId:number,title:string)=>{
        const result = await renameFolderAPI(folderId,{
            name: title
        })
        if (result.status === 200) {
            await documentStore.loadDocumentTree()
        }
        return result
    }
    const moveFolder = async (folderId: number, targetParentId: number | null) => {
        const result = await moveFolderAPI(folderId, targetParentId)
        if (result.status === 200) {
            await documentStore.loadDocumentTree()
            Message.success("文件夹移动成功")
        }
    }

    return {
        createFolder,
        deleteFolder,
        renameFolder,
        moveFolder
    }
})