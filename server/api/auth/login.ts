import pool from '../../utils/db';


import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'
// 从环境变量中获取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET as string

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    return { statusCode: 400, body: { error: '用户名和密码不能为空' } }
  }

  try {
    // 查询用户
    const result = await pool.query(
      `SELECT id, username, password_hash, nickname, user_group FROM users WHERE username = $1`,
      [username]
    )

    if (result.rows.length === 0) {
      return { statusCode: 401, body: { error: '用户名不存在' } }
    }

    const user = result.rows[0]

    // 对比密码
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return { statusCode: 401, body: { error: '密码错误' } }
    }

    // 登录成功，返回用户信息（可扩展为生成 token）
    const { password_hash, ...userWithoutPassword } = user
    // 建议写到环境变量中
 
    // 签发 JWT（只选需要包含的信息）
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        user_group: user.user_group,
      },
      JWT_SECRET,
      { expiresIn: '2h' }  // 可调，例如 '1d', '12h', '2h'
    )


    return { statusCode: 200, body: { message: '登录成功', user: userWithoutPassword,token: token } }

  } catch (err) {
    console.error('登录失败：', err)
    return { statusCode: 500, body: { error: '服务器错误' } }
  }
})
