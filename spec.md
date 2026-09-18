# AI SPEC — Knowledge-to-Lesson: quiz có provenance · Nhóm VuaTroChoi · Track C1

Hướng: [ ] A — VLearn  [ ] B — Trợ lý Học viên  [x] C — Lesson Studio
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job

- **Job executor:** giảng viên đang phụ trách một bài học và tự chuẩn bị một câu hỏi trắc nghiệm từ một tập transcript đã chọn.
- **Workflow hiện tại:** đọc lại tài liệu, chọn ý cần kiểm tra, tự viết câu hỏi/đáp án, rồi kiểm tra lại căn cứ trước khi đưa vào quiz.
- **Core JTBD:** Khi chuẩn bị quiz cho một bài học, tôi muốn biến một ý đã có trong tài liệu thành một câu hỏi có thể kiểm tra ngược về đoạn nguồn, để tôi duyệt nhanh mà không làm học viên học sai.
- **Problem statement:** Giảng viên phải đọc lại transcript để tìm ý và kiểm tra căn cứ cho từng câu hỏi; khi citation không rõ, họ phải dừng để xác minh hoặc có nguy cơ đưa claim không có căn cứ vào quiz, làm tăng công sức kiểm duyệt và có thể khiến học viên học sai.

**Evidence và nguồn dữ liệu đã thống nhất**

- Nguồn cục bộ được dùng để phát triển fixture: `Data/chatlog/Transcript.md/` và `Data/chatlog/Tutor_turn.csv`. Data pack gốc không được commit vào repo công khai.
- Workspace hiện có 611 đoạn transcript có mã: T01: 0, T02: 43, T03: 154, T04: 98, T05: 154, T06: 162. Prototype CP3 chỉ dùng 11 excerpt ngắn có mã `[Txx-NNN]`; không dùng slide vì workspace hiện không có file slide.
- `Tutor_turn.csv` có 13.494 lượt; 3.781 lượt (`has_citation = False`, 28,0%) không có citation. Đây là tín hiệu rủi ro thiếu căn cứ, không phải khẳng định mọi lượt đều sai.
- Evidence hiện chưa đo trực tiếp số phút giảng viên mất khi soạn quiz và chưa có log cho phép kết luận tỷ lệ hallucination. Vì vậy, spec chỉ claim rủi ro thiếu căn cứ/công sức kiểm duyệt tăng; không claim “AI hay bịa” hoặc “tốn nhiều giờ” như một số liệu đã được chứng minh.
- Các mã nguồn của fixture data-pack-derived: `[T02-001]`, `[T02-002]`, `[T03-002]`, `[T03-003]`, `[T03-004]`, `[T04-002]`, `[T04-003]`, `[T04-004]`, `[T05-002]`, `[T05-003]`, `[T06-003]`.

**Evidence B — mining log có thể kiểm lại**

- **Đơn vị đếm transcript:** một marker có dạng `**[Txx-NNN]**` trong sáu file `Data/chatlog/Transcript.md/*`; đếm bằng regex marker, không đếm dòng trống hoặc tiêu đề. Kết quả: T01 `0`, T02 `43`, T03 `154`, T04 `98`, T05 `154`, T06 `162`, tổng `611` marker.
- **Đơn vị đếm citation:** một dòng trong `Data/chatlog/Tutor_turn.csv`; chuẩn hóa giá trị Boolean của cột `has_citation`, đếm tổng số dòng và số dòng bằng `False`. Kết quả: `13.494` lượt, `3.781` lượt không citation (`28,0%`). Đây là proxy cho rủi ro thiếu căn cứ, không phải kết luận mọi lượt không citation đều sai.
- **Nguồn và quyền truy cập:** data pack gốc chỉ tồn tại trong workspace cục bộ, không commit vào repo công khai. Các quote dưới đây là đoạn ngắn nguyên văn đã ẩn danh; fixture trong code có thể rút gọn câu nhưng vẫn giữ `sourceRef` để truy ngược.

**Năm quote nguyên văn dùng làm evidence/fixture**

