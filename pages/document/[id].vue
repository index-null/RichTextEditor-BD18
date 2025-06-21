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
        <AButtonGroup>
          <ADropdown @select="(level: string | number) => toggleHeading(level as 1 | 2 | 3)">
            <AButton size="small">
              <Icon name="ri:heading" /> <Icon name="ri:arrow-down-s-line" />
            </AButton>
            <template #content>
              <ADoption @click="toggleHeading(1)"><h1>标题 1</h1></ADoption>
              <ADoption @click="toggleHeading(2)"><h2>标题 2</h2></ADoption>
              <ADoption @click="toggleHeading(3)"><h3>标题 3</h3></ADoption>
            </template>
          </ADropdown>
        </AButtonGroup>
        <ADivider direction="vertical" />
        <AButtonGroup>
           <AButton size="small" :type="isBulletList ? 'primary' : 'secondary'" @click="toggleBulletList">
            <Icon name="ri:list-unordered" />
          </AButton>
          <AButton size="small" :type="isOrderedList ? 'primary' : 'secondary'" @click="toggleOrderedList">
            <Icon name="ri:list-ordered" />
          </AButton>
           <AButton size="small" :type="isTaskList ? 'primary' : 'secondary'" @click="toggleTaskList">
            <Icon name="ri:task-line" />
          </AButton>
        </AButtonGroup>
        <ADivider direction="vertical" />
        <AButtonGroup>
          <AButton size="small" @click="setTextAlign('left')"><Icon name="ri:align-left" /></AButton>
          <AButton size="small" @click="setTextAlign('center')"><Icon name="ri:align-center" /></AButton>
          <AButton size="small" @click="setTextAlign('right')"><Icon name="ri:align-right" /></AButton>
          <AButton size="small" @click="setTextAlign('justify')"><Icon name="ri:align-justify" /></AButton>
        </AButtonGroup>
        <ADivider direction="vertical" />
        <AButtonGroup>
          <AButton size="small" :type="isBlockquote ? 'primary' : 'secondary'" @click="toggleBlockquote">
            <Icon name="ri:double-quotes-l" />
          </AButton>
          <AButton size="small" :type="isCodeBlock ? 'primary' : 'secondary'" @click="toggleCodeBlock">
            <Icon name="ri:code-view" />
          </AButton>
          <AButton size="small" @click="setHorizontalRule">
            <Icon name="ri:separator" />
          </AButton>
        </AButtonGroup>
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
    <FloatingToolbar :editor="editor" />
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
import { useHead, useRoute } from 'nuxt/app'
import { ref, shallowRef, onMounted, onBeforeUnmount } from 'vue'

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
      <p>这是一个功能丰富的 Tiptap 编辑器。<strong>试试选中文本，看看会发生什么？</strong></p>
      <p style="text-align: center">支持文本对齐</p>
      <p style="text-align: right">右对齐</p>
      <ul><li>无序列表</li></ul>
      <ol><li>有序列表</li></ol>
      <ul data-type="taskList"><li data-checked="true">已完成任务</li><li data-checked="false">未完成任务</li></ul>
      <blockquote>引用块，在这里写下你的想法吧！</blockquote>
      <pre><code>console.log("Hello, World!")</code></pre>
      <hr>
      <p>开始编辑您的文档吧！</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor: _editor }) => {
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
  flex-wrap: wrap;
}

.document-title-section {
  flex: 1;
  min-width: 200px;
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
  flex-wrap: wrap;
}

.collaboration-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
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

.editor-content :deep(h1),
.editor-content :deep(h2),
.editor-content :deep(h3) {
  font-weight: bold;
  line-height: 1.3;
  margin: 1.2em 0 0.6em 0;
}

.editor-content :deep(h1) { font-size: 1.8em; }
.editor-content :deep(h2) { font-size: 1.5em; }
.editor-content :deep(h3) { font-size: 1.25em; }

.editor-content :deep(p) { margin: 0.5em 0; }

.editor-content :deep(ul),
.editor-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.editor-content :deep(ul[data-type="taskList"]) {
  list-style: none;
  padding: 0;
}

.editor-content :deep(ul[data-type="taskList"] li) {
  display: flex;
  align-items: center;
  margin: 0.2em 0;
}

.editor-content :deep(ul[data-type="taskList"] li > label) {
  margin-right: 0.5em;
}

.editor-content :deep(ul[data-type="taskList"] li > div) {
  flex: 1;
}

.editor-content :deep(blockquote) {
  border-left: 3px solid #e5e6eb;
  padding-left: 1em;
  margin: 1em 0;
  color: #86909c;
}

.editor-content :deep(pre) {
  background: #f7f8fa;
  border-radius: 4px;
  padding: 12px;
  margin: 1em 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  overflow-x: auto;
}

.editor-content :deep(code) {
  background: #f7f8fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

.editor-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e6eb;
  margin: 1.5em 0;
}
</style> 