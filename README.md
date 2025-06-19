# 🚀 协同文档编辑器

## 项目介绍

基于 Nuxt 3 + Vue 3 + TypeScript 的多人实时协同富文本编辑系统，使用 Acro Design 组件库和 Tiptap 编辑器。

## 🛠️ 技术栈

- **前端框架**: Nuxt 3 + Vue 3 + TypeScript  
- **UI组件库**: Acro Design Vue
- **富文本编辑器**: Tiptap
- **协同编辑**: Yjs + WebSocket
- **状态管理**: Pinia
- **工具库**: VueUse

## 📦 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

项目将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
collaborative-editor/
├── components/          # Vue组件
├── composables/         # 组合式函数
├── layouts/            # 布局组件
├── pages/              # 页面路由
│   ├── index.vue       # 首页
│   └── document/       # 文档编辑页面
│       └── [id].vue    
├── plugins/            # 插件
├── server/             # 服务端API
├── stores/             # Pinia状态管理
├── nuxt.config.ts      # Nuxt配置
└── README.md
```

## 🚀 功能特性

### 已实现功能

- ✅ 现代化的首页布局（使用Acro Design）
- ✅ 文档管理（创建、删除、重命名）
- ✅ 富文本编辑器（基于Tiptap）
  - 文本格式化（加粗、斜体）
  - 标题（H1、H2）
  - 列表功能
  - 代码块
- ✅ 基础状态管理（Pinia）
- ✅ 响应式设计

### 开发计划

- 🔄 实时协同编辑（Yjs集成）
- 🔄 WebSocket服务
- 🔄 用户系统（登录/注册）
- 🔄 文档历史版本
- 🔄 权限控制

## 🎯 开发规范

### Git工作流

1. 从main分支拉取最新代码
2. 创建特性分支：`git checkout -b feature/your-feature-name`
3. 开发完成后提交代码，commit信息请遵循规范
4. 推送分支并创建Pull Request
5. 代码Review通过后合并到main分支

### Commit规范

使用约定式提交规范：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式化
refactor: 重构
test: 测试相关
chore: 构建或辅助工具变动
```

示例：
```bash
git commit -m "feat: 添加富文本编辑器基础功能"
git commit -m "fix: 修复文档列表显示问题"
```

### 代码规范

- 使用 TypeScript 编写代码
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case
- 使用 ESLint 和 Prettier 进行代码格式化

## 🔧 开发工具推荐

### IDE配置

推荐使用 **Cursor** 或 **VSCode** 配合以下扩展：

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar) 
- Auto Rename Tag
- GitLens
- Prettier

### AI辅助开发

- 使用 Cursor 的 AI 功能快速了解项目结构
- 利用 AI 辅助生成符合规范的 commit 消息
- 遇到问题时使用 AI 进行调试和解决方案建议

## 🐛 问题解决

### 常见问题

1. **依赖安装失败**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript类型错误**
   - 检查 `nuxt.config.ts` 中的TypeScript配置
   - 确保安装了相关的类型定义包

3. **Acro Design样式问题**
   - 确保在 `nuxt.config.ts` 中正确引入了CSS文件
   - 检查插件配置是否正确

4. **开发服务器启动失败**
   - 检查端口是否被占用
   - 确保Node.js版本符合要求

### 获取帮助

- 📖 查看 [Nuxt 3 文档](https://nuxt.com/)
- 📖 查看 [Acro Design 文档](https://arco.design/vue/docs/start)
- 📖 查看 [Tiptap 文档](https://tiptap.dev/)
- 💬 项目群内技术讨论
- 🐛 GitHub Issues

## 👥 团队协作

### 分工说明

- **郭昌华**: 项目架构、技术难点攻坚
- **成员二**: 富文本编辑器开发
- **成员三**: 后端API和WebSocket开发
- **成员四**: 前端页面和组件开发
- **成员五**: 测试和联调

### 沟通方式

- **每日站会**: 晚上9:30飞书群内同步进度
- **代码Review**: 提交PR后@郭昌华，附上自测截图
- **技术讨论**: 及时在群内讨论，必要时拉会议

## 📝 更新日志

### v0.1.0 (2024-01-XX)

- ✨ 项目初始化
- ✨ 基础页面结构搭建
- ✨ Acro Design集成
- ✨ 富文本编辑器基础功能
- ✨ 文档状态管理

---

**开发团队**: 字节跳动训练营第18组  
**开始时间**: 2025年6月18日  
**项目周期**: 15天
