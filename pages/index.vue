<template>
  <div class="home-page">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          欢迎回来，
          <span class="gradient-text">{{ userName }}</span>
        </h1>
        <p class="welcome-subtitle">今天想要创建什么样的文档？</p>
        
        <!-- 快速操作 -->
        <div class="quick-actions">
          <AButton type="primary" size="large" @click="createNewDocument">
            <template #icon><Icon name="ri:add-line" /></template>
            新建文档
          </AButton>
          <AButton size="large" @click="showImportModal = true">
            <template #icon><Icon name="ri:upload-2-line" /></template>
            导入文档
          </AButton>
          <AButton size="large" @click="showTemplateModal = true">
            <template #icon><Icon name="ri:file-copy-line" /></template>
            从模板创建
          </AButton>
        </div>
      </div>
      
      <!-- 统计卡片 -->
      <div class="stat-cards">
        <ACard class="stat-card" :bordered="false">
          <AStatistic 
            title="文档总数" 
            :value="totalDocuments"
            :value-style="{ color: 'rgb(var(--primary-6))' }"
          >
            <template #prefix>
              <Icon name="ri:file-text-line" />
            </template>
          </AStatistic>
        </ACard>
        <ACard class="stat-card" :bordered="false">
          <AStatistic 
            title="今日编辑" 
            :value="todayEdited"
            :value-style="{ color: 'rgb(var(--success-6))' }"
          >
            <template #prefix>
              <Icon name="ri:edit-line" />
            </template>
          </AStatistic>
        </ACard>
        <ACard class="stat-card" :bordered="false">
          <AStatistic 
            title="协作人数" 
            :value="collaborators"
            :value-style="{ color: 'rgb(var(--warning-6))' }"
          >
            <template #prefix>
              <Icon name="ri:team-line" />
            </template>
          </AStatistic>
        </ACard>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-section">
      <ARow :gutter="24">
        <!-- 左侧文档树 -->
        <ACol :xs="24" :sm="24" :md="8" :lg="6">
          <ACard title="文档目录" :bordered="false" class="folder-card">
            <template #extra>
              <AButton type="text" size="small" @click="createNewFolder">
                <template #icon><Icon name="ri:add-line" /></template>
              </AButton>
            </template>
            
            <ASpin :loading="loading" tip="加载中...">
              <ATree 
                v-if="documentStore.documentTree.length > 0"
                :data="documentStore.documentTree" 
                :default-expand-all="true"
                :draggable="true"
                @select="handleTreeSelect"
                @drop="handleTreeDrop"
              >
                <template #title="nodeData">
                  <div class="tree-node">
                    <Icon :name="nodeData.type === 'folder' ? 'ri:folder-3-line' : 'ri:file-text-line'" />
                    <span class="node-title">{{ nodeData.title }}</span>
                    <div class="node-actions">
                      <ADropdown trigger="click" @select="(value) => handleNodeAction(value, nodeData)">
                        <Icon name="ri:more-line" class="action-icon" />
                        <template #content>
                          <ADoption value="rename">重命名</ADoption>
                          <ADoption value="delete">删除</ADoption>
                        </template>
                      </ADropdown>
                    </div>
                  </div>
                </template>
              </ATree>
              <AEmpty v-else description="暂无文档" />
            </ASpin>
          </ACard>
        </ACol>

        <!-- 右侧内容区 -->
        <ACol :xs="24" :sm="24" :md="16" :lg="18">
          <!-- 最近文档 -->
          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">最近文档</h2>
              <ALink @click="navigateTo('/documents')">查看全部</ALink>
            </div>
            
            <div v-if="documentStore.recentDocuments.length > 0" class="document-grid">
              <ACard 
                v-for="doc in documentStore.recentDocuments" 
                :key="doc.id"
                class="document-card"
                hoverable
                @click="openDocument(doc.id)"
              >
                <template #cover>
                  <div class="document-preview">
                    <Icon name="ri:file-text-line" :size="48" />
                  </div>
                </template>
                
                <ACardMeta>
                  <template #title>
                    <div class="document-title">{{ doc.title }}</div>
                  </template>
                  <template #description>
                    <div class="document-meta">
                      <span><Icon name="ri:time-line" /> {{ formatDate(doc.updatedAt) }}</span>
                      <span><Icon name="ri:user-line" /> {{ doc.author }}</span>
                    </div>
                  </template>
                </ACardMeta>
                
                <template #actions>
                  <span><Icon name="ri:star-line" /></span>
                  <span><Icon name="ri:share-line" /></span>
                  <ADropdown @select="(value) => handleDocAction(value, doc)">
                    <span><Icon name="ri:more-line" /></span>
                    <template #content>
                      <ADoption value="rename">重命名</ADoption>
                      <ADoption value="duplicate">复制</ADoption>
                      <ADoption value="delete">删除</ADoption>
                    </template>
                  </ADropdown>
                </template>
              </ACard>
            </div>
            <AEmpty v-else description="暂无最近文档" />
          </div>

          <!-- 文档列表 -->
          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">所有文档</h2>
              <ASpace>
                <AInput 
                  v-model="searchKeyword"
                  placeholder="搜索文档"
                  allow-clear
                  @input="handleSearch"
                >
                  <template #prefix>
                    <Icon name="ri:search-line" />
                  </template>
                </AInput>
                <ASelect v-model="sortBy" placeholder="排序方式" style="width: 120px">
                  <AOption value="updatedAt">最近修改</AOption>
                  <AOption value="createdAt">创建时间</AOption>
                  <AOption value="title">名称</AOption>
                </ASelect>
              </ASpace>
            </div>
            
            <ATable 
              :data="filteredDocuments" 
              :columns="documentColumns"
              :pagination="{
                pageSize: 10,
                showTotal: true,
                showJumper: true,
                showPageSize: true
              }"
              :loading="loading"
            >
              <template #name="{ record }">
                <div class="table-document-name" @click="openDocument(record.id)">
                  <Icon name="ri:file-text-line" />
                  <span>{{ record.title }}</span>
                  <ABadge v-if="record.isNew" text="New" :offset="[10, 0]" />
                </div>
              </template>
              <template #updatedAt="{ record }">
                <ATooltip :content="formatFullDate(record.updatedAt)">
                  {{ formatDate(record.updatedAt) }}
                </ATooltip>
              </template>
              <template #actions="{ record }">
                <ASpace>
                  <AButton type="text" size="mini" @click="openDocument(record.id)">
                    <template #icon><Icon name="ri:edit-line" /></template>
                  </AButton>
                  <AButton type="text" size="mini" @click="shareDocument(record)">
                    <template #icon><Icon name="ri:share-line" /></template>
                  </AButton>
                  <APopconfirm 
                    content="确定要删除这个文档吗？" 
                    @ok="deleteDocument(record.id)"
                  >
                    <AButton type="text" size="mini" status="danger">
                      <template #icon><Icon name="ri:delete-bin-line" /></template>
                    </AButton>
                  </APopconfirm>
                </ASpace>
              </template>
            </ATable>
          </div>
        </ACol>
      </ARow>
    </div>

    <!-- 导入文档模态框 -->
    <AModal 
      v-model:visible="showImportModal" 
      title="导入文档"
      :width="480"
      @ok="handleImport"
    >
      <AUpload
        draggable
        accept=".md,.txt,.docx"
        :custom-request="customUpload"
      >
        <template #upload-button>
          <div class="upload-demo-draggable">
            <Icon name="ri:upload-cloud-line" :size="48" />
            <div class="upload-text">
              点击或拖拽文件到此处上传
            </div>
            <div class="upload-hint">
              支持 .md, .txt, .docx 格式
            </div>
          </div>
        </template>
      </AUpload>
    </AModal>

    <!-- 模板选择模态框 -->
    <AModal 
      v-model:visible="showTemplateModal" 
      title="选择模板"
      :width="720"
      :footer="false"
    >
      <div class="template-grid">
        <ACard 
          v-for="template in templates" 
          :key="template.id"
          class="template-card"
          hoverable
          @click="createFromTemplate(template)"
        >
          <div class="template-icon">
            <Icon :name="template.icon" :size="48" />
          </div>
          <h4>{{ template.name }}</h4>
          <p>{{ template.description }}</p>
        </ACard>
      </div>
    </AModal>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useDocumentStore } from '~/stores/document'
