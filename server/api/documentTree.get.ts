import { defineEventHandler, getQuery } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

const mockDataPath = path.resolve(process.cwd(), 'database/mockData.json')
export interface BaseDbModel {
    id: number;
    created_at: string;
    updated_at: string;
    user_group: string;
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
interface ApiNode {
    id: string
    title: string
    type: 'folder' | 'document'
  }
  
  interface ApiFolder extends ApiNode {
    type: 'folder'
    children: (ApiFolder | ApiDocument)[]
  }
  
  interface ApiDocument extends ApiNode {
    type: 'document'
    content: string
    author: string
    createdAt: string
    updatedAt: string
    size: string
  }

  
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId as string || '1'
    const userIdNum = parseInt(userId, 10)

    const jsonStr = await fs.readFile(mockDataPath, 'utf-8')
    const mock_data = JSON.parse(jsonStr)

    const { users, documents, folders } = mock_data
    const currentUser = users.find((u: any) => u.id === userIdNum)
    if (!currentUser) {
      throw new Error('用户不存在')
    }

    const group = currentUser.user_group
    const filteredDocuments = documents.filter((doc: any) => doc.user_group === group)
    const filteredFolders = folders.filter((folder: any) => folder.user_group === group)

    const convertToDocumentTree = (
      folders: any[],
      documents: any[],
      users: any[]
    ) => {
      const userMap = new Map(users.map(user => [user.id, user.nickname]))

      const buildFolder = (folder: Folder_db): ApiFolder => {
        // 给 children 明确类型
        const children: (ApiFolder | ApiDocument)[] = [
          ...documents
            .filter(doc => doc.folder_id === folder.id)
            .map(doc => {
              const author = userMap.get(doc.author_id) || '未知作者'
              const apiDoc: ApiDocument = {
                id: doc.id.toString(),
                title: doc.title,
                type: 'document',
                content: doc.content,
                author,
                createdAt: doc.created_at,
                updatedAt: doc.updated_at,
                size: doc.size || '0KB',
              }
              return apiDoc
            }),
          ...folders
            .filter(f => f.parent_folder_id === folder.id)
            .map(buildFolder),
        ]
      
        children.sort((a, b) => a.title.localeCompare(b.title))
      
        return {
          id: folder.id.toString(),
          title: folder.name,
          type: 'folder',
          children,
        }
      }

      const rootFolders = folders.filter(folder => folder.parent_folder_id === null)
      return rootFolders.map(buildFolder)
    }

    const documentTree = convertToDocumentTree(filteredFolders, filteredDocuments, users)

    return {
      status: 200,
      message: '获取文档树成功',
      data: documentTree
    }
  } catch (error) {
    return {
      status: 500,
      message: '获取文档树失败',
      error: (error as Error).message
    }
  }
})
