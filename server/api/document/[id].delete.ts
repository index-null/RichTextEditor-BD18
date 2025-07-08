// server/api/document/[id].delete.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import pool from '@/server/utils/db' 

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    return {
      status: 400,
      message: '文档 ID 无效'
    }
  }
  const user = event.context.user;
  try {
    // 检查文档是否存在并属于该用户
    const docRes = await pool.query(
      'SELECT * FROM documents WHERE id = $1 AND author_id = $2',
      [id, Number(user.id)]
    );

    if (docRes.rows.length === 0) {
      return{
        status: 404,
        message: '文档未找到或无权限访问'
      };
    }

    await pool.query('DELETE FROM documents WHERE id = $1 RETURNING *', [Number(id)])


    return {
      status: 200,
      message: '文档删除成功',
    }
  } catch  {

    return {
      status: 500,
      message: '删除文档时出错'
    }
  }
})
