import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/Todo/', // 👈 обязательно с косыми чертами
  plugins: [react()],
});
