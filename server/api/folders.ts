// server/api/folders/index.post.ts
import pool from '../utils/db';


export default defineEventHandler(async (event) => {

    // 只处理POST请求
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        })
    }

    const body = await readBody(event)
    const { name, parent_folder_id } = body

    await requireAuth(event)  // ⬅️ Token获得当前User
    const user = event.context.user

    // 验证必填字段
    if (!name || !user.id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields'
        })
    }

    // 验证用户组是否合法
    if (user.user_group && !['user', 'test'].includes(user.user_group)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user group'
        })
    }

    try {
        // 检查用户名是否已存在
        const userExists = await pool.query(
            'SELECT id FROM folders WHERE name = $1',
            [name]
        )

        if (userExists.rows.length > 0) {
            console.log("Folders already exists");
            throw createError({
                statusCode: 409,
                statusMessage: 'Username already exists'
            })
        }

        const result = await pool.query(
            `INSERT INTO folders (name, author_id, user_group, parent_folder_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
            [name, user.id, user.user_group, parent_folder_id || null]
        )

        return {
            message: '创建成功', user, Folder: result.rows[0]
        }
    } catch (error) {
        if (isError(error)) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            data: error instanceof Error ? error.message : String(error)
        })
    }

})
