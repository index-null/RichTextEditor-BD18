import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',        // 默认用户名，除非你改过
  host: 'localhost',       // 如果是本地连接
  database: 'mydb',    // 如图所示数据库名称
  password: '129769',      // 你提供的密码
  port: 5432,              // 默认 PostgreSQL 端口
});

// 导出 pool 对象以便其他模块使用
export default pool;