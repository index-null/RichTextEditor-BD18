// server/api/documents/[id].delete.ts
import pool from '../../utils/db'

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'DELETE') {
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

  await requireAuth(event);
  const user = event.context.user;

  if (user.user_group && !['user', 'test'].includes(user.user_group)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user group'
    });
  }

  try {
    // 检查文档是否存在并属于该用户
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

    // 删除文档
    await pool.query(
      'DELETE FROM documents WHERE id = $1 AND author_id = $2',
      [id, user.id]
    );

    return {
      message: '文档删除成功',
      document_id: id
    };
  } catch (error: any) {
    console.error('删除文档失败:', error);

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
