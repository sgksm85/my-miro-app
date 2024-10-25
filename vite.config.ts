import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // ターゲットを esnext に設定
  },
  esbuild: {
    target: 'esnext', // esbuild のターゲットも esnext に設定
  },
});