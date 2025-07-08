// server/api/documents/[id].put.ts
import pool from '../../utils/db'

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'PUT') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }

  const params = event.context.params as { id?: string };
  const id = params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing document id'
    });
  }

  const body = await readBody(event);
  const { new_content } = body;

  await requireAuth(event);
  const user = event.context.user;

  console.log(id, user.id, new_content)

  if (new_content === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing new_content'
    });
  }

  if (user.user_group && !['user', 'test'].includes(user.user_group)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user group'
    });
  }

  try {
    // 检查是否是用户自己的文档
    const docRes = await pool.query(
      'SELECT * FROM documents WHERE id = $1 AND author_id = $2',
      [id, user.id]
    );

    if (docRes.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found or no permission'
      });
    }

    // 更新内容
    const updateRes = await pool.query(
      'UPDATE documents SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [new_content, id]
    );

    return {
      message: '文档内容更新成功',
      document: updateRes.rows[0]
    };
  } catch (error) {
    console.error('更新文档内容失败:', error);

    if (isError(error)) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: error instanceof Error ? error.message : String(error)
    });
  }
});
