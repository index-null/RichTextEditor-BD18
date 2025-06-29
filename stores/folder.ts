import { useDocumentStore } from './document'
import { moveFolderAPI } from '~/apis/folder'
import { Message } from '@arco-design/web-vue'


export const useFolderStore = defineStore('folder', () => {
    const documentStore = useDocumentStore()
    const moveFolder = async (folderId: number, targetParentId: number | null) => {
        const result = await moveFolderAPI(folderId, targetParentId)
        if (result.status === 200) {
            await documentStore.loadDocumentTree()
            Message.success("文件夹移动成功")
        }
    }
    return {
        moveFolder
    }
})