# CP3 — Thiết kế video thao tác 30 giây + số đo

## 1. Mục tiêu

Chứng minh prototype VuaTroChoi có thể đọc một phạm vi bài học, sinh một câu hỏi trắc nghiệm có provenance, và để giảng viên duyệt trước khi lưu.

CP3 nộp hai thứ:

- Video quay màn hình dài tối đa 30 giây.
- Bảng số đo trên cùng một bộ thử, ghi rõ thử bao nhiêu và đạt bao nhiêu.

### 1.1. Mức prototype và bằng chứng bắt buộc

- **Mức nhắm tới:** `Mock` — flow giao diện có thể mock, nhưng quyết định trung tâm
  “sinh câu hỏi có căn cứ” phải có ít nhất **một lời gọi AI chạy thật**.
- Các phần mock phải ghi rõ trong `spec.md` §4; không dùng output hard-code để chứng minh
  AI đã sinh câu hỏi.
- Với mỗi lời gọi AI dùng cho CP3, lưu một log không chứa API key hoặc dữ liệu nhạy cảm:
  `case_id · thời điểm · model/provider · input đã rút gọn hoặc mã hoá · output · source_ref · trạng thái`.
- Dữ liệu chuẩn bị sẵn chỉ được dùng để rút ngắn thao tác quay; output xuất hiện trong video
  vẫn phải là output từ lời gọi AI thật của prototype/local runtime.
- Chỉ dùng dữ liệu giả hoặc mã nguồn/trích dẫn ngắn được phép. Không đưa nguyên data pack,
  API key hay thông tin nhận dạng vào repo công khai.

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
| Nội dung có nguồn rõ, concept đủ quan hệ | 8 | Đo khả năng sinh câu hỏi bình thường và truy nguồn |
| Nội dung có nguồn nhưng concept mơ hồ/thiếu quan hệ | 4 | Đo cảnh báo low-confidence |
| Câu hỏi yêu cầu thông tin ngoài phạm vi | 3 | Đo khả năng không bịa/không vượt scope |
| Case cần chi tiết domain hoặc nhiều đoạn nguồn | 5 | Đo việc gắn đúng nhiều provenance và rủi ro domain |
| **Tổng** | **20** | |

Bộ 20 case phải phủ đủ **4 lớp chỗ khó** theo guide. Mỗi lớp có ít nhất 2 case:

| Lớp | Case tối thiểu | Hành vi cần kiểm tra |
|---|---|---|
| ① Nguồn sự thật | C01–C08 | Claim có căn cứ thì cite đúng; thiếu/mâu thuẫn căn cứ thì không bịa |
| ② Mơ hồ/thiếu thông tin | C09–C12 | Hiện cảnh báo hoặc hỏi lại, không tự chọn đáp án thiếu căn cứ |
| ③ Ngoài phạm vi/thẩm quyền | C13–C15 | Từ chối hoặc báo ngoài scope; không sinh câu trả lời khẳng định |
| ④ Đặc thù domain | C16–C20 | Xử lý đúng thuật ngữ, nhiều đoạn nguồn và rủi ro kiến thức sai |

Ít nhất **10/20 case** phải lấy hoặc phát triển từ chatlog/transcript thật. Trong bảng
`eval/` phải ghi mã nguồn của từng case; không dán nguyên văn dài. Các case còn lại có thể
là dữ liệu giả hoặc biến thể do nhóm tự viết, nhưng phải ghi rõ nguồn gốc.

### 3.1. Registry case phải chốt trước khi chạy

Không dùng một dòng gộp `C01–C20` thay cho 20 dòng case. Mỗi dòng phải có input cụ thể,
nguồn tham chiếu và hành vi kỳ vọng. Dùng mẫu sau trong `eval/golden-set.csv` hoặc bảng
tương đương:

