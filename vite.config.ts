import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  build: {
    outDir: "build", // Устанавливаем директорию сборки на 'build'
  },
  base: "/todolist-20-Advanced_cache_tags-Optimistic_update/", // Установите базовый путь для GitHub Pages
});