// 类型定义
interface Document {
  id: number
  title: string
  updatedAt: Date
  createdAt: Date
  author: string
  size: string
  isNew?: boolean
}

interface TreeNode {
  key: string
  title: string
  type: 'folder' | 'document'
  children?: TreeNode[]
}

interface Template {
  id: string
  name: string
  description: string
  icon: string
}

// 响应式数据
const userName = ref('用户')
const loading = ref(false)
const searchKeyword = ref('')
const sortBy = ref('updatedAt')
const showImportModal = ref(false)
const showTemplateModal = ref(false)

const documentStore=useDocumentStore()
onMounted(async () => {
  await documentStore.loadDocumentTree()
  await documentStore.loadRecentDocuments()
  console.log(myDocuments.value)
})
const myDocuments = computed(()=>{
  return documentStore.myDocuments
})
// 统计数据
const totalDocuments = ref(23)
const todayEdited = ref(5)
const collaborators = ref(8)




// 模板数据
const templates: Template[] = [
  {
    id: '1',
    name: '会议纪要',
    description: '用于记录会议内容和决议',
    icon: 'ri:file-list-3-line'
  },
  {
    id: '2',
    name: '项目提案',
    description: '项目计划和提案模板',
    icon: 'ri:lightbulb-line'
  },
  {
    id: '3',
    name: '技术文档',
    description: '技术规范和API文档',
    icon: 'ri:code-s-slash-line'
  },
  {
    id: '4',
    name: '周报模板',
    description: '每周工作总结模板',
    icon: 'ri:calendar-check-line'
  }
]

