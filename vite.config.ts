import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // This makes process.env.API_KEY available in the browser code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  },
  server: {
    port: 3000
  }

});




