<!--
  虚拟滚动列表组件
  @description 用于渲染大量数据的高性能列表组件
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <!-- 总高度占位 -->
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- 可见区域 -->
    <div class="virtual-list-content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="getItemKey(item)"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item.index">
          {{ item.data }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { rafThrottle } from '@/utils/performance'

  interface VirtualListItem {
    index: number
    data: any
  }

  interface Props {
    // 数据列表
    items: any[]
    // 每项高度
    itemHeight?: number
    // 容器高度
    containerHeight?: number
    // 缓冲区大小（上下各渲染多少项）
    bufferSize?: number
    // 获取项目唯一键的函数
    keyField?: string | ((item: any) => string | number)
  }

  const props = withDefaults(defineProps<Props>(), {
    itemHeight: 50,
    containerHeight: 400,
    bufferSize: 5,
    keyField: 'id'
  })

  const emit = defineEmits<{
    scroll: [scrollTop: number]
    reachBottom: []
  }>()

  // 容器引用
  const containerRef = ref<HTMLElement>()

  // 滚动位置
  const scrollTop = ref(0)

  // 计算属性
  const totalHeight = computed(() => props.items.length * props.itemHeight)

  const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight))

  const startIndex = computed(() => {
    const index = Math.floor(scrollTop.value / props.itemHeight)
    return Math.max(0, index - props.bufferSize)
  })

  const endIndex = computed(() => {
    const index = startIndex.value + visibleCount.value + props.bufferSize * 2
    return Math.min(props.items.length, index)
  })

  const visibleItems = computed(() => {
    const items: VirtualListItem[] = []
    for (let i = startIndex.value; i < endIndex.value; i++) {
      if (props.items[i]) {
        items.push({
          index: i,
          data: props.items[i]
        })
      }
    }
    return items
  })

  const offsetY = computed(() => startIndex.value * props.itemHeight)

  // 获取项目键值
  const getItemKey = (item: VirtualListItem): string | number => {
    if (typeof props.keyField === 'function') {
      return props.keyField(item.data)
    }
    return item.data[props.keyField] || item.index
  }

  // 节流的滚动处理函数
  const handleScroll = rafThrottle((event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop

    emit('scroll', scrollTop.value)

    // 检查是否到达底部
    const { scrollTop: currentScrollTop, scrollHeight, clientHeight } = target
    if (currentScrollTop + clientHeight >= scrollHeight - 10) {
      emit('reachBottom')
    }
  })

  // 滚动到指定位置
  const scrollTo = (index: number) => {
    if (containerRef.value) {
      const targetScrollTop = index * props.itemHeight
      containerRef.value.scrollTop = targetScrollTop
      scrollTop.value = targetScrollTop
    }
  }

  // 滚动到顶部
  const scrollToTop = () => {
    scrollTo(0)
  }

  // 滚动到底部
  const scrollToBottom = () => {
    scrollTo(props.items.length - 1)
  }

  // 监听数据变化，重置滚动位置
  watch(
    () => props.items.length,
    (newLength, oldLength) => {
      if (newLength !== oldLength) {
        scrollTop.value = 0
        if (containerRef.value) {
          containerRef.value.scrollTop = 0
        }
      }
    }
  )

  // 暴露方法给父组件
  defineExpose({
    scrollTo,
    scrollToTop,
    scrollToBottom,
    getScrollTop: () => scrollTop.value
  })

  onMounted(() => {
    // 初始化滚动位置
    scrollTop.value = 0
  })

  onUnmounted(() => {
    // 清理工作在rafThrottle内部已处理
  })
</script>

<style scoped>
  .virtual-list-container {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .virtual-list-phantom {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }

  .virtual-list-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .virtual-list-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .virtual-list-item:last-child {
    border-bottom: none;
  }

  /* 滚动条样式 */
  .virtual-list-container::-webkit-scrollbar {
    width: 6px;
  }

  .virtual-list-container::-webkit-scrollbar-track {
    background: var(--el-fill-color-light);
    border-radius: 3px;
  }

  .virtual-list-container::-webkit-scrollbar-thumb {
    background: var(--el-border-color);
    border-radius: 3px;
  }

  .virtual-list-container::-webkit-scrollbar-thumb:hover {
    background: var(--el-border-color-dark);
  }
</style>
