import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@Common': path.resolve(__dirname, './src/Common'),
      '@Fixtures': path.resolve(__dirname, './src/Fixtures'),
      '@Theme': path.resolve(__dirname, './src/Theme'),
      '@Vehicles': path.resolve(__dirname, './src/Vehicles')
    },
  },
})
