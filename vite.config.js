import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to GitHub Pages under a repo subpath, set base to '/REPO_NAME/'.
// For Vercel/Netlify, leave base as '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
