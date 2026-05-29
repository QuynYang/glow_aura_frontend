import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    
    // Nếu ở chế độ production (khi build lên GitHub Pages), base sẽ là '/glow_aura_frontend/'
    // Khi bạn chạy 'npm run dev' (local), mode sẽ là 'development' và base sẽ là '/'
    base: mode === 'production' ? '/glow_aura_frontend/' : '/',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})