| Mã | Lớp | Loại | Nguồn gốc/mã nguồn | Input hoặc task | Hành vi kỳ vọng | Source ref kỳ vọng |
|---|---|---|---|---|---|---|
| C01 | ① | Thường | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh MCQ có căn cứ | ⟨Txx-NNN/trang⟩ |
| C02 | ① | Thường | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh MCQ có căn cứ | ⟨Txx-NNN/trang⟩ |
| C03 | ① | Thường | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh MCQ có căn cứ | ⟨Txx-NNN/trang⟩ |
| C04 | ① | Thường | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh MCQ có căn cứ | ⟨Txx-NNN/trang⟩ |
| C05 | ① | Thường | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh MCQ có căn cứ | ⟨Txx-NNN/trang⟩ |
| C06 | ① | Thường | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh MCQ có căn cứ | ⟨Txx-NNN/trang⟩ |
| C07 | ① | Thường | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh MCQ có căn cứ | ⟨Txx-NNN/trang⟩ |
| C08 | ① | Thường | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh MCQ có căn cứ | ⟨Txx-NNN/trang⟩ |
| C09 | ② | Mơ hồ | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Cảnh báo/hỏi lại | ⟨mã nguồn nếu có⟩ |
| C10 | ② | Mơ hồ | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Cảnh báo/hỏi lại | ⟨mã nguồn nếu có⟩ |
| C11 | ② | Mơ hồ | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Cảnh báo/hỏi lại | ⟨mã nguồn nếu có⟩ |
| C12 | ② | Mơ hồ | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Cảnh báo/hỏi lại | ⟨mã nguồn nếu có⟩ |
| C13 | ③ | Ngoài scope | ⟨mã chatlog/transcript hoặc giả⟩ | ⟨điền input⟩ | Từ chối/báo giới hạn | Không khẳng định |
| C14 | ③ | Ngoài scope | ⟨mã chatlog/transcript hoặc giả⟩ | ⟨điền input⟩ | Từ chối/báo giới hạn | Không khẳng định |
| C15 | ③ | Ngoài scope | ⟨mã chatlog/transcript hoặc giả⟩ | ⟨điền input⟩ | Từ chối/báo giới hạn | Không khẳng định |
| C16 | ④ | Domain | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh đúng thuật ngữ | ⟨Txx-NNN/trang⟩ |
| C17 | ④ | Nhiều nguồn | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Gắn đủ nhiều provenance | ⟨≥2 source ref⟩ |
| C18 | ④ | Domain | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh đúng thuật ngữ | ⟨Txx-NNN/trang⟩ |
| C19 | ④ | Nhiều nguồn | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Gắn đủ nhiều provenance | ⟨≥2 source ref⟩ |
| C20 | ④ | Domain | ⟨mã chatlog/transcript⟩ | ⟨điền input⟩ | Sinh đúng thuật ngữ | ⟨Txx-NNN/trang⟩ |

Các dấu `⟨...⟩` chỉ là trường bắt buộc phải điền trước khi chạy; không được giữ nguyên
trong bảng nộp CP3.

### Một case đạt khi đồng thời thỏa 4 điều

1. Câu hỏi và đáp án bám đúng nội dung nguồn.
2. Đáp án đúng được xác định rõ, không có nhiều đáp án đúng ngoài ý định.
3. Mỗi claim quan trọng có mã transcript hoặc trang slide kiểm tra được.
4. Case ngoài phạm vi/thiếu căn cứ được cảnh báo hoặc từ chối, không tự bịa.

Chấm theo ba chiều chất lượng sau, mỗi chiều **Đạt/Không đạt**:

| Chiều | Định nghĩa kiểm chứng được |
|---|---|
| Factuality + provenance | Mọi claim quan trọng đúng với nguồn và truy ngược được về đúng mã đoạn/trang |
| Chất lượng MCQ | Có đúng một đáp án đúng; đáp án nhiễu không tạo thêm đáp án đúng; giải thích bám nguồn |
| Scope + uncertainty | Case mơ hồ/ngoài phạm vi được cảnh báo, hỏi lại hoặc từ chối; không khẳng định khi thiếu căn cứ |

Một case chỉ được tính **Đạt** khi tất cả chiều áp dụng cho case đó đều đạt. Với case ngoài
phạm vi, “Đạt” nghĩa là hệ thống chặn đúng; không yêu cầu phải sinh câu hỏi.

### Bảng ghi kết quả

| Mã case | Loại | Kết quả | Có nguồn đúng? | Đạt? | Lý do nếu không đạt |
| --- | --- | --- | --- | --- | --- |
| C01–C20 | Theo bộ phân loại trên | Sinh / cảnh báo / từ chối | Có / Không | Có / Không | Ghi ngắn gọn |

Khi chạy thật, thay dòng tóm tắt trên bằng 20 dòng chi tiết theo registry §3.1. Mỗi lượt
chạy phải lưu đủ cả case đạt và không đạt, không chỉ lưu các output đẹp.

Các số cần báo cáo trong CP3:

- **Tổng số case:** 20.
- **Số case đạt:** `___/20`.
- **Tỷ lệ đạt:** `___%`.
- **Số case có provenance đúng:** `___/20`.
- **Số case ngoài phạm vi được chặn đúng:** `___/3`.
- **Số lỗi theo nguyên nhân:** thiếu nguồn `___`, sai đáp án `___`, vượt phạm vi `___`, lỗi khác `___`.

### 3.2. Quy trình chấm và log lượt chạy

1. Chốt registry, tiêu chí và quality bar **trước lượt đo đầu**.
2. Chạy trọn 20 case; lưu `eval/run-001-results.csv` với input, output, source ref,
   kết quả và lý do fail.
3. Hai thành viên chấm độc lập ít nhất 5 case khó, ghi số case lệch và cách thống nhất.
   Nếu lệch từ 2/5 case trở lên, viết lại tiêu chí trước khi chấm tiếp.
4. Sau mỗi thay đổi, chạy lại **toàn bộ 20 case** và lưu thành run mới; không ghi đè run cũ.
5. Lưu `eval/ai-call-log.md` gồm `case_id`, thời điểm, model/provider, trạng thái,
   source ref và mã lỗi nếu có. Tuyệt đối không lưu API key.

### 3.3. User Input Grid

Mỗi case phải gắn với ít nhất một tổ hợp trong grid dưới đây. Ô chưa có case là lỗ hổng
coverage cần bổ sung, không được thêm case chỉ theo cảm giác:

