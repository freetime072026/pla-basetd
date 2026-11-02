import { defineConfig, type Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import networks from './networks.json';

type Network = keyof typeof networks;

// Mạng lấy từ biến môi trường PLA_NETWORK (scripts/build.mjs đặt); dev mặc định "preview".
const network = (process.env.PLA_NETWORK ?? 'preview') as Network;
if (!(network in networks) || network === ('_note' as Network)) {
  throw new Error(`PLA_NETWORK không hợp lệ: ${network}`);
}
const api = (networks[network] as { api: string }).api;

// Thẻ script SDK mà mạng tự cấp lúc chạy — không nhúng, chỉ khai báo trong <head>.
const HEAD_SCRIPTS: Record<string, string> = {
  mraid: '<script src="mraid.js"></script>',
  google: '<meta name="ad.orientation" content="portrait">\n    <script type="text/javascript" src="https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js"></script>',
};

function adHead(): Plugin {
  return {
    name: 'pla-ad-head',
    transformIndexHtml(html) {
      const tag = HEAD_SCRIPTS[api];
      return tag ? html.replace('<!-- AD_HEAD -->', tag) : html;
    },
  };
}

export default defineConfig({
  base: './',
  define: {
    __PLA_NETWORK__: JSON.stringify(network),
    __PLA_API__: JSON.stringify(api),
  },
  plugins: [adHead(), viteSingleFile({ removeViteModuleLoader: true })],
  build: {
    outDir: `dist/${network}`,
    emptyOutDir: true,
    target: 'es2018',
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    chunkSizeWarningLimit: 5000,
  },
});
