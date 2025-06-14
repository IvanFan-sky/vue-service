<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-image">
        <div class="error-icon">404</div>
      </div>
      <div class="not-found-text">
        <h1>404</h1>
        <h2>抱歉，您访问的页面不存在</h2>
        <p>您访问的页面可能已经删除或者路径不正确</p>
        <div class="not-found-actions">
          <el-button type="primary" @click="goHome">返回首页</el-button>
          <el-button @click="goBack">返回上页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // 返回首页
  const goHome = () => {
    router.push('/')
  }

  // 返回上一页
  const goBack = () => {
    router.go(-1)
  }
</script>

<style scoped>
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }

  .not-found-content {
    display: flex;
    align-items: center;
    max-width: 800px;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .not-found-image {
    flex: 1;
    text-align: center;
    margin-right: 40px;
  }

  .error-icon {
    font-size: 120px;
    font-weight: bold;
    color: #409eff;
    opacity: 0.3;
  }

  .not-found-text {
    flex: 1;
  }

  .not-found-text h1 {
    font-size: 80px;
    font-weight: bold;
    color: #409eff;
    margin: 0;
    line-height: 1;
  }

  .not-found-text h2 {
    font-size: 24px;
    color: #333;
    margin: 20px 0 10px 0;
  }

  .not-found-text p {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
    line-height: 1.5;
  }

  .not-found-actions {
    display: flex;
    gap: 10px;
  }

  @media (max-width: 768px) {
    .not-found-content {
      flex-direction: column;
      text-align: center;
      padding: 20px;
    }

    .not-found-image {
      margin-right: 0;
      margin-bottom: 20px;
    }

    .not-found-text h1 {
      font-size: 60px;
    }

    .not-found-text h2 {
      font-size: 20px;
    }
  }
</style>
