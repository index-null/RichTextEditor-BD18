<template>
  <div class="document-editor">
    <div class="editor-header">
      <!-- 文档标题编辑 -->
      <div class="document-title-section">
        <AInput 
          v-model="documentTitle" 
          class="title-input"
          placeholder="无标题文档"
          :bordered="false"
          size="large"
          @blur="saveTitle"
        />
      </div>
      
      <!-- 工具栏 -->
      <div class="toolbar">
        <AButton 
          size="small" 
          :type="editor?.isActive('bold') ? 'primary' : 'secondary'"
          @click="toggleBold"
        >
          <strong>B</strong>
        </AButton>
        <AButton 
          size="small"
          :type="editor?.isActive('italic') ? 'primary' : 'secondary'" 
          @click="toggleItalic"
        >
          <em>I</em>
        </AButton>
        <ADivider direction="vertical" />
        <AButton 
          size="small"
          :type="editor?.isActive('heading', { level: 1 }) ? 'primary' : 'secondary'"
          @click="toggleHeading(1)"
        >
          H1
        </AButton>
        <AButton 
          size="small"
          :type="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'secondary'"
          @click="toggleHeading(2)"
        >
          H2
        </AButton>
        <ADivider direction="vertical" />
        <AButton 
          size="small"
          :type="editor?.isActive('bulletList') ? 'primary' : 'secondary'"
          @click="toggleBulletList"
        >
          列表
        </AButton>
        <AButton 
          size="small"
          :type="editor?.isActive('codeBlock') ? 'primary' : 'secondary'"
          @click="toggleCodeBlock"
        >
          代码
        </AButton>
      </div>
      
      <!-- 协作用户状态 -->
      <div class="collaboration-status">
        <ATooltip content="在线用户">
          <div class="online-users">
            <AAvatar 
              v-for="user in onlineUsers" 
              :key="user.id"
              :size="28"
              :style="{ backgroundColor: user.color }"
            >
              {{ user.name[0] }}
            </AAvatar>
          </div>
        </ATooltip>
      </div>
    </div>
    
    <!-- 编辑器主体 -->
    <div class="editor-container">
      <div class="editor-wrapper">
        <EditorContent 
          :editor="editor" 
          class="editor-content"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

// 获取路由参数
const route = useRoute()
const documentId = route.params.id as string

// 页面标题
useHead({
  title: `文档编辑 - 协同文档编辑器`
})

// 响应式数据
const documentTitle = ref('无标题文档')
const editor = shallowRef<Editor | undefined>(undefined)

// 模拟在线用户数据
const onlineUsers = ref([
  { id: '1', name: '张三', color: '#165dff' },
  { id: '2', name: '李四', color: '#00b42a' },
  { id: '3', name: '王五', color: '#ff7d00' }
])

// 初始化编辑器
onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit],
    content: `
      <h1>欢迎使用协同文档编辑器</h1>
      <p>这是一个基于 Tiptap 的富文本编辑器，支持多人协同编辑。</p>
      <h2>功能特性</h2>
      <ul>
        <li>富文本编辑</li>
        <li>实时协同</li>
        <li>版本历史</li>
      </ul>
      <p>开始编辑您的文档吧！</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      // TODO: 实现自动保存逻辑
      console.log('文档内容已更新')
    }
  })
})

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

// 编辑器操作方法
const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run()
}

const toggleItalic = () => {
  editor.value?.chain().focus().toggleItalic().run()
}

const toggleHeading = (level: 1 | 2) => {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

const toggleBulletList = () => {
  editor.value?.chain().focus().toggleBulletList().run()
}

const toggleCodeBlock = () => {
  editor.value?.chain().focus().toggleCodeBlock().run()
}

const saveTitle = () => {
  // TODO: 实现标题保存逻辑
  console.log('保存标题:', documentTitle.value)
}

// 模拟加载文档数据
const loadDocument = async () => {
  // TODO: 从API加载文档数据
  if (documentId === 'new') {
    documentTitle.value = '新建文档'
  } else {
    // 模拟从API获取文档
    documentTitle.value = `文档 ${documentId}`
  }
}

// 页面初始化
onMounted(() => {
  loadDocument()
})
</script>

<style scoped>
.document-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.editor-header {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #e5e6eb;
  background: #fff;
  gap: 16px;
}

.document-title-section {
  flex: 1;
}

.title-input {
  font-size: 20px;
  font-weight: 600;
}

.title-input :deep(.arco-input) {
  font-size: 20px;
  font-weight: 600;
  border: none;
  box-shadow: none;
}

.title-input :deep(.arco-input:focus) {
  border: 1px solid #165dff;
  box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.1);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.collaboration-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.online-users {
  display: flex;
  gap: 4px;
}

.editor-container {
  flex: 1;
  overflow: auto;
  background: #fff;
}

.editor-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.editor-content {
  min-height: 500px;
}

/* Tiptap 编辑器样式 */
.editor-content :deep(.ProseMirror) {
  outline: none;
  font-size: 16px;
  line-height: 1.6;
  color: #1d2129;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 1em 0 0.5em 0;
  line-height: 1.2;
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 1em 0 0.5em 0;
  line-height: 1.3;
}

.editor-content :deep(.ProseMirror p) {
  margin: 0.5em 0;
}

.editor-content :deep(.ProseMirror ul) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.editor-content :deep(.ProseMirror pre) {
  background: #f7f8fa;
  border-radius: 4px;
  padding: 12px;
  margin: 1em 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  overflow-x: auto;
}

.editor-content :deep(.ProseMirror code) {
  background: #f7f8fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}
</style> 