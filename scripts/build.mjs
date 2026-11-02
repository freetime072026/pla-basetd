// Build PLA: mỗi mạng 1 file dist/<mạng>/index.html, rồi kiểm dung lượng theo networks.json.
// Dùng:  npm run build                 → mọi mạng
//        npm run build:one -- applovin → 1 mạng
import { execSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

const networks = JSON.parse(readFileSync(new URL('../networks.json', import.meta.url), 'utf8'));
delete networks._note;

const i = process.argv.indexOf('--network');
const only = i >= 0 ? process.argv[i + 1] : null;
const targets = only ? [only] : Object.keys(networks).filter((n) => n !== 'preview');
for (const n of targets) if (!networks[n]) { console.error(`Không có mạng "${n}" trong networks.json`); process.exit(2); }

let failed = 0;
for (const n of targets) {
  execSync('npx vite build --logLevel warn', { stdio: 'inherit', env: { ...process.env, PLA_NETWORK: n } });
  const bytes = statSync(`dist/${n}/index.html`).size;
  const max = networks[n].maxBytes;
  const ok = bytes <= max;
  if (!ok) failed++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${n.padEnd(11)} ${(bytes / 1048576).toFixed(2)} MB / ${(max / 1048576).toFixed(2)} MB`);
}
process.exit(failed ? 1 : 0);
