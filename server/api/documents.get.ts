import pool from '../utils/db'

export default defineEventHandler(async (event) => {
  // 只处理 GET 请求
  if (event.req.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }

  // 权限认证
  await requireAuth(event);
  const user = event.context.user;

  if (!user || !user.user_group) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing user group'
    });
  }

  if (!['user', 'test'].includes(user.user_group)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user group'
    });
  }

  try {
    // 获取该用户组下的文件夹
    const folderRes = await pool.query(
      'SELECT * FROM folders WHERE user_group = $1 ORDER BY created_at DESC',
      [user.user_group]
    );

    // 获取该用户组下的文档
    const docRes = await pool.query(
      'SELECT * FROM documents WHERE user_group = $1 ORDER BY created_at DESC',
      [user.user_group]
    );

    return {
      message: '获取成功',
      user_group: user.user_group,
      folders: folderRes.rows,
      documents: docRes.rows
    };
  } catch (error: any) {
    console.error('获取数据失败:', error);

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
