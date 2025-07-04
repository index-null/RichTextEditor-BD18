// server/api/folders/[id].delete.ts
import pool from '../../utils/db';

export default defineEventHandler(async (event) => {
  // 只处理 DELETE 请求
  if (event.req.method !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }

  // 获取路径参数 id
  const params = event.context.params as { id?: string };
  const id = params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing folder id'
    });
  }

  // 权限认证
  await requireAuth(event);
  const user = event.context.user;

  if (user.user_group && !['user', 'test'].includes(user.user_group)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user group'
    });
  }

  try {
    // 检查文件夹是否存在并属于该用户
    const folderRes = await pool.query(
      'SELECT * FROM folders WHERE id = $1 AND author_id = $2',
      [id, user.id]
    );

    if (folderRes.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Folder not found or no permission'
      });
    }

    // 删除文件夹
    await pool.query(
      'DELETE FROM folders WHERE id = $1 AND author_id = $2',
      [id, user.id]
    );

    return {
      message: '文件夹删除成功',
      folder_id: id
    };
  } catch (error: any) {
    console.error('删除文件夹失败:', error);

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
