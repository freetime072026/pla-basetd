# PLA-01 · Merge to save the castle

> Trạng thái: **nháp** · Thời lượng: khoảng 25 giây · Hướng: dọc (720×1280)
> Nguồn gameplay: BaseTD `gdd/00-overview.md`, `gdd/01-gameplay/core-mechanics.md` (rút gọn, không cần khớp số liệu).

## Hook và thông điệp
- **Hook (3 giây đầu):** quái tràn xuống đập tường thành, HP tường nhấp nháy đỏ. Người chơi phải ra tay ngay.
- **Thông điệp:** merge mèo chiến binh → đội hình lớn dần, mạnh dần, cứu được lâu đài.

## Storyboard
| # | Giây | Màn hình | Người chơi làm | Game phản hồi | Asset | Âm thanh |
|---|---|---|---|---|---|---|
| 1 | 0–3 | Quái tràn từ mép trên xuống, đập tường ở mép dưới; HP tường nhấp nháy đỏ; chữ **"Save the castle!"** | — (bàn tay chỉ vào viên EXP vừa rơi) | Hero bắn, quái chết, rơi viên EXP | hero, quái, tường, nền, viên EXP, bàn tay | nhạc nền, tiếng bắn, quái chết |
| 2 | 3–6 | Các viên EXP nằm trên chiến trường | **Chạm** màn hình | Thu hết EXP, thanh EXP đầy → game dừng, hiện **3 card Lính** | thanh EXP, card draft | thu EXP, thanh đầy |
| 3 | 6–9 | Draft 1 trong 3 | **Chọn** 1 card (bàn tay chỉ card đã định sẵn) | Lính cấp 1 hiện trên ô đứng. Thanh EXP đầy lần 2 rất nhanh → chọn tiếp → có **2 Lính giống nhau** | sprite Lính cấp 1 | chọn card, Lính xuất hiện |
| 4 | 9–14 | Hai Lính cùng loại, cùng cấp đứng cạnh nhau | **Kéo** Lính này chồng lên Lính kia (bàn tay vẽ đường kéo) | **Merge**: chớp sáng, Lính lên cấp 2, đổi ngoại hình, đạn to hơn, quái chết nhanh hẳn | sprite Lính cấp 2, VFX merge | merge "đã tai" |
| 5 | 14–20 | **Boss** xuất hiện, tường còn ít HP | Merge thêm lên cấp 3 **hoặc** chọn card buff hero | Lính cấp 3 / skill hero quét sạch màn, boss gục | boss, sprite Lính cấp 3, VFX skill | boss xuất hiện, skill nổ |
| 6 | 20–25 | **"VICTORY"** | — | Tự sang end card sau khoảng 1,5 giây | chữ Victory, pháo hoa | thắng |
| 7 | End | Logo Purrge!, đội hình mèo, nút **PLAY NOW** | Chạm bất kỳ đâu | `openStore()` | logo, art end card, nút CTA | — |

## Nhánh
- **Idle:** không chạm trong 3 giây → bàn tay chỉ lại đúng thao tác của nhịp hiện tại, kèm nhịp phóng to/thu nhỏ.
- **Thua:** HP tường về 0 (người chơi không merge) → tường vỡ, chữ **"Can you do better?"** → end card.
- **Hết giờ:** hết `PLAY_SECONDS` ở bất kỳ nhịp nào → end card.
- **Chạm CTA giữa chừng:** nút PLAY NOW luôn hiện ở đáy màn chơi → `openStore()`.

## End card
Nền tối mờ, logo Purrge!, 3–4 mèo chiến binh đứng cạnh hero, nút **PLAY NOW** nhịp phóng to/thu nhỏ. Chạm bất kỳ đâu → `openStore()`; gọi `gameEnd()` khi vào màn.

## Asset
Đường dẫn tính từ `E:\FreeTimes\BaseTD\` (chỉ đọc, xuất bản đã tối ưu vào `src/assets/`).

| Asset | Nguồn | Trạng thái |
|---|---|---|
| Hero (idle, đánh) | `ArtGen/hero_sprite/Processed/HR005/` (sheet + `playback.json`) hoặc `Assets/_ProjectAssets/_Art/GeneratedHeroes/HR005/` | có sẵn, chọn hero ❓ |
| Lính cấp 1–3 | `Assets/_ProjectAssets/_Art/Soldiers/` (`soldier_SD###`, 240×288) · `SoldierConfig.LevelIcons` · `_Art/GeneratedSoldiers/SD001/` | có sẵn, cần kiểm tra đủ 3 cấp cho Lính được chọn |
| Quái thường + boss | `Assets/_ProjectAssets/_Art/Enemies/Sheets/sheet_en0xx.png` (+ `AnimSets/`) | có sẵn, chọn loại ❓ |
| Nền chiến trường, tường thành | — | cần kiểm tra trong BaseTD, thiếu thì làm mới |
| Card draft, thanh EXP | `Assets/_ProjectAssets/_UI/Sprites/Popup/pp_*` · `_Art/DraftIcons/` | có sẵn |
| VFX merge / skill / viên EXP | `Assets/_ProjectAssets/_Art/VFX/`, `VFXSheets/` | cần kiểm tra |
| Bàn tay hướng dẫn | — | làm mới |
| Logo Purrge! | `Assets/_ProjectAssets/_Art/AppIcon/` (icon app) | logo chữ chưa có — chủ dự án quyết ❓ |
| Âm thanh (nhạc nền loop + khoảng 8 SFX) | BaseTD chưa có file audio | làm mới |

## Tham số
| Tham số | Giá trị đề xuất | Chỗ đặt |
|---|---|---|
| `PLAY_SECONDS` | 25 | `src/config.ts` |
| Ngưỡng EXP lần 1 / lần 2 | 3 quái / 2 quái | GameScene |
| Số merge để sang Victory | 2 (cấp 3) hoặc hạ boss | GameScene |
| Tốc độ quái | đủ chậm để người chơi mới vẫn thắng nếu làm theo tay chỉ | GameScene |

## Câu hỏi chưa chốt
- ❓ Hero chính: tạm HR005 (Lightning Witch) vì đã có animation.
- ❓ Lính được merge: chọn loại có 3 cấp ngoại hình khác biệt rõ nhất.
- ❓ Quái thường + boss nào.
- ❓ Kết thúc bằng thắng (mặc định) hay cố ý thua (để PLA-02).
- ❓ Logo / tên trên end card.

## Acceptance Criteria
- **AC-1** Trong 3 giây đầu có bàn tay hướng dẫn và người chơi chạm được.
- **AC-2** Chạm thu EXP → hiện 3 card; chọn card → Lính cấp 1 xuất hiện trên ô.
- **AC-3** Kéo 2 Lính cùng loại cùng cấp → merge thành 1 Lính cấp +1, ngoại hình khác, sát thương tăng thấy rõ.
- **AC-4** Idle 3 giây ở bất kỳ nhịp nào → bàn tay chỉ lại thao tác đúng.
- **AC-5** Thắng, thua hoặc hết `PLAY_SECONDS` đều sang end card; end card chạm bất kỳ đâu gọi `openStore()`.
- **AC-6** Nút CTA hiện trong suốt màn chơi và gọi `openStore()`.
- **AC-7** Hiển thị đúng ở 720×1280 và màn ngang; không lỗi console.
- **AC-8** `npm run build` OK dung lượng cho mọi mạng trong `networks.json`.