| Source ref | Quote nguyên văn ngắn |
|---|---|
| `[T02-001]` | “nhắc học viên chia sẻ bài làm lên Discord và trao đổi vui với một vài học viên về bài của mình.” |
| `[T02-002]` | “chỉ ra chỗ hai trục biểu đồ bị đặt nhầm” |
| `[T03-003]` | “Expertise của mình là chuyên về computer vision.” |
| `[T04-002]` | “phần lớn, khoảng 70%, là các bạn sinh viên năm cuối” |
| `[T06-003]` | “[Hoạt động lớp: học viên quét lại mã, vào link trả lời hai câu hỏi khảo sát; giảng viên chờ và hiển thị kết quả trực tiếp bên phải màn hình.]” |

## §2. Impact & quyết định chọn

| Ứng viên | Bao nhiêu người × tần suất quan sát | Tổn thất mỗi lần | Bằng chứng/giới hạn | Khả thi trong prototype | Quyết định |
|---|---|---|---|---|---|
| Sinh một MCQ từ một excerpt có provenance | 1 giảng viên × 1 bản nháp/lần; quy mô tổng số giảng viên trực tiếp chưa có trong data. Proxy downstream: 448 học viên K4 × 3.097 lượt tutor (6,9 lượt/học viên), trong đó 839 lượt không citation (27,1%) | Mỗi bản nháp cần ít nhất 1 lượt kiểm tra lại nguồn; nếu bỏ sót, có thể đưa claim không có căn cứ vào quiz và khiến học viên học sai | Chưa có log số phút hoặc số giảng viên trực tiếp soạn quiz; 448/3.097/839 chỉ là proxy từ tutor data | Một AI call + UI duyệt | **Chọn** |
| Trích xuất graph đầy đủ từ toàn bộ transcript và slide | 1 nhóm nội dung × 611 marker transcript; tần suất là 1 lần ingestion cho toàn bộ nguồn trong prototype | Phải chuẩn hóa toàn bộ nguồn, xử lý quan hệ/mâu thuẫn và kiểm tra provenance của từng node/edge | Workspace không có file slide; chưa có số người dùng trực tiếp | Không phù hợp thời gian CP3 | Loại |
| Adaptive lesson theo mastery | 448 học viên K4 là quy mô người học có thể hưởng lợi; tần suất branch/mastery chưa có log | Mỗi quyết định branch cần learner model, trạng thái mastery và nội dung remediation; sai branch có thể làm học viên học sai hướng | Không có log mastery/branch để định lượng tần suất hoặc tổn thất thực tế | Ngoài lát cắt một câu | Loại |
| Tutor trả lời mọi câu hỏi theo chatlog | 448 học viên K4 × 3.097 lượt tutor (6,9 lượt/học viên) | Mỗi lượt cần trả lời và kiểm tra căn cứ; mở rộng sang mọi câu hỏi làm tăng phạm vi kiểm thử factuality | Có dữ liệu lượt hỏi nhưng job khác với soạn quiz | Không phù hợp C1 | Loại |

**Lý do chọn:** lát cắt MCQ source-first có cost-of-error cao nhưng có thể chứng minh trong 5 phút: một AI call tạo bản nháp, provenance được kiểm tra, giảng viên quyết định duyệt/loại.

## §3. Giải pháp tương tự đã nghiên cứu

- **Source-first draft:** giữ một bản nháp có nguồn cạnh output; học được rằng provenance phải là mã đoạn cụ thể, không chỉ tên bài.
- **Direct generation:** nhanh hơn nhưng không cung cấp đường kiểm tra; không dùng làm flow chính.
- **Human-in-the-loop review:** giữ quyền duyệt/sửa/loại cho giảng viên vì lỗi nội dung có chi phí cao.
- Phần so sánh sản phẩm ngoài chưa có log riêng trong repo; đây là giới hạn còn lại của hồ sơ nghiên cứu, không được dùng như bằng chứng định lượng.

## §4. Thiết kế

