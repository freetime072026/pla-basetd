# pla-basetd

Playable Ads (PLA) cho **BaseTD / Purrge!** (game Unity ở `E:\FreeTimes\BaseTD`). Viết bằng Phaser 3 + TypeScript, build ra **một file HTML duy nhất** cho mỗi mạng quảng cáo. Asset được nhúng sẵn, file không tải gì từ mạng ngoài.

## Lệnh

```bash
npm install
npm run dev                       # http://localhost:5173 — mạng "preview", CTA mở tab store
npm run build                     # mọi mạng → dist/<mạng>/index.html + kiểm dung lượng
npm run build:one -- applovin     # 1 mạng (hoặc applovin,meta)
npm run typecheck
npm run release -- PLA-01         # bản gửi mạng quảng cáo → release/PLA-01/<ngày>-<sha>/
```

`build` và `release` thoát với mã 1 nếu có file vượt giới hạn dung lượng của mạng.

## Bản gửi (release)

`npm run release -- PLA-xx [--network a,b]` build lại các mạng rồi đóng gói theo `pack` trong `networks.json`. Mạng `html` nhận 1 file HTML; mạng `zip` nhận zip có `index.html` ở gốc. Kết quả:

```
release/PLA-01/20261102-88438c3/
  PLA-01_applovin_20261102-88438c3.html
  PLA-01_google_20261102-88438c3.zip
  …
  manifest.md      ← bảng dung lượng + checklist trước khi gửi
```

- Tên phiên bản = ngày + commit. Nếu `src` hoặc cấu hình còn thay đổi chưa commit, tên có thêm `-dirty` và manifest ghi rõ không dùng bản đó để nộp. Phải commit trước rồi mới release.
- `release/` không commit. Gửi các tệp trong đó cho UA hoặc tải lên mạng quảng cáo; việc nộp lên mạng do người làm.
- Trước khi gửi, thử từng tệp trên tool preview / tester của mạng tương ứng và đánh dấu cột cuối của manifest.

## Cấu trúc

| Đường dẫn | Vai trò |
|---|---|
| `networks.json` | Danh sách mạng: `api` (cách gọi CTA), `maxBytes` (giới hạn tệp nộp), `pack` (`html` / `zip`) |
| `vite.config.ts` | Đọc `PLA_NETWORK`, chèn thẻ SDK của mạng vào `<head>` (`mraid.js`, Google `exitapi.js`), nhúng mọi thứ thành 1 file |
| `scripts/build.mjs` | Build lần lượt từng mạng rồi in bảng dung lượng OK/FAIL |
| `scripts/release.mjs` | Đóng gói bản gửi cho 1 kịch bản (html / zip theo mạng) + `manifest.md` |
| `src/config.ts` | Store URL, khung thiết kế 720×1280, `PLAY_SECONDS` |
| `src/ad/ad.ts` | **Lớp mạng quảng cáo**: `whenReady`, `gameStart`, `gameEnd`, `openStore`, `notifyLoaded`. Game chỉ gọi các hàm này |
| `src/scenes/` | `BootScene` (nạp asset) → `GameScene` (chơi) → `EndScene` (end card + CTA) |
| `src/ui/cta.ts` | Nút CTA dùng chung |
| `src/assets/` | Ảnh/âm thanh đã tối ưu cho web (chưa có; xem § Asset) |
| `docs/scenarios/` | Kịch bản từng playable (`PLA-xx.md`): nguyên tắc, mẫu, storyboard, AC — [docs/scenarios/README.md](docs/scenarios/README.md) |

## Mạng quảng cáo

| api | Mạng | CTA | Ghi chú |
|---|---|---|---|
| `mraid` | AppLovin, Unity Ads, ironSource | `mraid.open(url)` | Chờ `ready` + `viewableChange` rồi mới chạy |
| `mintegral` | Mintegral | `window.install()` | Gọi `gameReady` / `gameStart` / `gameEnd` |
| `meta` | Meta (Facebook) | `FbPlayableAd.onCTAClick()` | Giới hạn 2 MB |
| `google` | Google Ads | `ExitApi.exit()` | Store URL khai báo trên Google Ads, không nằm trong code; có `<meta name="ad.orientation">` |
| `preview` | dev | `window.open` | Chỉ dùng khi chạy local |

Giới hạn dung lượng trong `networks.json` chỉ là số tham khảo. **Trước khi nộp, đối chiếu lại spec mới nhất của từng mạng** và chạy thử bằng công cụ preview của mạng đó.

## Asset

- Nguồn ảnh lấy từ repo BaseTD: hero (`ArtGen/hero_sprite/Processed/<HR>/`, sheet + `playback.json`), lính (`Assets/_ProjectAssets/_Art/Soldiers/`, 240×288), UI popup (`Assets/_ProjectAssets/_UI/Sprites/Popup/pp_*`).
- Đưa vào `src/assets/` ở dạng đã tối ưu: thu nhỏ theo khung 720×1280, ghép atlas, ưu tiên webp, mỗi animation chỉ giữ các frame cần thiết. Không đưa ảnh master 1024+ vào.
- Âm thanh: BaseTD chưa có file audio nào, nên phải làm mới. Dùng mp3 mono, ngắn, gồm 1 nhạc nền loop và vài SFX. Khi có âm thanh thì bỏ `audio: { noAudio: true }` trong `src/main.ts`. Chỉ phát âm thanh sau lần chạm đầu tiên.
- Import trong code: `import url from '../assets/x.webp'` rồi gọi `this.load.image('x', url)`. Vite sẽ nhúng thành data URL.
- Ngân sách: cả file HTML phải ≤ `maxBytes` của mạng **nhỏ nhất** sẽ nộp. Riêng Phaser (minified) đã chiếm khoảng 1,2 MB.

## Quy ước

- Comment, log và doc viết tiếng Việt; tên trong code viết tiếng Anh. Field private đặt `_camelCase`.
- Game không gọi SDK mạng trực tiếp, mọi lời gọi đi qua `src/ad/ad.ts`.
- Mỗi màn hình đều có CTA. End card bấm chỗ nào cũng mở store.
- Không gọi `fetch` hay tải tài nguyên từ URL ngoài, trừ thẻ SDK mà `vite.config.ts` chèn.
- Không cấp phát object mới mỗi frame trong `update()`, để giữ mượt trên máy yếu.
