import pool from '../../utils/db';

import bcrypt from 'bcryptjs'


export default defineEventHandler(async (event) => {
  // 只处理POST请求
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }
 console.log("进入函数");

  // 读取请求体
  const body = await readBody(event)
  const { username, password, nickname, userGroup = 'user' } = body

  // 验证必填字段
  if (!username || !password || !nickname) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  // 验证用户组是否合法
  if (userGroup && !['user', 'test'].includes(userGroup)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user group'
    })
  }

  try {
    // 检查用户名是否已存在
    const userExists = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    )
    
    if (userExists.rows.length > 0) {
      console.log("Username already exists");
      throw createError({
        statusCode: 409,
        statusMessage: 'Username already exists'
      })
    }

    // 哈希密码
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
     console.log(`INSERT INTO users (username, password, nickname, user_group, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id, username, nickname, user_group`,
      [username, hashedPassword, nickname, userGroup]);
    // 插入新用户
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, nickname, user_group, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id, username, nickname, user_group`,
      [username, hashedPassword, nickname, userGroup]
    )
    // const result = {rows:[1]}

    // 返回新用户信息（不包含密码）
    return {
      statusCode: 201,
      data: result.rows[0]
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