- **Lát cắt MỘT CÂU:** một giảng viên · chuẩn bị một MCQ từ một tập excerpt transcript · AI đề xuất câu hỏi/đáp án/provenance · giảng viên duyệt, sửa hoặc loại một bản nháp.
- **Non-goals:** ingestion toàn bộ data pack; xây graph database đầy đủ; adaptive mastery/branching; lưu trữ quiz production; dùng slide hoặc nguồn web ngoài.
- **Mức prototype:** `[ ] Sketch  [x] Mock  [ ] Working`.
- **Phần thật:** Gemini call ở quyết định trung tâm; output JSON contract; status `generated`/`needs_clarification`/`out_of_scope`; lọc provenance theo source ref được cấp; kiểm tra quote là substring của passage; hiển thị bản nháp và provenance.
- **Phần mock:** fixture excerpt trong `codebase/lesson-fixtures.mjs`; nút “Lưu” chỉ cập nhật trạng thái/metrics trên client; không có database; edit hiện chỉ sửa text câu hỏi; không có ingestion/extraction graph thật.
- **Automation:** augment — AI đề xuất, giảng viên chịu trách nhiệm quyết định. Sai kiến thức có thể làm học viên học sai và việc sửa lại tốn chi phí, nên không automate publish.

### §4b. Nguyên tắc HAX/PAIR đã áp dụng

| Nguyên tắc | Áp dụng cụ thể | Case kiểm tra |
|---|---|---|
| G1 — Làm rõ hệ thống làm được gì | UI ghi rõ “Tạo quiz có căn cứ”, hiển thị phạm vi nguồn trước khi gọi | C01, C16 |
| G2 — Làm rõ làm tốt đến đâu | Hiển thị source ref, quote và trạng thái confidence; không gọi provenance rỗng là đạt | C01–C08, C16–C20 |
| G8 — Gạt bỏ dễ dàng | Có nút Loại; bản nháp bị loại không tăng số câu đã duyệt | C01, C17 |
| G9 — Sửa dễ dàng | Có nút Sửa và sửa trực tiếp câu hỏi trước khi duyệt | Happy path UI |
| G10 — Thu hẹp phạm vi khi nghi ngờ | Input mơ hồ/thiếu dữ liệu trả `needs_clarification`, không sinh MCQ | C09–C12 |
| G11 — Giải thích vì sao | Output bắt buộc có explanation và source quote để giảng viên đối chiếu | C01, C17, C20 |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản

| Lớp | Kịch bản | Hành vi mong muốn | Case |
|---|---|---|---|
| Nguồn sự thật | Claim phải bám đúng transcript | Sinh MCQ và cite đúng ref/quote | C01–C08 |
| Nguồn sự thật | Quote không thuộc passage được cite | Không tính đạt; evaluator báo provenance fail | mọi case generated |
| Mơ hồ/thiếu thông tin | Yêu cầu chọn một đáp án khi nguồn không đủ tiêu chí | `needs_clarification`, nêu giới hạn | C09–C12 |
| Mơ hồ/thiếu thông tin | Confidence thấp bị diễn giải thành sự thật | Không khẳng định, yêu cầu người dạy kiểm tra | C10–C12 |
| Ngoài phạm vi/thẩm quyền | Hỏi người phát minh knowledge graph | `out_of_scope`, không sinh MCQ | C13 |
| Ngoài phạm vi/thẩm quyền | Hỏi chính sách công ty/điểm thi cá nhân | `out_of_scope`, không suy đoán | C14–C15 |
| Đặc thù domain | Phải phân biệt node/edge và provenance | Dùng đúng thuật ngữ, cite đủ nguồn | C16–C17 |
| Đặc thù domain | MCQ có nhiều tiêu chí hoặc nguồn mâu thuẫn | Cite đủ nguồn; không bỏ qua mâu thuẫn | C18–C20 |

## §6. Bốn đường đi của trải nghiệm

