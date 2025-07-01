import { useDocumentStore } from './document'
import { moveFolderAPI,createFolderAPI,deleteFolderAPI,renameFolderAPI } from '~/apis/folder'

import { Message } from '@arco-design/web-vue'


export const useFolderStore = defineStore('folder', () => {
    const documentStore = useDocumentStore()
    const userId=1 //TODO
    const createFolder=async(title:string,parentFolderId:number|null)=>{
        const result = await createFolderAPI({
            name: title,
            author_id: userId,
            parent_folder_id: parentFolderId
        })
        console.log(result)
        if (result.status === 200) {
            await documentStore.loadDocumentTree()
            Message.success("文件夹创建成功")
        }
    }
    const deleteFolder=async(folderId:number)=>{
        const result = await deleteFolderAPI(folderId)
        if (result.status === 200) {
            await documentStore.loadDocumentTree()
        }
    }
    const renameFolder=async(folderId:number,title:string)=>{
        const result = await renameFolderAPI(folderId,{
            name: title
        })
        console.log(result)
        if (result.status === 200) {
            await documentStore.loadDocumentTree()
        }
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