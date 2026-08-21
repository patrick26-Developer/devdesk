import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // publicDir : le contenu de ce dossier est copié tel quel à la racine du build et servi tel quel en dev.
  // Par défaut Vite cherche un dossier "public", mais le tien s'appelle "assets" — on le précise explicitement.
  publicDir: path.resolve(__dirname, './assets'),
});