import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    commonjsOptions: {
      include: [
        /acl\/dist/,
        /node_modules/,
      ],
    },
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'Formulaic',
      formats: ['es', 'umd'],
      fileName: format => `formulaic.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
