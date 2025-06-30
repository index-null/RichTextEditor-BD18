import { Pool } from "pg";

const pool = new Pool({
  user: "postgres", // 数据库用户名
  host: "localhost", // 本地数据库服务器地址
  database: "postgres", // 数据库名称
  password: "123321", // 数据库密码
  port: 5432, // PostgreSQL 端口
});

// 导出 pool 对象以便其他模块使用
export default pool;
