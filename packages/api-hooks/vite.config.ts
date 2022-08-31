/// <reference types="vitest" />
import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  optimizeDeps: {
    include: [
      "@formulaic/base-fp",
    ],
  },
  build: {
    commonjsOptions: {
      include: [
        /fp\/dist/,
        /node_modules/,
      ],
    },
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.ts"),
      name: "ApiHooks",
      formats: ["es", "umd"],
      fileName: format => `api-hooks.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    environment: "jsdom",
  },
});