- **Happy path:** chọn `dataPack` hoặc lesson fixture → gọi AI → nhận 4 đáp án, explanation và source quote → giảng viên xem provenance → duyệt/lưu.
- **Low-confidence (②):** task thiếu tiêu chí hoặc đòi kết luận vượt dữ liệu → AI trả `needs_clarification`, không có question/answers để duyệt.
- **Không căn cứ/ngoài scope (①/③):** task đòi nguồn không có hoặc thông tin ngoài lesson → trả `out_of_scope`/cảnh báo; không sinh claim khẳng định.
- **Correction:** giảng viên sửa text câu hỏi rồi mới duyệt; prototype hiện chưa lưu phiên bản vào database.
- **Đặc thù domain (④):** evaluator bắt buộc source ref kỳ vọng, quote nguyên văn thuộc passage, đáp án chứa factuality terms và đúng 4 đáp án duy nhất.

## §7. Kiểm thử

**Chiều chất lượng và định nghĩa kiểm chứng**

1. **Factuality:** factuality terms của case phải xuất hiện trong source passage và trong output gồm question/correct answer/explanation.
2. **MCQ answer:** output generated phải có đúng 4 đáp án khác nhau, `correctIndex` hợp lệ và correct answer chứa các `correctAnswerTerms` của case.
3. **Provenance/scope:** mọi quote phải là substring nguyên văn của passage được cite; source ref phải thuộc ref kỳ vọng; case mơ hồ/out-of-scope không được có MCQ.

- **Golden set:** `eval/golden-set.mjs`, 20 case; 11 data-pack-derived, 9 synthetic; đủ 4 lớp theo cơ cấu 8/4/3/5.
- **Evaluator:** `codebase/evaluate.mjs` kiểm tra cả status, cấu trúc, đáp án, factuality terms, expected refs, exact quote và scope safety.
- **Quality bar khóa tại CP4:** prototype chỉ được xem là đạt khi đồng thời có `>=16/20` case pass, `>=18/20` provenance đúng và `3/3` case ngoài scope bị chặn đúng. Không hạ hoặc đổi bar sau khi đã thấy kết quả.
- **Run thật gần nhất:** `eval/run-003-results.json` và `eval/ai-call-log-run-003.json`; 20/20 case đã được thử bằng Gemini. Kết quả case là `6/20` pass (30%), provenance `9/20`, out-of-scope blocked `0/3`. Chính artifact run-003 hiện ghi factuality `9/20` và answer `8/7`; evaluator source đã được sửa để các run sau chỉ tính hai chỉ số này trên output `generated`, nhưng chưa có run mới sau thay đổi đó nên chưa được phép trình bày các số mới như kết quả đã đo.
- **Khoảng cách so với bar:** thiếu 10 case pass, thiếu 9 case provenance đúng và chưa chặn đúng 3 case ngoài scope. `C06` sai term đáp án; `C10` và `C12` trả sai status; `C08`, `C09`, `C11` gặp HTTP 500 do model quá tải; `C13–C20` gặp HTTP 429 do quota, nên các case lỗi API chưa được dùng để kết luận chất lượng nội dung.
- **Tính trung thực của số liệu:** run-001 và run-002 được giữ nguyên như log lỗi lịch sử; không ghi đè hoặc biến chúng thành kết quả đạt. Evaluator đã được bổ sung để mẫu số factuality/answer chỉ tính trên output `generated`, tránh số vô lý như `8/7`; mọi run sau thay đổi phải chạy lại đủ 20 case.
- **Reviewer:** hai người chấm độc lập C09, C10, C13, C17, C19; ghi vào `eval/reviewer-agreement.md` sau khi có run thật.
- **Reviewer hiện tại:** chưa hoàn tất. `run-003` chưa cung cấp output hợp lệ cho C09, C13, C17, C19 và C10 vẫn fail; chưa có bảng chấm độc lập của hai reviewer nên không claim agreement.

## §8. Phân công & kế hoạch

