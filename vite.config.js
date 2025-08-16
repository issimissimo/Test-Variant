import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { resolve } from 'path'

export default defineConfig({
  base: './',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../build',
    emptyOutDir: true,
  },
  server: {
    // Non cambiare porta automaticamente: ci serve sapere sempre
    // quale porta usa il dev-server
    strictPort: true,
    // Ascolta su tutte le interfacce di rete (LAN, localhost, ecc.)
    host: '0.0.0.0',
    // Accetta tutti i sottodomini di trycloudflare.com
    // la stringa che inizia con '.' abilita il wildcard matching
    allowedHosts: ['.trycloudflare.com'],
  },
  plugins: [solid()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ui': resolve(__dirname, './src/ui'),
      '@components': resolve(__dirname, './src/components'),
      '@xr': resolve(__dirname, './src/xr'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@arSession': resolve(__dirname, './src/components/arSession'),
      '@games': resolve(__dirname, './src/components/arSession/games'),
    }
  }
});
