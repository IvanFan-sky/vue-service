import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Gzip 压缩
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // 只压缩大于 1KB 的文件
      deleteOriginFile: false, // 保留原文件
    }),
    // Brotli 压缩（更好的压缩率）
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    // Bundle 分析器（仅在分析模式下启用）
    ...(process.env.ANALYZE ? [visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })] : []),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 优化代码分割策略
        manualChunks: (id) => {
          // 第三方库分割
          if (id.includes('node_modules')) {
            // Vue 生态系统
            if (id.includes('vue') || id.includes('pinia') || id.includes('@vue')) {
              return 'vue-vendor'
            }
            // UI 组件库
            if (id.includes('element-plus') || id.includes('@element-plus')) {
              return 'ui-vendor'
            }
            // 工具库
            if (id.includes('axios') || id.includes('dayjs')) {
              return 'utils-vendor'
            }
            // 开发依赖（如 faker）
            if (id.includes('@faker-js')) {
              return 'dev-vendor'
            }
            // 其他第三方库
            return 'vendor'
          }

          // 按页面路由分割
          if (id.includes('/views/')) {
            const routeName = id.split('/views/')[1].split('.')[0].toLowerCase()
            return `page-${routeName}`
          }

          // 按功能模块分割
          if (id.includes('/components/')) {
            if (id.includes('/Layout/')) {
              return 'layout'
            }
            if (id.includes('/User/')) {
              return 'user-components'
            }
            return 'components'
          }

          // API 模块
          if (id.includes('/api/')) {
            return 'api'
          }

          // 工具函数
          if (id.includes('/utils/') || id.includes('/composables/')) {
            return 'utils'
          }
        }
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // 移除未使用的代码
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        // 优化条件表达式
        conditionals: true,
        // 移除死代码
        dead_code: true,
        // 优化循环
        loops: true,
        // 内联函数
        inline: true,
      },
      mangle: {
        // 保留类名（用于调试）
        keep_classnames: false,
        // 保留函数名（用于调试）
        keep_fnames: false,
      },
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置更大的 chunk 大小限制
    chunkSizeWarningLimit: 1500,
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus',
      'axios'
    ],
    exclude: [
      '@faker-js/faker' // 开发时排除大型依赖
    ]
  },
  // 开发环境优化
  esbuild: {
    // 生产环境移除 console
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})
