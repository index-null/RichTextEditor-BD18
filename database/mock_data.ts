
// 用户组类型
type UserGroup = 'admin' | 'editor' | 'viewer';

// 用户接口
interface User {
  id: number;
  username: string;
  password_hash: string;
  nickname: string;
  user_group: UserGroup;
  created_at: string;
  updated_at: string;
}

// 文档接口
interface Document_db {
  id: number;
  title: string;
  content: string;
  author_id: number;
  user_group: UserGroup;
  folder_id: number | null;
  created_at: string;
  updated_at: string;
}

// 文件夹接口
interface Folder_db {
  id: number;
  name: string;
  author_id: number;
  user_group: UserGroup;
  parent_folder_id: number | null;
  created_at: string;
  updated_at: string;
}

// 生成随机日期函数（使用原生 Date）
const randomDate = (start: Date, end: Date): string => {
    const date = new Date (start.getTime () + Math.random () * (end.getTime () - start.getTime ()));
    
    // 格式化日期为 yyyy-MM-dd HH:mm:ss 格式
    const year = date.getFullYear ();
    const month = String (date.getMonth () + 1).padStart (2, '0');
    const day = String (date.getDate ()).padStart (2, '0');
    const hours = String (date.getHours ()).padStart (2, '0');
    const minutes = String (date.getMinutes ()).padStart (2, '0');
    const seconds = String (date.getSeconds ()).padStart (2, '0');
    

return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    
    // 模拟用户数据
    const users: User [] = [
    {
    id: 1,
    username: 'admin',
    password_hash: '$2b10Jf1X4y8T7bWp4k1y6Wv8h.q4v1t8h6v8t9Wv8h.q4v1t8h6v8t9',
    nickname: '管理员',
    user_group: 'admin',
    created_at: randomDate(new Date(2023, 0, 1), new Date(2023, 5, 1)),
    updated_at: randomDate(new Date(2023, 5, 1), new Date()),
    },
    {
    id: 2,
    username: 'editor1',
    password_hash: '$2b10Jf1X4y8T7bWp4k1y6Wv8h.q4v1t8h6v8t9Wv8h.q4v1t8h6v8t9',
    nickname: ' 编辑 1',
    user_group: 'editor',
    created_at: randomDate (new Date (2023, 1, 1), new Date (2023, 6, 1)),
    updated_at: randomDate (new Date (2023, 6, 1), new Date ()),
    },
    {
    id: 3,
    username: 'viewer1',
    password_hash: '$2b10Jf1X4y8T7bWp4k1y6Wv8h.q4v1t8h6v8t9Wv8h.q4v1t8h6v8t9',
    nickname: '查看者1',
    user_group: 'viewer',
    created_at: randomDate(new Date(2023, 2, 1), new Date(2023, 7, 1)),
    updated_at: randomDate(new Date(2023, 7, 1), new Date()),
    },
    {
    id: 4,
    username: 'editor2',
    password_hash: '$210Jf1X4y8T7bWp4k1y6Wv8h.q4v1t8h6v8t9Wv8h.q4v1t8h6v8t9',
    nickname: ' 编辑 2',
    user_group: 'editor',
    created_at: randomDate (new Date (2023, 3, 1), new Date (2023, 8, 1)),
    updated_at: randomDate (new Date (2023, 8, 1), new Date ()),
    },
    {
    id: 5,
    username: 'viewer2',
    password_hash: '$2b$10$Jf1X4y8T7bWp4k1y6Wv8h.q4v1t8h6v8t9Wv8h.q4v1t8h6v8t9',
    nickname: ' 查看者 2',
    user_group: 'viewer',
    created_at: randomDate (new Date (2023, 4, 1), new Date (2023, 9, 1)),
    updated_at: randomDate (new Date (2023, 9, 1), new Date ()),
    },
    ];
    
    // 模拟文件夹数据
    const folders: Folder_db [] = [
    {
    id: 1,
    name: ' 项目文档 ',
    author_id: 1,
    user_group: 'admin',
    parent_folder_id: null,
    created_at: randomDate (new Date (2023, 0, 1), new Date (2023, 3, 1)),
    updated_at: randomDate (new Date (2023, 3, 1), new Date ()),
    },
    {
    id: 2,
    name: ' 技术文档 ',
    author_id: 1,
    user_group: 'admin',
    parent_folder_id: null,
    created_at: randomDate (new Date (2023, 1, 1), new Date (2023, 4, 1)),
    updated_at: randomDate (new Date (2023, 4, 1), new Date ()),
    },
    {
    id: 3,
    name: ' 产品文档 ',
    author_id: 2,
    user_group: 'editor',
    parent_folder_id: null,
    created_at: randomDate (new Date (2023, 2, 1), new Date (2023, 5, 1)),
    updated_at: randomDate (new Date (2023, 5, 1), new Date ()),
    },
    {
    id: 4,
    name: ' 需求分析 ',
    author_id: 2,
    user_group: 'editor',
    parent_folder_id: 3,
    created_at: randomDate (new Date (2023, 3, 1), new Date (2023, 6, 1)),
    updated_at: randomDate (new Date (2023, 6, 1), new Date ()),
    },
    {
    id: 5,
    name: ' 设计文档 ',
    author_id: 2,
    user_group: 'editor',
    parent_folder_id: 3,
    created_at: randomDate (new Date (2023, 4, 1), new Date (2023, 7, 1)),
    updated_at: randomDate (new Date (2023, 7, 1), new Date ()),
    },
    {
    id: 6,
    name: ' 开发文档 ',
    author_id: 1,
    user_group: 'admin',
    parent_folder_id: 2,
    created_at: randomDate (new Date (2023, 5, 1), new Date (2023, 8, 1)),
    updated_at: randomDate (new Date (2023, 8, 1), new Date ()),
    },
    {
    id: 7,
    name: ' 测试文档 ',
    author_id: 4,
    user_group: 'editor',
    parent_folder_id: 2,
    created_at: randomDate (new Date (2023, 6, 1), new Date (2023, 9, 1)),
    updated_at: randomDate (new Date (2023, 9, 1), new Date ()),
    },
    ];
    
    // 模拟文档数据
    const documents: Document_db [] = [
    {
    id: 1,
    title: ' 项目启动文档 ',
    content: '# 项目启动文档 \n\n## 项目概述 \n 本项目旨在开发一个企业级文档管理系统，提供文档的创建、编辑、分享和协作功能。\n\n## 项目目标 \n1. 提高团队协作效率 \n2. 简化文档管理流程 \n3. 增强文档安全性 \n\n## 项目计划 \n 项目将分为三个阶段进行：需求分析、设计开发和测试上线。',
    author_id: 1,
    user_group: 'admin',
    folder_id: 1,
    created_at: randomDate (new Date (2023, 0, 1), new Date (2023, 2, 1)),
    updated_at: randomDate (new Date (2023, 2, 1), new Date ()),
    },
    {
    id: 2,
    title: ' 技术架构设计 ',
    content: '# 技术架构设计 \n\n## 系统架构 \n 采用前后端分离的微服务架构，前端使用 Vue.js 框架，后端使用 Node.js 和 Express 框架。\n\n## 数据存储 \n 使用 PostgreSQL 作为主要数据库，MongoDB 作为辅助数据库，Redis 作为缓存。\n\n## API 设计 \n 采用 RESTful API 设计风格，使用 JSON 作为数据交换格式。',
    author_id: 1,
    user_group: 'admin',
    folder_id: 6,
    created_at: randomDate (new Date (2023, 1, 1), new Date (2023, 3, 1)),
    updated_at: randomDate (new Date (2023, 3, 1), new Date ()),
    },
    {
    id: 3,
    title: ' 用户需求说明书 ',
    content: '# 用户需求说明书 \n\n## 引言 \n 本需求说明书描述了企业文档管理系统的功能需求和非功能需求。\n\n## 功能需求 \n1. 用户管理：用户注册、登录、权限管理 \n2. 文档管理：创建、编辑、删除、分享文档 \n3. 文件夹管理：创建、删除、重命名文件夹 \n4. 搜索功能：全文搜索、高级搜索 \n\n## 非功能需求 \n1. 性能需求：系统响应时间不超过 3 秒 \n2. 安全需求：数据加密传输、用户认证授权 \n3. 可用性需求：系统可用性不低于 99.9%',
    author_id: 2,
    user_group: 'editor',
    folder_id: 4,
    created_at: randomDate (new Date (2023, 2, 1), new Date (2023, 4, 1)),
    updated_at: randomDate (new Date (2023, 4, 1), new Date ()),
    },
    {
    id: 4,
    title: 'UI 设计规范 ',
    content: '# UI 设计规范 \n\n## 颜色系统 \n 主色调：#1677FF\n 辅助色：#00B42A, #FF7D00, #F53F3F\n 中性色：#FFFFFF, #F2F3F5, #C9CDD4, #86909C, #4E5969, #1D2129\n\n## 字体系统 \n 标题：PingFang SC, 18px, 24px, 30px\n 正文：PingFang SC, 14px\n 辅助文字：PingFang SC, 12px\n\n## 组件设计 \n 按钮、输入框、下拉菜单、表格、卡片等组件的设计规范和交互效果。',
    author_id: 4,
    user_group: 'editor',
    folder_id: 5,
    created_at: randomDate (new Date (2023, 3, 1), new Date (2023, 5, 1)),
    updated_at: randomDate (new Date (2023, 5, 1), new Date ()),
    },
    {
    id: 5,
    title: ' 测试计划 ',
    content: '# 测试计划 \n\n## 测试目标 \n 验证系统功能的正确性和完整性，发现并解决潜在的问题。\n\n## 测试范围 \n1. 用户管理功能测试 \n2. 文档管理功能测试 \n3. 搜索功能测试 \n4. 系统性能测试 \n\n## 测试方法 \n1. 功能测试：黑盒测试 \n2. 性能测试：负载测试、压力测试 \n3. 安全测试：漏洞扫描、渗透测试 \n\n## 测试进度 \n 测试将分为三个阶段进行，每个阶段持续两周时间。',
    author_id: 4,
    user_group: 'editor',
    folder_id: 7,
    created_at: randomDate (new Date (2023, 4, 1), new Date (2023, 6, 1)),
    updated_at: randomDate (new Date (2023, 6, 1), new Date ()),
    },
    {
    id: 6,
    title: ' 部署文档 ',
    content: '# 部署文档 \n\n## 环境要求 \n1. 服务器：Linux (CentOS 7+), 8GB RAM, 100GB SSD\n2. 数据库：PostgreSQL 12+\n3. 缓存：Redis 6+\n\n## 部署步骤 \n1. 安装 Node.js 和 npm\n2. 安装依赖包 \n3. 配置环境变量 \n4. 构建项目 \n5. 启动服务 \n\n## 配置文件 \n 配置数据库连接、缓存服务器、API 密钥等信息。',
    author_id: 1,
    user_group: 'admin',
    folder_id: 6,
    created_at: randomDate (new Date (2023, 5, 1), new Date (2023, 7, 1)),
    updated_at: randomDate (new Date (2023, 7, 1), new Date ()),
    },
    {
    id: 7,
    title: ' 使用手册 ',
    content: '# 使用手册 \n\n## 注册与登录 \n1. 访问系统网站 \n2. 点击 "注册" 按钮 \n3. 填写注册信息 \n4. 验证邮箱 \n5. 使用用户名和密码登录系统 \n\n## 文档管理 \n1. 创建文档：点击 "新建文档" 按钮 \n2. 编辑文档：点击文档标题或 "编辑" 按钮 \n3. 分享文档：点击 "分享" 按钮，设置分享权限 \n4. 删除文档：点击 "删除" 按钮 \n\n## 搜索功能 \n1. 在搜索框中输入关键词 \n2. 选择搜索范围 \n3. 查看搜索结果 \n4. 使用高级搜索功能进行精确查找 ',
    author_id: 3,
    user_group: 'viewer',
    folder_id: 1,
    created_at: randomDate (new Date (2023, 6, 1), new Date (2023, 8, 1)),
    updated_at: randomDate (new Date (2023, 8, 1), new Date ()),
    },
    ];
    
    // 导出模拟数据
    export default {
    users,
    documents,
    folders,
    };