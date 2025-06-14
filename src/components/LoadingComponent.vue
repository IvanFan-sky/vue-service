<template>
  <div class="loading-container" v-show="loading">
    <div class="loading-content">
      <el-icon class="is-loading" size="24">
        <Loading />
      </el-icon>
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Loading } from '@element-plus/icons-vue'

  interface Props {
    loading?: boolean
    text?: string
  }

  withDefaults(defineProps<Props>(), {
    loading: true,
    text: '加载中...'
  })
</script>

<style scoped>
  .loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loading-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .loading-content p {
    margin-top: 10px;
    color: #666;
    font-size: 14px;
  }
</style>
