import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
  },
  esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
  }
 
});
