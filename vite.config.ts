import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 443,
    host: '0.0.0.0', // Listen on all addresses
    strictPort: true, // Fail if port is already in use
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem'))
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // backend port
        changeOrigin: true,
        secure: false,
      },
    },
  }
});