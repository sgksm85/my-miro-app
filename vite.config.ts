import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000
  },
  build: {
    target: 'esnext' // 最新のES仕様をターゲットにする
  }
})