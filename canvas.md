# Canvas 7 dòng (CP1) - Nhóm VuaTroChoi

| # | Dòng | Nội dung |
|---|---|---|
| 1 | Track + đề | C1 · Knowledge-to-Lesson (Sinh Quiz từ Graph tri thức) |
| 2 | Job executor (ai · đang ở đâu · làm gì) | Giảng viên/người viết nội dung đang chuẩn bị bài tập trắc nghiệm cho một bài học. |
| 3 | Pain một câu (ai – đang làm gì – vướng đâu – hậu quả) | Giảng viên tạo quiz - tốn nhiều giờ đọc lại toàn bộ slide/transcript để nhặt ý làm câu hỏi; dùng AI thông thường thì hay bịa thông tin hoặc thiếu căn cứ - hậu quả là học viên học/thi sai, giáo viên mất uy tín. |
| 4 | 1–2 bằng chứng đầu (số + cách đếm + mã hội thoại/tin nhắn, hoặc khảo sát/phỏng vấn có số người) | - Bộ nguyên liệu có **700 đoạn transcript có mã nguồn** (89+43+154+98+154+162) và **58 trang slide** (2 bộ × 29 trang); cách đếm: cộng số đoạn trong `data/vlearn-pack/transcript/README.md` và đối chiếu quy mô trong `data/vlearn-pack/README.md`. Mã minh họa: `[T01-001]`, `[T02-001]`, `[T03-001]`, `[T04-001]`, `[T05-001]`, `[T06-001]`.<br>- Từ `data/vlearn-pack/chatlog/tutor_turns.csv`, lọc `has_citation = False`: **3.781/13.494 lượt (28,0%)** toàn pack không có trích dẫn; riêng lọc thêm `cohort_hint = K4` là **839/3.097 lượt (27,1%)**. Mã kiểm tra: `T10288`, `T10289`, `T10312`, `T10314`, `T10317`. Đây là tín hiệu rủi ro thiếu căn cứ khi sinh nội dung học tập, không khẳng định mọi lượt đều sai. |
| 5 | Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả) | Giảng viên đang chuẩn bị quiz cho một bài học từ slide/transcript; AI chọn concept có đủ quan hệ và provenance (mã đoạn `[Txx-NNN]` hoặc trang slide) để sinh câu hỏi; kết quả là một câu hỏi trắc nghiệm kèm nguồn để giảng viên duyệt hoặc loại. |
| 6 | AI tự làm đến đâu + 1 dòng lý do · ≥3 willing users ngoài nhóm | |
| 7 | Phân công có tên | |
