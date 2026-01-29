import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/react-todo/' // <- важно! название твоего репозитория на GitHub
})
