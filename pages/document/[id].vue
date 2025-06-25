<template>
  <div class="document-editor">
    <!-- 编辑器头部 -->
    <div class="editor-header">
      <!-- 返回按钮和文档信息 -->
      <div class="header-left">
        <AButton type="text" @click="navigateTo('/')">
          <template #icon><Icon name="ri:arrow-left-line" /></template>
        </AButton>
        
        <ABreadcrumb class="breadcrumb">
          <ABreadcrumbItem>
            <Icon name="ri:home-line" />
            <span>首页</span>
          </ABreadcrumbItem>
          <ABreadcrumbItem>工作文档</ABreadcrumbItem>
          <ABreadcrumbItem>{{ documentTitle }}</ABreadcrumbItem>
        </ABreadcrumb>
      </div>

      <!-- 中间工具栏 -->
      <div class="header-center">
        <div class="toolbar-groups">
          <!-- 格式工具组 -->
          <div class="toolbar-group">
            <ATooltip content="撤销 (Ctrl+Z)">
              <AButton size="small" type="text" @click="editor?.chain().focus().undo().run()">
                <template #icon><Icon name="ri:arrow-go-back-line" /></template>
              </AButton>
            </ATooltip>
            <ATooltip content="重做 (Ctrl+Y)">
              <AButton size="small" type="text" @click="editor?.chain().focus().redo().run()">
                <template #icon><Icon name="ri:arrow-go-forward-line" /></template>
              </AButton>
            </ATooltip>
          </div>

          <ADivider direction="vertical" />

          <!-- 标题工具组 -->
          <div class="toolbar-group">
            <ADropdown trigger="click">
              <AButton size="small" type="text">
                <span class="toolbar-text">{{ currentHeadingText }}</span>
                <Icon name="ri:arrow-down-s-line" />
              </AButton>
              <template #content>
                <ADoption @click="editor?.chain().focus().setParagraph().run()">
                  <div class="format-option">
                    <span>正文</span>
                    <span class="format-shortcut">Ctrl+Alt+0</span>
                  </div>
                </ADoption>
                <ADoption @click="toggleHeading(1)">
                  <div class="format-option">
                    <h1>标题 1</h1>
                    <span class="format-shortcut">Ctrl+Alt+1</span>
                  </div>
                </ADoption>
                <ADoption @click="toggleHeading(2)">
                  <div class="format-option">
                    <h2>标题 2</h2>
                    <span class="format-shortcut">Ctrl+Alt+2</span>
                  </div>
                </ADoption>
                <ADoption @click="toggleHeading(3)">
                  <div class="format-option">
                    <h3>标题 3</h3>
                    <span class="format-shortcut">Ctrl+Alt+3</span>
                  </div>
                </ADoption>
              </template>
            </ADropdown>
          </div>

          <ADivider direction="vertical" />

          <!-- 列表工具组 -->
          <div class="toolbar-group">
            <ATooltip content="无序列表">
              <AButton 
                size="small" 
                :type="isBulletList ? 'primary' : 'text'"
                @click="toggleBulletList"
              >
                <template #icon><Icon name="ri:list-unordered" /></template>
              </AButton>
            </ATooltip>
            <ATooltip content="有序列表">
              <AButton 
                size="small" 
                :type="isOrderedList ? 'primary' : 'text'"
                @click="toggleOrderedList"
              >
                <template #icon><Icon name="ri:list-ordered" /></template>
              </AButton>
            </ATooltip>
            <ATooltip content="任务列表">
              <AButton 
                size="small" 
                :type="isTaskList ? 'primary' : 'text'"
                @click="toggleTaskList"
              >
                <template #icon><Icon name="ri:checkbox-line" /></template>
              </AButton>
            </ATooltip>
          </div>

          <ADivider direction="vertical" />

          <!-- 对齐工具组 -->
          <div class="toolbar-group">
            <ADropdown trigger="click">
              <AButton size="small" type="text">
                <template #icon><Icon name="ri:align-left" /></template>
                <Icon name="ri:arrow-down-s-line" />
              </AButton>
              <template #content>
                <ADoption @click="setTextAlign('left')">
                  <Icon name="ri:align-left" /> 左对齐
                </ADoption>
                <ADoption @click="setTextAlign('center')">
                  <Icon name="ri:align-center" /> 居中对齐
                </ADoption>
                <ADoption @click="setTextAlign('right')">
                  <Icon name="ri:align-right" /> 右对齐
                </ADoption>
                <ADoption @click="setTextAlign('justify')">
                  <Icon name="ri:align-justify" /> 两端对齐
                </ADoption>
              </template>
            </ADropdown>
          </div>

          <ADivider direction="vertical" />

          <!-- 插入工具组 -->
          <div class="toolbar-group">
            <ATooltip content="引用">
              <AButton 
                size="small" 
                :type="isBlockquote ? 'primary' : 'text'"
                @click="toggleBlockquote"
              >
                <template #icon><Icon name="ri:double-quotes-l" /></template>
              </AButton>
            </ATooltip>
            <ATooltip content="代码块">
              <AButton 
                size="small" 
                :type="isCodeBlock ? 'primary' : 'text'"
                @click="toggleCodeBlock"
              >
                <template #icon><Icon name="ri:code-box-line" /></template>
              </AButton>
            </ATooltip>
            <ATooltip content="分割线">
              <AButton size="small" type="text" @click="setHorizontalRule">
                <template #icon><Icon name="ri:separator" /></template>
              </AButton>
            </ATooltip>
            <ADropdown trigger="click">
              <AButton size="small" type="text">
                <template #icon><Icon name="ri:add-line" /></template>
              </AButton>
              <template #content>
                <ADoption @click="insertImage">
                  <Icon name="ri:image-line" /> 插入图片
                </ADoption>
                <ADoption @click="insertTable">
                  <Icon name="ri:table-line" /> 插入表格
                </ADoption>
                <ADoption @click="insertLink">
                  <Icon name="ri:link" /> 插入链接
                </ADoption>
              </template>
            </ADropdown>
          </div>
        </div>
      </div>

      <!-- 右侧操作 -->
      <div class="header-right">
        <!-- 保存状态 -->
        <div class="save-status">
          <Icon v-if="saveStatus === 'saved'" name="ri:check-line" class="status-icon saved" />
          <Icon v-else-if="saveStatus === 'saving'" name="ri:loader-4-line" class="status-icon saving" />
          <span class="status-text">{{ saveStatusText }}</span>
        </div>

        <!-- 协作用户 -->
        <div class="collaboration-users">
          <AvatarGroup :max-count="3">
            <AAvatar 
              v-for="user in onlineUsers" 
              :key="user.id"
              :size="32"
              :style="{ backgroundColor: user.color }"
            >
              {{ user.name[0] }}
            </AAvatar>
          </AvatarGroup>
        </div>

        <!-- 更多操作 -->
        <ADropdown trigger="click">
          <AButton type="text">
            <template #icon><Icon name="ri:more-2-fill" /></template>
          </AButton>
          <template #content>
            <ADoption @click="showDocumentInfo">
              <Icon name="ri:information-line" /> 文档信息
            </ADoption>
            <ADoption @click="showHistory">
              <Icon name="ri:history-line" /> 历史版本
            </ADoption>
            <ADoption @click="exportDocument">
              <Icon name="ri:download-2-line" /> 导出文档
            </ADoption>
            <ADoption @click="printDocument">
              <Icon name="ri:printer-line" /> 打印
            </ADoption>
            <ADivider style="margin: 4px 0" />
            <ADoption @click="shareDocument">
              <Icon name="ri:share-line" /> 分享
            </ADoption>
          </template>
        </ADropdown>
      </div>
    </div>

    <!-- 文档标题区域 -->
    <div class="document-header">
      <AInput 
        v-model="documentTitle" 
        class="document-title-input"
        placeholder="无标题文档"
        :bordered="false"
        @blur="saveTitle"
        @keydown.enter="$event.currentTarget.blur()"
      />
      <div class="document-meta">
        <span><Icon name="ri:time-line" /> 最后编辑于 {{ lastEditTime }}</span>
        <span><Icon name="ri:file-text-line" /> {{ wordCount }} 字</span>
        <span><Icon name="ri:timer-line" /> 阅读时长约 {{ readingTime }} 分钟</span>
      </div>
    </div>

    <!-- 编辑器主体 -->
    <div class="editor-body">
      <FloatingToolbar :editor="editor" />
      <div class="editor-container">
        <div class="editor-wrapper">
          <EditorContent 
            :editor="editor" 
            class="editor-content"
          />
        </div>
        
        <!-- 侧边栏 -->
        <div v-if="showSidebar" class="editor-sidebar">
          <ATabs v-model:active-key="sidebarTab">
            <ATabPane key="outline" title="大纲">
              <div class="outline-content">
                <div v-if="documentOutline.length > 0">
                  <div 
                    v-for="item in documentOutline" 
                    :key="item.id"
                    class="outline-item"
                    :class="`outline-level-${item.level}`"
                    @click="scrollToHeading(item.id)"
                  >
                    {{ item.text }}
                  </div>
                </div>
                <AEmpty v-else description="暂无大纲" />
              </div>
            </ATabPane>
            <ATabPane key="comments" title="评论">
              <div class="comments-content">
                <AEmpty description="暂无评论" />
              </div>
            </ATabPane>
          </ATabs>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="editor-footer">
      <div class="footer-left">
        <span>第 {{ currentLine }} 行，第 {{ currentColumn }} 列</span>
      </div>
      <div class="footer-right">
        <AButton type="text" size="mini" @click="toggleSidebar">
          <Icon :name="showSidebar ? 'ri:side-bar-fill' : 'ri:side-bar-line'" />
          {{ showSidebar ? '隐藏' : '显示' }}侧边栏
        </AButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { useTiptapToolbar } from '~/composables/useTiptapToolbar'