// 表格列配置
const documentColumns = [
  { 
    title: '文档名称', 
    dataIndex: 'title', 
    slotName: 'name',
    ellipsis: true,
    tooltip: true,
    width: 300
  },
  { 
    title: '最后修改', 
    dataIndex: 'updatedAt', 
    slotName: 'updatedAt',
    width: 150
  },
  { 
    title: '作者', 
    dataIndex: 'author',
    ellipsis: true,
    width: 100
  },
  { 
    title: '大小', 
    dataIndex: 'size',
    width: 80
  },
  { 
    title: '操作', 
    slotName: 'actions', 
    width: 120,
    align: 'center'
  }
]

// 计算属性
const filteredDocuments = computed(() => {
  let docs = [...myDocuments.value]
  
  // 搜索过滤
  if (searchKeyword.value) {
    docs = docs.filter(doc => 
      doc.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  // 排序
  docs.sort((a, b) => {
    if (sortBy.value === 'title') {
      return a.title.localeCompare(b.title)
    } else {
      // 安全的日期属性访问
      const aValue = sortBy.value === 'updatedAt' ? a.updatedAt : a.createdAt
      const bValue = sortBy.value === 'updatedAt' ? b.updatedAt : b.createdAt
      // 确保日期值存在且转换为时间戳
      const aTime = aValue instanceof Date ? aValue.getTime() : new Date(aValue).getTime()
      const bTime = bValue instanceof Date ? bValue.getTime() : new Date(bValue).getTime()
      return bTime - aTime
    }
  })
  
  return docs
})

// 工具函数
const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days} 天前`
  } else {
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    }).format(d)
  }
}


const formatFullDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

// 事件处理
const createNewDocument = () => {
  navigateTo('/document/new')
}

const createNewFolder = () => {
  Message.info('创建文件夹功能开发中...')
}

const handleTreeSelect = (selectedKeys: string[]) => {
  console.log('选中的节点:', selectedKeys)
}

const handleTreeDrop = (_params: { dragNode: TreeNode; dropNode: TreeNode; dropPosition: number }) => {
  Message.success('文档已移动')
}

const openDocument = (documentId: number) => {
  navigateTo(`/document/${documentId}`)
}

const shareDocument = (doc: Pick<Document, 'id' | 'title'>) => {
  Message.info(`分享文档: ${doc.title}`)
}

const deleteDocument = (documentId: number) => {
  loading.value = true
  setTimeout(async() => {
    loading.value = false
    await documentStore.deleteDocument(documentId)
    // Message.success('文档已删除')
  }, 1000)
}

const handleNodeAction = (action: string, node: TreeNode) => {
  if (action === 'rename') {
    Message.info(`重命名: ${node.title}`)
  } else if (action === 'delete') {
    Message.warning(`删除: ${node.title}`)
  }
}

const handleDocAction = (action: string, doc: Pick<Document, 'id' | 'title'>) => {
  if (action === 'rename') {
    Message.info(`重命名: ${doc.title}`)
  } else if (action === 'duplicate') {
    Message.info(`复制: ${doc.title}`)
  } else if (action === 'delete') {
    deleteDocument(doc.id)
  }
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中实现
}

interface UploadOption {
  onProgress: (percent: number) => void
  onSuccess: (response: boolean) => void
  onError: (error: Error) => void
  file: { name: string }
}

const customUpload = (option: UploadOption) => {
  const { onProgress, onSuccess, file } = option
  // 模拟上传
  onProgress(50)
  setTimeout(() => {
    onSuccess(true)
    Message.success(`${file.name} 上传成功`)
  }, 1000)
}

const handleImport = () => {
  showImportModal.value = false
  Message.success('文档导入成功')
}

const createFromTemplate = (template: Template) => {
  showTemplateModal.value = false
  Message.success(`正在使用"${template.name}"模板创建文档...`)
  setTimeout(() => {
    navigateTo('/document/new?template=' + template.id)
  }, 500)
}
</script>

<style scoped>
.home-page {
  padding: 24px;
  max-width: 1440px;
  margin: 0 auto;
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 32px;
}

.welcome-content {
  margin-bottom: 24px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text-1);
}

.gradient-text {
  background: linear-gradient(120deg, rgb(var(--primary-6)) 0%, rgb(var(--primary-5)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 16px;
  color: var(--color-text-3);
  margin-bottom: 24px;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 统计卡片 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.stat-card {
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 主要内容区 */
.main-section {
  margin-top: 32px;
}

.folder-card {
  height: 100%;
  min-height: 400px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  position: relative;
}

.node-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .node-actions {
  opacity: 1;
}

.action-icon {
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-icon:hover {
  background: var(--color-fill-2);
}

/* 内容区域 */
.content-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
}

/* 文档网格 */
.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.document-card {
  transition: all 0.3s;
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.document-preview {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-fill-2);
  color: var(--color-text-3);
}

.document-title {
  font-weight: 500;
  color: var(--color-text-1);
}

.document-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--color-text-3);
}

.document-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 表格样式 */
.table-document-name {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgb(var(--primary-6));
}

.table-document-name:hover {
  text-decoration: underline;
}

/* 上传区域 */
.upload-demo-draggable {
  padding: 40px;
  text-align: center;
  background: var(--color-fill-2);
  border: 1px dashed var(--color-border-2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-demo-draggable:hover {
  border-color: rgb(var(--primary-6));
  background: var(--color-fill-3);
}

.upload-text {
  margin-top: 12px;
  color: var(--color-text-1);
  font-size: 14px;
}

.upload-hint {
  margin-top: 8px;
  color: var(--color-text-3);
  font-size: 12px;
}

/* 模板网格 */
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.template-card {
  text-align: center;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.template-icon {
  margin-bottom: 16px;
  color: rgb(var(--primary-6));
}

.template-card h4 {
  margin: 0 0 8px 0;
  color: var(--color-text-1);
}

.template-card p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 24px;
  }
  
  .stat-cards {
    grid-template-columns: 1fr;
  }
  
  .document-grid {
    grid-template-columns: 1fr;
  }
}
</style> 