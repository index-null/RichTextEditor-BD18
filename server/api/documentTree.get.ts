import { defineEventHandler, getQuery } from 'h3'
import mock_data from '@/database/mock_data'

export interface BaseDbModel {
    id: number;
    created_at: string;
    updated_at: string;
    user_group: 'admin' | 'editor' | 'viewer';
}

export interface User_db extends BaseDbModel {
    username: string;
    password_hash: string;
    nickname: string;
}

export interface Document_db extends BaseDbModel {
    title: string;
    content: string;
    author_id: number;
    folder_id: number | null;
    size?: string;
}

export interface Folder_db extends BaseDbModel {
    name: string;
    author_id: number;
    parent_folder_id: number | null;
}

interface BaseNode {
    id: string
    title: string
    type: 'folder' | 'document'
}

interface ApiFolder extends BaseNode {
    type: 'folder'
    children: (ApiFolder | ApiDocument)[]
}

interface ApiDocument extends BaseNode {
    type: 'document'
    content: string
    author: string
    createdAt: string
    updatedAt: string
    size: string
}

const convertToDocumentTree = (
    folders: Folder_db[],
    documents: Document_db[],
    users: User_db[]
): ApiFolder[] => {
    const userMap = new Map(users.map(user => [user.id, user.nickname]))

    const buildFolder = (folder: Folder_db): ApiFolder => {
        const childrenFolders = folders.filter(f => f.parent_folder_id === folder.id)
        const childrenDocuments = documents.filter(doc => doc.folder_id === folder.id)

        const children: (ApiFolder | ApiDocument)[] = [
            ...childrenDocuments.map(doc => {
                const author = userMap.get(doc.author_id) || '未知作者'
                const apiDoc: ApiDocument = {
                    id: doc.id.toString(),
                    title: doc.title,
                    type: 'document',
                    content: doc.content,
                    author,
                    createdAt: doc.created_at,
                    updatedAt: doc.updated_at,
                    size: doc.size || '0KB'
                }
                return apiDoc
            }),
            ...childrenFolders.map(buildFolder)
        ]

        children.sort((a, b) => a.title.localeCompare(b.title))

        return {
            id: folder.id.toString(),
            title: folder.name,
            type: 'folder',
            children
        }
    }

    const rootFolders = folders.filter(folder => folder.parent_folder_id === null)
    return rootFolders.map(buildFolder)
}

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const userId = query.userId as string || '1'

        console.log('请求文档树的用户id:', userId)

        const { users, documents, folders } = mock_data
        const userIdNum = parseInt(userId, 10)
        const currentUser = users.find(u => u.id === userIdNum)

        if (!currentUser) {
            throw new Error('用户不存在')
        }

        const group = currentUser.user_group

        // 筛选所有属于该用户组的文档和文件夹（不限定作者）
        const filteredDocuments = documents.filter(doc => doc.user_group === group)
        const filteredFolders = folders.filter(folder => folder.user_group === group)

        const documentTree = convertToDocumentTree(filteredFolders, filteredDocuments, users)

        return {
            status: 200,
            message: '获取文档树成功',
            data: {
                documents: documentTree
            }
        }
    } catch (error) {
        console.error('获取文档树失败:', error)
        return {
            status: 500,
            message: '获取文档树失败',
            error: (error as Error).message
        }
    }
})
