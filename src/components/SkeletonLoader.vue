<!--
  骨架屏加载组件
  @description 提供优雅的加载状态展示
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <div class="skeleton-loader" :class="{ 'skeleton-animated': animated }">
    <!-- 头像骨架 -->
    <div v-if="avatar" class="skeleton-avatar" :style="avatarStyle"></div>
    
    <!-- 标题骨架 -->
    <div v-if="title" class="skeleton-title" :style="titleStyle"></div>
    
    <!-- 段落骨架 -->
    <div v-if="paragraph" class="skeleton-paragraph">
      <div
        v-for="(width, index) in paragraphWidths"
        :key="index"
        class="skeleton-line"
        :style="{ width }"
      ></div>
    </div>
    
    <!-- 自定义骨架 -->
    <div v-if="rows > 0" class="skeleton-rows">
      <div
        v-for="row in rows"
        :key="row"
        class="skeleton-line"
        :style="getRowStyle(row)"
      ></div>
    </div>
    
    <!-- 卡片骨架 -->
    <div v-if="card" class="skeleton-card">
      <div class="skeleton-card-header">
        <div class="skeleton-avatar skeleton-card-avatar"></div>
        <div class="skeleton-card-content">
          <div class="skeleton-line skeleton-card-title"></div>
          <div class="skeleton-line skeleton-card-subtitle"></div>
        </div>
      </div>
      <div class="skeleton-card-body">
        <div class="skeleton-line" style="width: 100%"></div>
        <div class="skeleton-line" style="width: 80%"></div>
        <div class="skeleton-line" style="width: 60%"></div>
      </div>
    </div>
    
    <!-- 表格骨架 -->
    <div v-if="table" class="skeleton-table">
      <div class="skeleton-table-header">
        <div
          v-for="col in tableColumns"
          :key="col"
          class="skeleton-table-cell skeleton-table-header-cell"
        ></div>
      </div>
      <div
        v-for="row in tableRows"
        :key="row"
        class="skeleton-table-row"
      >
        <div
          v-for="col in tableColumns"
          :key="col"
          class="skeleton-table-cell"
        ></div>
      </div>
    </div>
    
    <!-- 列表骨架 -->
    <div v-if="list" class="skeleton-list">
      <div
        v-for="item in listItems"
        :key="item"
        class="skeleton-list-item"
      >
        <div class="skeleton-avatar skeleton-list-avatar"></div>
        <div class="skeleton-list-content">
          <div class="skeleton-line skeleton-list-title"></div>
          <div class="skeleton-line skeleton-list-subtitle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // 是否显示动画
  animated?: boolean
  // 是否显示头像
  avatar?: boolean
  // 头像大小
  avatarSize?: number
  // 是否显示标题
  title?: boolean
  // 标题宽度
  titleWidth?: string
  // 是否显示段落
  paragraph?: boolean
  // 段落行数
  paragraphRows?: number
  // 自定义行数
  rows?: number
  // 行高
  rowHeight?: number
  // 是否显示卡片骨架
  card?: boolean
  // 是否显示表格骨架
  table?: boolean
  // 表格列数
  tableColumns?: number
  // 表格行数
  tableRows?: number
  // 是否显示列表骨架
  list?: boolean
  // 列表项数
  listItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  animated: true,
  avatar: false,
  avatarSize: 40,
  title: false,
  titleWidth: '40%',
  paragraph: false,
  paragraphRows: 3,
  rows: 0,
  rowHeight: 16,
  card: false,
  table: false,
  tableColumns: 4,
  tableRows: 5,
  list: false,
  listItems: 5
})

// 计算头像样式
const avatarStyle = computed(() => ({
  width: `${props.avatarSize}px`,
  height: `${props.avatarSize}px`
}))

// 计算标题样式
const titleStyle = computed(() => ({
  width: props.titleWidth,
  height: '20px'
}))

// 计算段落宽度
const paragraphWidths = computed(() => {
  const widths: string[] = []
  for (let i = 0; i < props.paragraphRows; i++) {
    if (i === props.paragraphRows - 1) {
      // 最后一行随机宽度
      widths.push(`${Math.floor(Math.random() * 40) + 40}%`)
    } else {
      widths.push('100%')
    }
  }
  return widths
})

// 获取行样式
const getRowStyle = (row: number) => ({
  height: `${props.rowHeight}px`,
  width: row === props.rows ? `${Math.floor(Math.random() * 40) + 40}%` : '100%',
  marginBottom: '8px'
})
</script>

<style scoped>
.skeleton-loader {
  padding: 16px;
}

.skeleton-animated .skeleton-line,
.skeleton-animated .skeleton-avatar,
.skeleton-animated .skeleton-title,
.skeleton-animated .skeleton-table-cell {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-line,
.skeleton-avatar,
.skeleton-title,
.skeleton-table-cell {
  background-color: #f0f0f0;
  border-radius: 4px;
}

.skeleton-avatar {
  border-radius: 50%;
  margin-bottom: 16px;
}

.skeleton-title {
  margin-bottom: 16px;
}

.skeleton-paragraph {
  margin-bottom: 16px;
}

.skeleton-line {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-line:last-child {
  margin-bottom: 0;
}

/* 卡片骨架样式 */
.skeleton-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.skeleton-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.skeleton-card-avatar {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  margin-bottom: 0;
}

.skeleton-card-content {
  flex: 1;
}

.skeleton-card-title {
  width: 60%;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-card-subtitle {
  width: 40%;
  height: 14px;
  margin-bottom: 0;
}

.skeleton-card-body .skeleton-line {
  margin-bottom: 8px;
}

/* 表格骨架样式 */
.skeleton-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-table-header {
  display: flex;
  background-color: #f5f5f5;
  padding: 12px 0;
}

.skeleton-table-row {
  display: flex;
  border-top: 1px solid #e0e0e0;
  padding: 12px 0;
}

.skeleton-table-cell {
  flex: 1;
  height: 16px;
  margin: 0 12px;
}

.skeleton-table-header-cell {
  height: 18px;
}

/* 列表骨架样式 */
.skeleton-list-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.skeleton-list-item:last-child {
  border-bottom: none;
}

.skeleton-list-avatar {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  margin-bottom: 0;
}

.skeleton-list-content {
  flex: 1;
}

.skeleton-list-title {
  width: 70%;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-list-subtitle {
  width: 50%;
  height: 14px;
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skeleton-loader {
    padding: 12px;
  }
  
  .skeleton-card {
    padding: 12px;
  }
  
  .skeleton-table-cell {
    margin: 0 8px;
  }
}
</style>
