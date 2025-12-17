import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // sockjs-client가 Node.js의 global 객체를 참조하는 문제 해결
    global: 'globalThis',
  },
  server: {

    host: true,
  }
})
