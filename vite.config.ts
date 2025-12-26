import { defineConfig } from "vite"
import path from "path"

import { viteZip } from 'vite-plugin-zip-file';
import { fileURLToPath } from 'url';
import { env } from 'node:process';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 5000,
    watch: {
      usePolling: true
    }
  },

  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~bootstrap-icons': path.resolve(__dirname, 'node_modules/bootstrap-icons'),
    }
  },

  plugins: [
    viteZip({
      folderPath: path.resolve(__dirname, 'dist'),
      outPath: path.resolve(__dirname),
      zipName: 'dist.zip',
      enabled: env.NODE_ENV === 'production'? true : false
    })
  ],

  // for bootstrap scss deprecation warning logs
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
      },
    }
  },

  base: process.env.NODE_ENV === "production" ? "/Attendance-GUI/" : "/",
})
