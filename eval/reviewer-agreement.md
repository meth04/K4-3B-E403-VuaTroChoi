# Reviewer agreement — CP3

**Trạng thái:** Chưa hoàn thành. `eval/run-003-results.json` và `eval/ai-call-log-run-003.json` là run thật, nhưng C09, C13, C17 và C19 bị gián đoạn bởi lỗi API/quota; C10 không đạt expected status. Hai reviewer chưa có đủ output hợp lệ để chấm độc lập. Không điền kết quả giả.

Run tham chiếu CP4: `run-003` — 6/20 pass, provenance 9/20, out-of-scope blocked 0/3. Đây là số liệu thực tế để khóa quality bar, không phải kết quả đạt.

Hai người chấm độc lập tối thiểu năm case khó: C09, C10, C13, C17 và C19.
Không trao đổi kết quả trước khi cả hai hoàn tất bảng dưới.

| Case | Người chấm 1 | Người chấm 2 | Trùng? | Lý do lệch / quyết định cuối |
|---|---|---|---|---|
| C09 | Chưa chấm | Chưa chấm | — | — |
| C10 | Chưa chấm | Chưa chấm | — | — |
| C13 | Chưa chấm | Chưa chấm | — | — |
| C17 | Chưa chấm | Chưa chấm | — | — |
| C19 | Chưa chấm | Chưa chấm | — | — |

Tiêu chí chấm độc lập sau khi có run: đối chiếu `status`, factuality terms, đáp án đúng,
expected source refs và quote nguyên văn. Nếu có từ 2/5 case trở lên không trùng, cập nhật
định nghĩa đạt trong `cp3-design.md` trước khi chạy lượt eval tiếp theo.