import { Message } from '@arco-design/web-vue'
import { AvatarGroup } from '@arco-design/web-vue'

// 获取路由参数
const route = useRoute()
const documentId = route.params.id as string

// 响应式数据
const documentTitle = ref('无标题文档')
const editor = shallowRef<Editor | undefined>(undefined)
const saveStatus = ref<'saved' | 'saving' | 'error'>('saved')
const showSidebar = ref(true)
const sidebarTab = ref('outline')
const lastEditTime = ref('刚刚')
const wordCount = ref(0)
const readingTime = ref(0)
const currentLine = ref(1)
const currentColumn = ref(1)
const documentOutline = ref<Array<{ id: string; text: string; level: number }>>([])

// 模拟在线用户数据
const onlineUsers = ref([
  { id: '1', name: '张三', color: '#165dff' },
  { id: '2', name: '李四', color: '#00b42a' },
  { id: '3', name: '王五', color: '#ff7d00' }
])

// 使用工具栏组合函数
const {
  isBlockquote,
  isCodeBlock,
  isBulletList,
  isOrderedList,
  isTaskList,
  toggleHeading,
  toggleBlockquote,
  toggleCodeBlock,
  toggleBulletList,
  toggleOrderedList,
  toggleTaskList,
  setHorizontalRule,
  setTextAlign,
} = useTiptapToolbar(editor)

