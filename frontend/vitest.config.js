import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/cinscreve/", // Caminho base para o frontend
  preview: {
    port: 5002, // Porta do frontend no ambiente de preview
    strictPort: true,
  },
  server: {
    port: 5002, // Porta do servidor de desenvolvimento
    strictPort: true,
    host: true, // Permite acesso externo
    origin: "http://0.0.0.0:5002", // Origem para o servidor
  },
});
