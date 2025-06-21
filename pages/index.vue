<template>
  <div class="home-page">
    <div class="page-container">
      <!-- 页面标题和操作 -->
      <div class="page-header">
        <h1>我的文档</h1>
        <div class="actions">
          <AButton type="primary" @click="createNewDocument">
            <IconPlus />
            新建文档
          </AButton>
          <AButton @click="createNewFolder">
            <IconFolder />
            新建文件夹
          </AButton>
        </div>
      </div>

      <div class="content-layout">
        <!-- 左侧目录树 -->
        <div class="sidebar">
          <ACard title="文档目录" :bordered="false">
            <ATree :data="documentTree" :default-expand-all="true" @select="handleTreeSelect">
              <template #title="nodeData">
                <div class="tree-node">
                  <IconFolder v-if="nodeData.type === 'folder'" />
                  <IconFile v-else />
                  <span class="node-title">{{ nodeData.title }}</span>
                </div>
              </template>
            </ATree>
          </ACard>
        </div>

        <!-- 右侧主内容区 -->
        <div class="main-content">
          <!-- 最近访问 -->
          <div class="recent-section">
            <h3>最近访问</h3>
            <div class="document-grid">
              <ACard v-for="doc in recentDocuments" :key="doc.id" class="document-card" hoverable
                @click="openDocument(doc.id)">
                <div class="document-info">
                  <div class="document-title">{{ doc.title }}</div>
                  <div class="document-meta">
                    <span>{{ formatDate(doc.updatedAt) }}</span>
                    <span>{{ doc.author }}</span>
                  </div>
                </div>
              </ACard>
            </div>
          </div>

          <!-- 我的文档 -->
          <div class="documents-section">
            <h3>我的文档</h3>
            <ATable :data="myDocuments" :columns="documentColumns" :pagination="false">
              <template #name="{ record }">
                <div v-if="editingDocumentId !== record.id" class="document-name" @click="openDocument(record.id)">
                  <IconFile />
                  <span>{{ record.title }}</span>
                </div>
                <div v-else class="document-name-editing">
                  <AInput ref="editingInputRef" v-model="editingTitle" size="small" style="width: 200px"
                    @press-enter="submitRename(record)" @blur="submitRename(record)"
                    @keydown.esc="editingDocumentId = undefined" />
                </div>
              </template>

              <template #actions="{ record }">
                <AButton size="mini" @click="renameDocument(record)">重命名</AButton>
                <AButton size="mini" status="danger" @click="deleteDocument(record.id)">删除</AButton>
              </template>
            </ATable>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建文件夹弹窗 -->
    <AModal v-model:visible="folderModalVisible" title="新建文件夹" @ok="submitNewFolder" @cancel="cancelNewFolder">
      <AInput v-model="newFolderName" placeholder="请输入文件夹名称" @press-enter="submitNewFolder" />
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconFolder, IconFile } from '@arco-design/web-vue/es/icon'
import { useDocumentStore, type CustomDocument } from '@/stores/document'
import { useFolderStore } from '@/stores/folder'
import type { Input } from '@arco-design/web-vue'
// 页面标题
useHead({
  title: '首页 - 协同文档编辑器'
})

// 引入文档store
const documentStore = useDocumentStore();
const folderStore = useFolderStore();
const myDocuments = computed(() => documentStore.allDocuments)
const recentDocuments = computed(() => documentStore.recentDocuments)
const documentTree = computed(() => documentStore.documentTree)

onMounted(async () => {
  await documentStore.loadDocumentTree()
  await documentStore.loadRecentDocuments()
})


const documentColumns = [
  { title: '文档名称', dataIndex: 'title', slotName: 'name' },
  { title: '修改时间', dataIndex: 'updatedAt', render: ({ record }: { record: { updatedAt: Date } }) => formatDate(record.updatedAt) },
  { title: '作者', dataIndex: 'author' },
  { title: '大小', dataIndex: 'size' },
  { title: '操作', slotName: 'actions', width: 150 }
]

// 工具函数
function formatDate(date: Date) {

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 事件处理
const createNewDocument = async () => {
  // TODO: 实现创建新文档逻辑
  navigateTo('/document/new')
}

// 新建文件夹逻辑
const folderModalVisible = ref(false)
const newFolderName = ref('')
const selectedFolderId = ref<string | null>(null)

const createNewFolder = () => {
  folderModalVisible.value = true
}
type Node = {
  type: string;
  id: string;
};
const handleTreeSelect = (_: unknown, { node }: { node: Node }) => {
  if (node?.type === 'folder') {
    selectedFolderId.value = node.id
    console.log('选中的文件夹 ID:', node.id)
  } else {
    selectedFolderId.value = null
    console.log('选中的是文档，忽略')
  }
}
const submitNewFolder = async () => {
  const name = newFolderName.value.trim()
  if (!name) return
  const res = await folderStore.createFolder(name, selectedFolderId.value)
  if (res?.status === 200) {
    await documentStore.loadDocumentTree()
    // await documentStore.loadRecentDocuments()
  }
  folderModalVisible.value = false
  newFolderName.value = ''
}
const cancelNewFolder = () => {
  folderModalVisible.value = false
  newFolderName.value = ''
}

const openDocument = (documentId: string) => {
  navigateTo(`/document/${documentId}`)
}
// 文档重命名
const editingDocumentId = ref<string | undefined>(undefined)
const editingTitle = ref('')
const editingInputRef = ref<InstanceType<typeof Input> | null>(null)

const renameDocument = (document: Partial<CustomDocument>) => {
  // 实现重命名逻辑
  editingDocumentId.value = document.id
  editingTitle.value = document.title!
  nextTick(() => {
    editingInputRef.value?.focus?.()
  })
}
// 提交重命名
const submitRename = async (document: Partial<CustomDocument>) => {
  const newTitle = editingTitle.value.trim()
  if (!newTitle || newTitle === document.title) {
    editingDocumentId.value = undefined
    return
  }
  const updatedDoc = { title: newTitle }

  const response = await documentStore.updateDocument(document.id!, updatedDoc)

  if (response?.status === 200) {
    console.log("文件名更新成功")
    await documentStore.loadDocumentTree()
    await documentStore.loadRecentDocuments()
  }
  editingDocumentId.value = undefined
}

const deleteDocument = async (documentId: string) => {
  // 实现删除逻辑
  console.log('删除文档:', documentId)
  const response = await documentStore.deleteDocument(documentId)
  if (response.status === 200) {
    await documentStore.loadDocumentTree()
    await documentStore.loadRecentDocuments()
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  color: #1d2129;
}

.actions {
  display: flex;
  gap: 12px;
}

.content-layout {
  display: flex;
  gap: 24px;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-title {
  cursor: pointer;
}

.recent-section,
.documents-section {
  margin-bottom: 32px;
}

.recent-section h3,
.documents-section h3 {
  margin-bottom: 16px;
  color: #1d2129;
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.document-card {
  cursor: pointer;
  transition: all 0.2s;
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.document-info {
  padding: 8px;
}

.document-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: #1d2129;
}

.document-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #86909c;
}

.document-name {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #165dff;
}

.document-name-editing {
  display: flex;
  align-items: center;
  gap: 8px;
}

.document-name:hover {
  text-decoration: underline;
}

.folder-create {
  margin-top: 16px;
}
</style>