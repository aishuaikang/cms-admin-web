import { defineConfig, loadEnv } from 'vite';
import removeConsole from 'vite-plugin-remove-console';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';

const devEnv = loadEnv('development', './');

export default defineConfig({
  server: {
    proxy: {
      [devEnv.VITE_BASE_API]: {
        // target: 'http://127.0.0.1:3000',
        // target: 'http://192.168.100.241:3001',
        target: 'http://127.0.0.1:3000',
        // rewrite: (path) => path.replace(devEnv.VITE_BASE_API, ''),
        changeOrigin: true,
      },
      //   [devEnv.VITE_BASE_API + '/account']: {
      //     target: 'http://10.8.8.20:9001',
      //     rewrite: (path) => path.replace(devEnv.VITE_BASE_API, ''),
      //   },
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    removeConsole(),
    TanStackRouterVite({ autoCodeSplitting: true }),
    legacy({
      targets: [
        '> 0.2%, last 1 version, ie >= 11',
        'safari >= 10',
        'Android > 39',
        'Chrome >= 60',
        'Safari >= 10.1',
        'iOS >= 10.3',
        'Firefox >= 54',
        'Edge >= 15',
        'not dead',
      ],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
      modernPolyfills: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "./src/styles/_variables.scss";
          @use "./src/styles/_keyframe-animations.scss";
        `,
      },
    },
  },
});
