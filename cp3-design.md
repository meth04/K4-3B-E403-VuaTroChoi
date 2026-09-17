# CP3 — Thiết kế video thao tác 30 giây + số đo

## 1. Mục tiêu

Chứng minh prototype VuaTroChoi có thể đọc một phạm vi bài học, sinh một câu hỏi trắc nghiệm có provenance, và để giảng viên duyệt trước khi lưu.

CP3 nộp hai thứ:

- Video quay màn hình dài tối đa 30 giây.
- Bảng số đo trên cùng một bộ thử, ghi rõ thử bao nhiêu và đạt bao nhiêu.

## 2. Kịch bản video 30 giây

| Thời gian | Thao tác trên prototype | Điều cần nhìn thấy |
| --- | --- | --- |
| 0–4s | Mở màn hình tạo quiz, chọn bài học | Tên bài học và nút bắt đầu |
| 4–8s | Chọn phạm vi transcript/slide | Phạm vi dữ liệu được chọn |
| 8–13s | Bấm **Sinh câu hỏi** | Trạng thái đang phân tích |
| 13–20s | Hệ thống hiển thị câu hỏi, đáp án và giải thích | Kết quả sinh thật, không dùng ảnh tĩnh |
| 20–24s | Mở phần **Nguồn căn cứ** | Mã `[Txx-NNN]` hoặc trang slide |
| 24–27s | Bấm **Duyệt** hoặc **Sửa** | Giảng viên vẫn là người quyết định |
| 27–30s | Lưu vào ngân hàng câu hỏi | Trạng thái đã lưu/thành công |

### Quy tắc quay

- Quay một đường đi liên tục từ chọn bài đến lưu câu hỏi.
- Không cần lồng tiếng; có thể thêm chữ ngắn ở đầu video: `Sinh quiz có nguồn trong 30 giây`.
- Phóng to vùng thao tác để thấy câu hỏi và provenance.
- Nếu AI chạy lâu, dùng dữ liệu đã chuẩn bị sẵn hoặc bản demo local, nhưng kết quả phải là kết quả thật của prototype.
- Xuất MP4, giữ thời lượng khoảng 25–30 giây để không vượt giới hạn.

## 3. Bộ thử và định nghĩa đạt

Chạy **20 case** trước khi quay video, gồm:

| Nhóm case | Số lượng | Mục đích |
| --- | ---: | --- |
| Nội dung có nguồn rõ, concept đủ quan hệ | 10 | Đo khả năng sinh câu hỏi bình thường |
| Nội dung có nguồn nhưng concept mơ hồ/thiếu quan hệ | 4 | Đo cảnh báo low-confidence |
| Câu hỏi yêu cầu thông tin ngoài phạm vi | 3 | Đo khả năng không bịa/không vượt scope |
| Case cần chi tiết domain hoặc nhiều đoạn nguồn | 3 | Đo việc gắn đúng nhiều provenance |
| **Tổng** | **20** | |

### Một case đạt khi đồng thời thỏa 4 điều

1. Câu hỏi và đáp án bám đúng nội dung nguồn.
2. Đáp án đúng được xác định rõ, không có nhiều đáp án đúng ngoài ý định.
3. Mỗi claim quan trọng có mã transcript hoặc trang slide kiểm tra được.
4. Case ngoài phạm vi/thiếu căn cứ được cảnh báo hoặc từ chối, không tự bịa.

### Bảng ghi kết quả

| Mã case | Loại | Kết quả | Có nguồn đúng? | Đạt? | Lý do nếu không đạt |
| --- | --- | --- | --- | --- | --- |
| C01–C20 | Theo bộ phân loại trên | Sinh / cảnh báo / từ chối | Có / Không | Có / Không | Ghi ngắn gọn |

Các số cần báo cáo trong CP3:

- **Tổng số case:** 20.
- **Số case đạt:** `___/20`.
- **Tỷ lệ đạt:** `___%`.
- **Số case có provenance đúng:** `___/20`.
- **Số case ngoài phạm vi được chặn đúng:** `___/3`.
- **Số lỗi theo nguyên nhân:** thiếu nguồn `___`, sai đáp án `___`, vượt phạm vi `___`, lỗi khác `___`.

Không thay số bằng các từ như “tốt”, “nhanh” hoặc “độ chính xác cao”. Nếu kết quả thấp, giữ nguyên số thật và ghi nguyên nhân để làm đầu vào cho CP4.

## 4. Quality bar tạm thời cho CP3

Đây là chuẩn để đọc kết quả ở CP3, chưa thay thế quality bar phải khóa trong `spec.md` tại CP4:

> Thử 20 case; prototype được xem là có tín hiệu đạt nếu ít nhất 16 case đạt, ít nhất 18/20 case có provenance kiểm tra được, và 3/3 case ngoài phạm vi không tạo câu trả lời khẳng định không có căn cứ.

## 5. Phân công quay và đo

| Người | Việc trong CP3 |
| --- | --- |
| Nguyễn Văn Thân | Điều phối, bấm happy path, chốt bảng số đo và lời trình bày |
| Nguyễn Ngọc Linh | Chuẩn bị 20 case, kiểm tra provenance, điền kết quả đánh giá |
| Dương Hà Đức Anh | Hoàn thiện màn hình prototype, quay video và xuất file dự phòng |

## 6. Checklist trước khi nộp

- [ ] Video dài không quá 30 giây.
- [ ] Video có đủ chọn bài, sinh câu hỏi, xem nguồn và duyệt/lưu.
- [ ] Kết quả trong video là output thật của prototype.
- [ ] Có bảng 20 case và tiêu chí đạt rõ ràng.
- [ ] Có cả số đạt, tỷ lệ đạt và nhóm lỗi.
- [ ] Số liệu trong video, bảng đo và phần trình bày khớp nhau.
- [ ] Đội trưởng nộp đúng form CP3 trước 16:00 ngày 18/9.
