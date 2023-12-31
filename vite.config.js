import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@welldone-software/why-did-you-render',
    }),
  ],
  resolve: {
    alias: {
      '@Common': path.resolve(__dirname, './src/Common'),
      '@Core': path.resolve(__dirname, './src/Core'),
      '@Fixtures': path.resolve(__dirname, './src/Fixtures'),
      '@Theme': path.resolve(__dirname, './src/Theme'),
      '@Vehicles': path.resolve(__dirname, './src/Vehicles')
    },
  },
})
