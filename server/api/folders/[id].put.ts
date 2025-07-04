// server/api/folders/[id].post.ts
import pool from '../../utils/db';


export default defineEventHandler(async (event) => {
  if (event.req.method !== 'PUT') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }

  // 取路径参数id
  const params = event.context.params as { id?: string } | undefined;
  const id = params?.id;

  console.log('请求参数:', { id});
console.log('当前用户:', params);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing folder id'
    });
  }

  // 读取请求体
  const body = await readBody(event);
  const { new_name } = body;

  await requireAuth(event);
  const user = event.context.user;

  if (!new_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing new_name or user id'
    });
  }

  if (user.user_group && !['user', 'test'].includes(user.user_group)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user group'
    });
  }

  try {
    // 检查文件夹是否属于当前用户
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

    // 检查新名字是否冲突
    const nameCheck = await pool.query(
      'SELECT id FROM folders WHERE name = $1 AND author_id = $2 AND id != $3',
      [new_name, user.id, id]
    );
    if (nameCheck.rows.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Folder name already exists'
      });
    }

    // 更新名称
    const updateRes = await pool.query(
      'UPDATE folders SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [new_name, id]
    );

    return {
      message: '重命名成功',
      folder: updateRes.rows[0]
    };
  } catch (error) {
    console.error('更新文件夹名称失败:', error);

 if (isError(error)) {
    throw error
  }

  // ✅ 否则是未知错误，才包成 500
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    data: error instanceof Error ? error.message : String(error)
  });
  }
});
