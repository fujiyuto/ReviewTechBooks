import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    // テスト間でモックの呼び出し履歴などをリセットする
    clearMocks: true,
    // @testing-library/react の cleanup を非グローバルモードで機能させる
    setupFiles: ['./test/setup.ts'],
  },
})