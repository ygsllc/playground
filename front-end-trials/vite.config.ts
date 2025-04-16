import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://10.0.0.30:5678',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/webhook/chat-api'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.method === 'OPTIONS') {
              proxyReq.method = 'OPTIONS';
              res.statusCode = 200;
            } else {
              proxyReq.method = 'POST';
            }
          });
        }
      }
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-site',
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https:;
        connect-src 'self' ws: http://localhost:* http://10.0.0.30:5678;
      `.replace(/\s+/g, ' ').trim()
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@chakra-ui/react'],
        },
      },
    },
  },
})