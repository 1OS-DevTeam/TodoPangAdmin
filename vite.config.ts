import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.VITE_BASE_URL,
    define: {
      "import.meta.env.BASE_URL": JSON.stringify(env.VITE_BASE_URL),
    },
    plugins: [react()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, "./src"),
      },
    },
  };
});
