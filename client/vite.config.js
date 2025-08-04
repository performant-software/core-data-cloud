import { flowPlugin, esbuildFlowPlugin } from '@bunchtogether/vite-plugin-flow';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      outDir: 'build'
    },
    esbuild: {
      include: /\.js$/,
      exclude: [],
      loader: 'jsx'
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [esbuildFlowPlugin()]
      }
    },
    plugins: [
      react(),
      flowPlugin()
    ],
    server: {
      open: true,
      port: env.VITE_PORT || 3000,
      proxy: {
        '/auth': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          secure: false
        },
        '/core_data': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          secure: false
        },
        '/sidekiq': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          secure: false
        },
        '/user_defined_fields': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});