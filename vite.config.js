import WindiCSS from 'vite-plugin-windicss';

export default {
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
  plugins: [WindiCSS()],
  rollupOptions: {
    input: './src/index.js',
  },
};