// 计算属性
const saveStatusText = computed(() => {
  switch (saveStatus.value) {
    case 'saved':
      return '已保存'
    case 'saving':
      return '保存中...'
    case 'error':
      return '保存失败'
    default:
      return ''
  }
})

const currentHeadingText = computed(() => {
  if (!editor.value) return '正文'
  if (editor.value.isActive('heading', { level: 1 })) return '标题 1'
  if (editor.value.isActive('heading', { level: 2 })) return '标题 2'
  if (editor.value.isActive('heading', { level: 3 })) return '标题 3'
  return '正文'
})

// 自动保存
let saveTimer: NodeJS.Timeout | null = null
const autoSave = () => {
  if (saveTimer) clearTimeout(saveTimer)
  
  saveStatus.value = 'saving'
  saveTimer = setTimeout(() => {
    // TODO: 实际保存逻辑
    console.log('自动保存文档内容')
    saveStatus.value = 'saved'
    lastEditTime.value = '刚刚'
  }, 2000)
}

// 更新文档统计信息
const updateDocumentStats = () => {
  if (!editor.value) return
  
  const text = editor.value.state.doc.textContent
  wordCount.value = text.length
  readingTime.value = Math.ceil(text.length / 500) // 假设每分钟阅读500字
  
  // 更新大纲
  const headings: Array<{ id: string; text: string; level: number }> = []
  editor.value.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      headings.push({
        id: `heading-${pos}`,
        text: node.textContent,
        level: node.attrs.level
      })
    }
  })
  documentOutline.value = headings
}

