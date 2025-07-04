// server/api/documents/index.post.ts
import pool from '../utils/db'

export default defineEventHandler(async (event) => {
   
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed'
        })
    }

    const body = await readBody(event)
    const { title, content, folder_id } = body

    

    await requireAuth(event)
    const user = event.context.user

    if (!title || !user.id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields'
        })
    }

    if (user.user_group && !['user', 'test'].includes(user.user_group)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user group'
        })
    }

    try {
        // 可选：检查同一文件夹下是否有重名文档
        const existingDoc = await pool.query(
            'SELECT id FROM documents WHERE title = $1 AND folder_id = $2',
            [title, folder_id || null]
        )

        if (existingDoc.rows.length > 0) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Document with same title already exists in this folder'
            })
        }

        const result = await pool.query(
            `INSERT INTO documents (title, content, author_id, user_group, folder_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
            [title, content || '', user.id, user.user_group, folder_id || null]
        )

        return {
            message: '文档创建成功',
            user,
            document: result.rows[0]
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
