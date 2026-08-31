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
  // CRITIQUE : force les chemins d'assets générés en relatif ('./xyz.png') plutôt qu'absolu ('/xyz.png').
  // Sans ça, tout chemin absolu casse une fois le HTML chargé via file:// en production.
  base: './',
  build: {
    // L'app est chargée en local (file://) : la taille de chunk n'a pas d'impact réseau.
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          parsers: ['yaml', 'marked', 'dompurify', 'cronstrue'],
          vendor: ['qrcode', 'cmdk', 'lucide-react'],
        },
      },
    },
  },
});