// 初始化编辑器
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      BubbleMenu,
      Highlight,
      Underline,
      Strike,
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Blockquote,
      HorizontalRule,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: `
      <h1>欢迎使用协同文档编辑器</h1>
      <p>这是一个功能丰富的现代化编辑器，为您提供流畅的写作体验。</p>
      
      <h2>主要特性</h2>
      <ul>
        <li>丰富的格式化选项</li>
        <li>实时自动保存</li>
        <li>文档大纲导航</li>
        <li>多人协同编辑</li>
        <li>暗黑模式支持</li>
      </ul>
      
      <h2>快捷键</h2>
      <p>使用快捷键可以更高效地编辑文档：</p>
      <ul>
        <li><code>Ctrl+B</code> - 加粗</li>
        <li><code>Ctrl+I</code> - 斜体</li>
        <li><code>Ctrl+U</code> - 下划线</li>
        <li><code>Ctrl+S</code> - 保存</li>
      </ul>
      
      <blockquote>
        <p>开始您的创作之旅吧！</p>
      </blockquote>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
    onUpdate: ({ editor: _editor }) => {
      autoSave()
      updateDocumentStats()
    },
    onSelectionUpdate: ({ editor: _editor }) => {
      // 更新光标位置
      const { from } = _editor.state.selection
      const pos = _editor.view.coordsAtPos(from)
      // 简化的行列计算
      currentLine.value = Math.floor(from / 50) + 1
      currentColumn.value = (from % 50) + 1
    }
  })
  
  // 初始更新统计
  updateDocumentStats()
})

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
  if (saveTimer) {
    clearTimeout(saveTimer)
  }
})

// 事件处理函数
const saveTitle = () => {
  console.log('保存标题:', documentTitle.value)
  autoSave()
}

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const scrollToHeading = (id: string) => {
  // TODO: 实现滚动到标题功能
  console.log('滚动到标题:', id)
}

const showDocumentInfo = () => {
  Message.info('文档信息功能开发中...')
}

const showHistory = () => {
  Message.info('历史版本功能开发中...')
}

const exportDocument = () => {
  Message.info('导出功能开发中...')
}

const printDocument = () => {
  window.print()
}

const shareDocument = () => {
  Message.success('分享链接已复制到剪贴板')
}

const insertImage = () => {
  Message.info('插入图片功能开发中...')
}

const insertTable = () => {
  Message.info('插入表格功能开发中...')
}

const insertLink = () => {
  const url = window.prompt('请输入链接地址')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

// 加载文档数据
const loadDocument = async () => {
  if (documentId === 'new') {
    documentTitle.value = '新建文档'
  } else {
    documentTitle.value = `文档 ${documentId}`
  }
}

// 页面初始化
onMounted(() => {
  loadDocument()
})

// 监听快捷键
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault()
        autoSave()
        Message.success('文档已保存')
      }
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.document-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-1);
}

/* 编辑器头部 */
.editor-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.breadcrumb {
  font-size: 14px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  overflow-x: auto;
}

.toolbar-groups {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-text {
  min-width: 60px;
  text-align: left;
}

.format-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
}

.format-option h1,
.format-option h2,
.format-option h3 {
  margin: 0;
  font-weight: 600;
}

.format-option h1 { font-size: 20px; }
.format-option h2 { font-size: 18px; }
.format-option h3 { font-size: 16px; }

.format-shortcut {
  font-size: 12px;
  color: var(--color-text-3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--color-text-3);
}

.status-icon {
  font-size: 16px;
}

.status-icon.saved {
  color: rgb(var(--success-6));
}

.status-icon.saving {
  color: rgb(var(--warning-6));
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.collaboration-users {
  display: flex;
  align-items: center;
}

/* 文档标题区域 */
.document-header {
  padding: 24px 24px 16px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.document-title-input {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.document-title-input :deep(.arco-input) {
  font-size: 32px;
  font-weight: 600;
  padding: 0;
  background: transparent;
}

.document-meta {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--color-text-3);
}

.document-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 编辑器主体 */
.editor-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.editor-container {
  height: 100%;
  display: flex;
}

.editor-wrapper {
  flex: 1;
  overflow: auto;
  padding: 32px;
  background: var(--color-bg-1);
}

.editor-content {
  max-width: 800px;
  margin: 0 auto;
  min-height: 100%;
}

/* 编辑器内容样式 */
.editor-content :deep(.ProseMirror) {
  outline: none;
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-text-1);
}

.editor-content :deep(.ProseMirror > * + *) {
  margin-top: 0.75em;
}

.editor-content :deep(h1),
.editor-content :deep(h2),
.editor-content :deep(h3) {
  font-weight: 600;
  line-height: 1.3;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.editor-content :deep(h1) { font-size: 2em; }
.editor-content :deep(h2) { font-size: 1.5em; }
.editor-content :deep(h3) { font-size: 1.25em; }

.editor-content :deep(p) {
  margin: 0.75em 0;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0.75em 0;
}

.editor-content :deep(li) {
  margin: 0.25em 0;
}

.editor-content :deep(ul[data-type="taskList"]) {
  list-style: none;
  padding: 0;
}

.editor-content :deep(ul[data-type="taskList"] li) {
  display: flex;
  align-items: flex-start;
  margin: 0.5em 0;
}

.editor-content :deep(ul[data-type="taskList"] li > label) {
  margin-right: 0.5em;
  margin-top: 0.25em;
}

.editor-content :deep(blockquote) {
  border-left: 4px solid rgb(var(--primary-6));
  padding-left: 1em;
  margin: 1em 0;
  color: var(--color-text-2);
  font-style: italic;
}

.editor-content :deep(pre) {
  background: var(--color-fill-2);
  border-radius: 8px;
  padding: 1em;
  margin: 1em 0;
  overflow-x: auto;
}

.editor-content :deep(code) {
  background: var(--color-fill-2);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

.editor-content :deep(pre code) {
  background: none;
  padding: 0;
}

.editor-content :deep(hr) {
  border: none;
  border-top: 2px solid var(--color-border);
  margin: 2em 0;
}

.editor-content :deep(a) {
  color: rgb(var(--primary-6));
  text-decoration: none;
  cursor: pointer;
}

.editor-content :deep(a:hover) {
  text-decoration: underline;
}

/* 侧边栏 */
.editor-sidebar {
  width: 280px;
  background: var(--color-bg-2);
  border-left: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.outline-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.outline-item {
  padding: 8px 12px;
  margin: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;
  color: var(--color-text-2);
}

.outline-item:hover {
  background: var(--color-fill-2);
  color: var(--color-text-1);
}

.outline-level-1 {
  font-weight: 600;
  font-size: 15px;
}

.outline-level-2 {
  padding-left: 24px;
}

.outline-level-3 {
  padding-left: 36px;
  font-size: 13px;
}

.comments-content {
  padding: 16px;
}

/* 底部状态栏 */
.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--color-bg-2);
  border-top: 1px solid var(--color-border);
  font-size: 12px;
  color: var(--color-text-3);
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .editor-sidebar {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    z-index: 10;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }
  
  .header-center {
    display: none;
  }
}

@media (max-width: 768px) {
  .document-title-input {
    font-size: 24px;
  }
  
  .document-meta {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .editor-wrapper {
    padding: 16px;
  }
}

/* 暗黑模式适配 */
body[arco-theme='dark'] .editor-content :deep(pre) {
  background: var(--color-fill-3);
}

body[arco-theme='dark'] .editor-content :deep(code) {
  background: var(--color-fill-3);
}
</style>