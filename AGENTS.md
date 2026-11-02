# pla-basetd — AGENTS.md

> **Bắt buộc: đọc [README.md](README.md) trước khi làm bất cứ việc gì** (lệnh, cấu trúc, mạng quảng cáo, asset, quy ước).
> Game gốc (Unity): `E:\FreeTimes\BaseTD` — **chỉ đọc** để lấy thiết kế / asset; không sửa gì trong repo đó.

- Engine: Phaser 3 + TypeScript + Vite. Không dùng Unity, Animator, AudioMixer hay import setting của Unity ở đây.
- Xong việc phải chạy `npm run typecheck` và `npm run build`. Cả hai phải sạch, và mọi mạng đều phải OK dung lượng.
- Sửa code hoặc cấu trúc thì cập nhật README.md trong cùng commit.
- `CLAUDE.md` và `AGENTS.md` phải giống nhau (chỉ khác tiêu đề). Sửa file này thì sửa luôn file kia.

## Theo role (Office Desk preset PLA)
- **Art**: xuất ảnh vào `src/assets/` ở dạng đã tối ưu (xem README § Asset). Không đẩy ảnh lên Penpot, không chạy `penpot_sync.py`. Handoff phải ghi kích thước và dung lượng từng tệp.
- **Anim**: làm animation Phaser (`this.anims.create` từ spritesheet / atlas) và tween. Handoff ghi số frame, fps, key animation.
- **Sound**: dùng mp3 mono ngắn đặt trong `src/assets/`, nhạc loop không có khoảng hở. Handoff ghi độ dài, dung lượng, sự kiện phát.
- **Dev**: chỉ sửa trong repo này. Mọi lời gọi SDK mạng đi qua `src/ad/ad.ts`.
- **QA**: kiểm bằng `npm run dev` + trình duyệt (khung dọc 720×1280 và một màn ngang). Bản build `dist/<mạng>/index.html` phải mở được không cần server. Kiểm CTA và dung lượng theo bảng của `npm run build`.
