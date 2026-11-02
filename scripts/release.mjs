// Đóng gói bản gửi mạng quảng cáo cho 1 kịch bản: build → đóng gói theo networks.json (html | zip) → manifest.
// Dùng:  npm run release -- PLA-01                       → mọi mạng (trừ preview)
//        npm run release -- PLA-01 --network applovin,meta
// Ra:    release/<ID>/<YYYYMMDD>-<sha>/<ID>_<mạng>_<YYYYMMDD>-<sha>.html|zip + manifest.md
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { zipSync } from 'fflate';

const networks = JSON.parse(readFileSync(new URL('../networks.json', import.meta.url), 'utf8'));
delete networks._note;

const id = process.argv[2];
if (!id || !/^PLA-\d+$/.test(id)) { console.error('Dùng: npm run release -- PLA-xx [--network a,b]'); process.exit(2); }
if (!existsSync(`docs/scenarios/${id}.md`)) { console.error(`Không có kịch bản docs/scenarios/${id}.md`); process.exit(2); }

const i = process.argv.indexOf('--network');
const targets = i >= 0 ? process.argv[i + 1].split(',') : Object.keys(networks).filter((n) => n !== 'preview');
for (const n of targets) if (!networks[n]) { console.error(`Không có mạng "${n}" trong networks.json`); process.exit(2); }

const git = (cmd) => execSync(`git ${cmd}`, { encoding: 'utf8' }).trim();
const sha = git('rev-parse --short HEAD');
const dirty = git('status --porcelain -- src index.html vite.config.ts networks.json package.json') !== '';
const d = new Date();
const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
const version = `${date}-${sha}${dirty ? '-dirty' : ''}`;

execSync(`node scripts/build.mjs --network ${targets.join(',')}`, { stdio: 'inherit' });

const outDir = `release/${id}/${version}`;
mkdirSync(outDir, { recursive: true });

const rows = [];
let failed = 0;
for (const n of targets) {
  const { pack, maxBytes } = networks[n];
  const src = `dist/${n}/index.html`;
  const file = `${id}_${n}_${version}.${pack}`;
  const dest = `${outDir}/${file}`;
  if (pack === 'zip') writeFileSync(dest, zipSync({ 'index.html': readFileSync(src) }, { level: 9 }));
  else copyFileSync(src, dest);
  const bytes = statSync(dest).size;
  const ok = bytes <= maxBytes;
  if (!ok) failed++;
  rows.push(`| ${n} | \`${file}\` | ${(bytes / 1048576).toFixed(2)} MB | ${(maxBytes / 1048576).toFixed(2)} MB | ${ok ? 'OK' : '**FAIL**'} | ☐ |`);
}

writeFileSync(`${outDir}/manifest.md`, `# ${id} · ${version}

- Commit: \`${sha}\`${dirty ? ' — **có thay đổi chưa commit** trong src / cấu hình, không dùng bản này để nộp' : ''}
- Ngày build: ${d.toISOString()}
- Kịch bản: \`docs/scenarios/${id}.md\`

| Mạng | Tệp | Dung lượng | Giới hạn | Kết quả | Đã thử trên tool preview của mạng |
|---|---|---|---|---|---|
${rows.join('\n')}

## Trước khi gửi
- [ ] Store URL trong \`src/config.ts\` đúng (Google: khai báo URL trên Google Ads)
- [ ] Mỗi tệp đã thử trên tool preview / tester của mạng tương ứng: CTA mở store, không lỗi console
- [ ] QA đã pass AC của ${id}, Lead đã review đạt
`);

console.log(`\n${failed ? 'FAIL' : 'OK'} → ${outDir}/ (manifest.md)${dirty ? '  ⚠ có thay đổi chưa commit' : ''}`);
process.exit(failed ? 1 : 0);
