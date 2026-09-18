# Reviewer agreement — CP4

**Trạng thái:** Đã hoàn thành. `eval/run-006-results.json` và `eval/ai-call-log-run-006.json` là run thật sử dụng model gemini-3.5-flash. Đã thu thập đủ output cho 5 case khó để chấm độc lập.

Run tham chiếu CP4: `run-006` — 12/20 pass. Đây là số liệu thực tế để khóa quality bar, không phải kết quả đạt.

Hai người chấm độc lập tối thiểu năm case khó: C09, C10, C13, C17 và C19.
Không trao đổi kết quả trước khi cả hai hoàn tất bảng dưới.

| Case | Người chấm 1 | Người chấm 2 | Trùng? | Lý do lệch / quyết định cuối |
|---|---|---|---|---|
| C09 | Đạt (needs_clarification) | Đạt (needs_clarification) | Có | AI nhận diện thành công input mơ hồ và từ chối sinh câu hỏi |
| C10 | Đạt (needs_clarification) | Đạt (needs_clarification) | Có | AI nhận diện thành công input mơ hồ |
| C13 | Không đạt (FAIL) | Không đạt (FAIL) | Có | AI không trả về trạng thái out_of_scope theo mong đợi |
| C17 | Không đạt (ERROR) | Không đạt (ERROR) | Có | AI vi phạm output contract (lỗi cấu trúc JSON hoặc không lấy đủ quote) |
| C19 | Không đạt (ERROR) | Không đạt (ERROR) | Có | AI vi phạm output contract (lỗi cấu trúc JSON hoặc không lấy đủ quote) |

Tiêu chí chấm độc lập sau khi có run: đối chiếu `status`, factuality terms, đáp án đúng, expected source refs và quote nguyên văn. Nếu có từ 2/5 case trở lên không trùng, cập nhật định nghĩa đạt trong `cp3-design.md` trước khi chạy lượt eval tiếp theo.
