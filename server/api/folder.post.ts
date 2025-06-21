import { defineEventHandler, readBody } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

interface Folder {
  id: number
  name: string
  author_id: number
  user_group: string
  parent_folder_id: number | null
  created_at: string
  updated_at: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const name = body.name?.trim()
    const parentId = parseInt(body.parentId) || null
    const userId = body.userId
    if (!name) {
      return {
        status: 400,
        message: '文件夹名称不能为空'
      }
    }
    if(!userId){
      return {
        status: 401,
        message: '用户未登录'
      }
    }
    const filePath = path.resolve(process.cwd(), 'database/mockData.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const mock_data = JSON.parse(fileContent)
    
    const newFolder: Folder = {
      id: Date.now(),
      author_id: userId,
      user_group: "admin",//TODO:模拟用户组别
      name,
      parent_folder_id: parentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    mock_data.folders.push(newFolder)
    await fs.writeFile(filePath, JSON.stringify(mock_data, null, 2), 'utf-8')

    return {
      status: 200,
      message: '文件夹创建成功',
      data: newFolder
    }
  } catch (error) {
    return {
      status: 500,
      message: '创建文件夹失败',
      error: (error as Error).message
    }
  }
})
