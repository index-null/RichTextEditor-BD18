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
            <ATree
              :data="documentTree"
              :default-expand-all="true"
              @select="handleTreeSelect"
            >
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
              <ACard
                v-for="doc in recentDocuments"
                :key="doc.id"
                class="document-card"
                hoverable
                @click="openDocument(doc.id)"
              >
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
            <ATable
              :data="myDocuments"
              :columns="documentColumns"
              :pagination="false"
            >
              <template #name="{ record }">
                <div class="document-name" @click="openDocument(record.id)">
                  <IconFile />
                  <span>{{ record.title }}</span>
                </div>
              </template>
              <template #actions="{ record }">
                <AButton size="mini" @click="renameDocument(record)"
                  >重命名</AButton
                >
                <AButton
                  size="mini"
                  status="danger"
                  @click="deleteDocument(record.id)"
                  >删除</AButton
                >
              </template>
            </ATable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面标题
useHead({
  title: "首页 - 协同文档编辑器",
});

// 模拟数据
const documentTree = ref([
  {
    key: "1",
    title: "工作文档",
    type: "folder",
    children: [
      { key: "1-1", title: "项目计划.md", type: "document" },
      { key: "1-2", title: "需求文档.md", type: "document" },
    ],
  },
  {
    key: "2",
    title: "个人笔记",
    type: "folder",
    children: [{ key: "2-1", title: "学习笔记.md", type: "document" }],
  },
]);

const recentDocuments = ref([
  {
    id: "1",
    title: "项目技术方案",
    updatedAt: new Date("2024-01-15"),
    author: "张三",
  },
  {
    id: "2",
    title: "产品需求文档",
    updatedAt: new Date("2024-01-14"),
    author: "李四",
  },
]);

const myDocuments = ref([
  {
    id: "1",
    title: "项目技术方案",
    updatedAt: new Date("2024-01-15"),
    author: "张三",
    size: "2.3KB",
  },
  {
    id: "2",
    title: "产品需求文档",
    updatedAt: new Date("2024-01-14"),
    author: "李四",
    size: "1.8KB",
  },
]);

const documentColumns = [
  { title: "文档名称", dataIndex: "title", slotName: "name" },
  {
    title: "修改时间",
    dataIndex: "updatedAt",
    render: ({ record }: { record: { updatedAt: Date } }) =>
      formatDate(record.updatedAt),
  },
  { title: "作者", dataIndex: "author" },
  { title: "大小", dataIndex: "size" },
  { title: "操作", slotName: "actions", width: 150 },
];

// 工具函数
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// 事件处理
const createNewDocument = () => {
  // TODO: 实现创建新文档逻辑
  navigateTo("/document/new");
};

const createNewFolder = () => {
  // TODO: 实现创建文件夹逻辑
  console.log("创建新文件夹");
};

const handleTreeSelect = (selectedKeys: string[]) => {
  console.log("选中的节点:", selectedKeys);
};

const openDocument = (documentId: string) => {
  navigateTo(`/document/${documentId}`);
};

const renameDocument = (document: unknown) => {
  // TODO: 实现重命名逻辑
  console.log("重命名文档:", document);
};

const deleteDocument = (documentId: string) => {
  // TODO: 实现删除逻辑
  console.log("删除文档:", documentId);
};
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

.document-name:hover {
  text-decoration: underline;
}
</style>
