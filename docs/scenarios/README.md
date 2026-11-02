# Kịch bản PLA

Mỗi playable có một file `PLA-xx.md` trong thư mục này. Đây là storyboard theo từng giây, không phải GDD. Khối GD của Office Desk đọc file kịch bản rồi viết US/AC; các khối khác làm theo AC đó.

| ID | Tên | Trạng thái |
|---|---|---|
| [PLA-01](PLA-01.md) | Merge to save the castle | nháp |

Ý tưởng để A/B sau: **PLA-02 "Fail bait"** (người chơi thua sát nút → "Only 1% can win") · **PLA-03 "Awaken"** (khoe Lính 3 sao awaken đổi hình).

## Nguyên tắc

- Dài **15–30 giây**. Người chơi được chạm lần đầu trong **3 giây đầu**.
- **Mỗi nhịp một thao tác** (chạm / kéo / chọn), luôn có bàn tay hướng dẫn chỉ vào chỗ cần làm.
- **Không phụ thuộc chữ và âm thanh**: chữ tối đa khoảng 5 từ, tiếng Anh; nhiều mạng mở playable ở chế độ tắt tiếng.
- **Khoe một khoảnh khắc "đã tay"** của game, không dạy hết hệ thống. Với Purrge! là merge Lính → Lính lớn lên, đổi ngoại hình, bắn mạnh hơn hẳn.
- **Nhánh phụ bắt buộc**: idle khoảng 3 giây → bàn tay chỉ lại; thắng hoặc thua đều sang end card; hết `PLAY_SECONDS` → ép sang end card.
- **CTA ở mọi màn**; end card chạm chỗ nào cũng mở store.
- Hiển thị đúng ở cả màn dọc (thiết kế chính 720×1280) và màn ngang (Phaser `FIT`, có viền hai bên).
- Asset lấy từ BaseTD (chỉ đọc), tối ưu theo README § Asset. Cả file HTML phải nằm trong giới hạn của mạng nhỏ nhất sẽ nộp.

## Mẫu

```markdown
# PLA-xx · <tên>

> Trạng thái: nháp | chốt · Thời lượng: … giây · Hướng: dọc

## Hook và thông điệp
- Hook (3 giây đầu): …
- Thông điệp bán hàng: …

## Storyboard
| # | Giây | Màn hình | Người chơi làm | Game phản hồi | Asset | Âm thanh |
|---|---|---|---|---|---|---|

## Nhánh
- Idle: …
- Thua: …
- Hết giờ: …

## End card
Logo, câu CTA, nút; chạm bất kỳ đâu → store.

## Asset
| Asset | Nguồn trong BaseTD | Trạng thái (có sẵn / cần kiểm tra / làm mới) |
|---|---|---|

## Tham số
`PLAY_SECONDS`, số merge để sang end card, tốc độ quái…

## Câu hỏi chưa chốt
- ❓ …

## Acceptance Criteria
- AC-1 …
```
