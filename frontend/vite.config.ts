import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('=== DEBUG VITE_API_URL ===', env.VITE_API_URL)
  console.log('=== DEBUG process.env.VITE_API_URL ===', process.env.VITE_API_URL)

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/hubs': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          ws: true,
        }
      }
    }
  }
})