- **Nguyễn Văn Thân (2A202602859):** product lead; chốt lát cắt, evidence, spec, quality bar và demo/Q&A.
- **Nguyễn Ngọc Linh (2A202602480):** data/AI lead; chuẩn hóa source refs, prompt/output contract, golden set và eval.
- **Dương Hà Đức Anh (2A202602977):** prototype/validation lead; UI flow, AI integration, demo và user validation.
- **Willing users:** chưa có tên được ghi trong artifact hiện tại; validation chưa được claim là hoàn thành.
- **Multi-prototype:** không thực hiện; giữ một trục quyết định augment + provenance-first để tránh mở rộng scope.

**Kế hoạch CP4 → LEC 6/LAB 6**

| Buổi | Người phụ trách | Việc phải làm | Bằng chứng đầu ra | Điều kiện kết thúc |
|---|---|---|---|---|
| LEC 6 | Nguyễn Văn Thân + cả nhóm | Trình bày job, 4 đường đi, phần real/mock và quality bar đã khóa; dry-run demo happy path và một case khó | `spec.md` bản chốt, script demo, bảng gap của run-003 | Mọi thành viên giải thích được phạm vi, giới hạn và lý do augment |
| LAB 6 — eval | Nguyễn Ngọc Linh | Chờ quota/API ổn định, chạy lại trọn 20 case sau mọi thay đổi; lưu run mới và AI-call log mới | `eval/run-XXX-results.json`, `eval/ai-call-log-run-XXX.json` | Không ghi đè run cũ; số liệu khớp evaluator và spec |
| LAB 6 — validation | Dương Hà Đức Anh | Dry-run UI với ít nhất một happy path, một low-confidence và một out-of-scope; ghi lỗi thao tác nếu có | checklist thao tác, ảnh/video hoặc validation log nếu thực hiện | Không claim user validation nếu chưa có người thử và log nguyên văn |
| LAB 6 — reviewer | Hai reviewer độc lập | Chấm C09, C10, C13, C17, C19 từ cùng một run hợp lệ, rồi mới đối chiếu | `eval/reviewer-agreement.md` | Có đủ 2 cột chấm, mức trùng/lệch và quyết định cuối |

**Tự khai CP4:** các mục CP4 về evidence B, bảng impact, 4 lớp rủi ro, HAX/PAIR và quality bar bằng số đã được ghi trong spec. Các mục chưa hoàn tất được giữ công khai: reviewer agreement, một lượt eval đủ 20 case sau khi sửa evaluator và user validation ngoài nhóm. Đây là phần chuyển tiếp sang LAB6/CP5, không được trình bày như đã hoàn thành.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-09-18 | Thống nhất nguồn về `Data/chatlog`, 611 transcript markers, không dùng slide; provenance dùng `[Txx-NNN]` | Loại bỏ đường dẫn và số lượng không khớp giữa Canvas và workspace |
| 2026-09-18 | Bổ sung 11 case data-pack-derived và `sourceRefs` | Đáp ứng yêu cầu tối thiểu 10 case có nguồn truy được |
| 2026-09-18 | Evaluator kiểm tra factuality, correct answer và exact provenance quote | Status/JSON shape không đủ để chứng minh chất lượng nội dung |
| 2026-09-18 | Ghi rõ phần thật/phần mock và quality bar | Tránh trình bày prototype Mock như production system |
| 2026-09-18 | Khóa quality bar tại CP4 và ghi run thật `run-003` | Giữ số liệu thấp/trung thực, tách lỗi nội dung khỏi lỗi quá tải/quota API |
| 2026-09-18 | Thu hẹp job executor về giảng viên và thay claim hallucination/thời gian bằng rủi ro thiếu căn cứ | Canvas và spec phải chỉ claim điều evidence hiện có hỗ trợ |
| 2026-09-18 | Chuẩn hóa impact theo người × tần suất × tổn thất, đồng thời tách số trực tiếp khỏi proxy | Không dùng tutor data như bằng chứng trực tiếp về số giảng viên soạn quiz |
| 2026-09-18 | Reviewer agreement còn mở | Chưa có đủ output hợp lệ và hai lượt chấm độc lập; không điền kết quả giả |