| Chiều | Giá trị cần phủ |
|---|---|
| Mức đầy đủ của nguồn | Đủ / thiếu / mâu thuẫn |
| Phạm vi yêu cầu | Trong scope / ngoài scope |
| Quan hệ concept | Đủ một quan hệ / thiếu quan hệ / nhiều quan hệ |
| Mức rủi ro domain | Thấp / cao |
| Nguồn gốc case | Chatlog/transcript thật / dữ liệu giả |

Không thay số bằng các từ như “tốt”, “nhanh” hoặc “độ chính xác cao”. Nếu kết quả thấp, giữ nguyên số thật và ghi nguyên nhân để làm đầu vào cho CP4.

## 4. Quality bar CP3 và bàn giao CP4

Quality bar phải được ghi nhận trước lượt đo đầu để tránh đổi chuẩn theo kết quả. Mốc CP3
dùng để đo tín hiệu ban đầu; tại CP4, chép đúng quality bar vào `spec.md` và khóa cho mọi
lượt chạy sau.

> Thử 20 case; prototype được xem là có tín hiệu đạt nếu ít nhất 16 case đạt, ít nhất 18/20 case có provenance kiểm tra được, và 3/3 case ngoài phạm vi không tạo câu trả lời khẳng định không có căn cứ.

Sau khi khóa tại CP4, không hạ hoặc đổi quality bar vì kết quả thấp. Nếu chưa đạt, giữ số
thật và phân tích khoảng cách trong `spec.md` §7 và changelog §9.

### 4.1. User Input Grid và bốn đường đi cần đối chiếu

| Đường đi | Case đại diện | Prototype phải thể hiện |
|---|---|---|
| Happy path | Một case ① | Sinh câu hỏi, đáp án, giải thích và provenance đúng |
| Low-confidence | Một case ② | Cảnh báo/hỏi lại; cho phép người dạy sửa hoặc loại |
| Không có căn cứ/ngoài scope | Một case ③ | Không sinh câu trả lời khẳng định; nói rõ giới hạn |
| Đặc thù domain/nhiều nguồn | Một case ④ | Giữ đúng thuật ngữ và hiển thị đủ source ref |

Video 30 giây có thể tập trung vào happy path; các đường đi còn lại phải có trong bảng eval
và ít nhất một case khó được chuẩn bị cho demo CP5.

## 5. Phân công quay và đo

| Người | Việc trong CP3 |
| --- | --- |
| Nguyễn Văn Thân | Điều phối, bấm happy path, chốt bảng số đo và lời trình bày |
| Nguyễn Ngọc Linh | Chuẩn bị 20 case, kiểm tra provenance, điền kết quả đánh giá |
| Dương Hà Đức Anh | Hoàn thiện màn hình prototype, quay video và xuất file dự phòng |

## 6. Checklist trước khi nộp

- [ ] Video dài không quá 30 giây.
- [ ] Video có đủ chọn bài, sinh câu hỏi, xem nguồn và duyệt/lưu.
- [ ] Video cho thấy ít nhất một lời gọi AI thật; output không phải hard-code/ảnh tĩnh.
- [ ] Có log AI call không chứa API key hoặc dữ liệu nhạy cảm.
- [ ] Có đủ 20 case cụ thể, phủ 4 lớp lỗi và ít nhất 10 case từ/phát triển từ dữ liệu thật.
- [ ] Mỗi case có input, output, source ref, kết quả và lý do nếu không đạt.
- [ ] Có bảng 20 case và ba chiều tiêu chí đạt rõ ràng.
- [ ] Có hai người chấm độc lập các case khó và ghi mức độ đồng thuận.
- [ ] Có ít nhất một lượt chạy đầy đủ; mỗi lượt sửa sau đó chạy lại toàn bộ 20 case.
- [ ] Có cả số đạt, tỷ lệ đạt, provenance đúng, case ngoài phạm vi bị chặn và nhóm lỗi.
- [ ] Số liệu trong video, bảng đo và phần trình bày khớp nhau.
- [ ] Registry và quality bar đã chốt trước lượt đo đầu; không thay số liệu sau khi chạy.
- [ ] `spec.md` §7 nhận quality bar chính thức tại CP4; các phần mock/real được ghi rõ ở §4.
- [ ] Đội trưởng nộp đúng form CP3 trước 16:00 ngày 18/9.

### 6.1. Các artifact phải có trước khi đánh dấu hoàn thành

| Artifact | Tối thiểu phải có |
|---|---|
| Video CP3 | MP4 dài không quá 30 giây, quay liên tục từ chọn phạm vi đến duyệt/lưu |
| `eval/golden-set.csv` | 20 case cụ thể, nguồn gốc, input, lớp lỗi và hành vi kỳ vọng |
| `eval/run-001-results.csv` | Output của đủ 20 case, kết quả Đạt/Không đạt và lý do |
| `eval/ai-call-log.md` | Bằng chứng lời gọi AI thật, không có secret |
| `eval/reviewer-agreement.md` | Kết quả hai người chấm độc lập các case khó |
| `spec.md` | Quality bar được khóa tại CP4; phần mock/real và changelog được cập nhật |
