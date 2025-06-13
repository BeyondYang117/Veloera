import react from '@vitejs/plugin-react';
import { defineConfig, transformWithEsbuild } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!/src\/.*\.js$/.test(id)) {
          return null;
        }

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.json': 'json',
      },
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    headers: {
      'Cache-Control': 'no-store',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/dashboard': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        // 强制缓存破坏 - 每次构建都生成新的文件名
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
      },
    },
    // 禁用代码压缩以便于调试
    minify: false,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});
