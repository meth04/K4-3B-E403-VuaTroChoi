# Eval CP3

`golden-set.mjs` có 20 case: 11 case được phát triển từ các đoạn transcript đã ẩn danh
trong nguồn cục bộ `Data/chatlog/Transcript.md` và 9 case synthetic. Repo chỉ giữ excerpt
ngắn cùng mã provenance `[Txx-NNN]`, không giữ nguyên data pack.

Chạy sau khi đặt `GEMINI_API_KEY`:

```powershell
$env:GEMINI_API_KEY = 'key-cua-ban'
npm run eval
```

Script sẽ tạo `run-XXX-results.json` và `ai-call-log-run-XXX.json`. Chúng là kết quả của lời gọi AI thật; không thay bằng số liệu tự tạo. Evaluator kiểm tra status, cấu trúc MCQ, đáp án đúng, factuality terms, source ref kỳ vọng và quote có phải substring nguyên văn của passage hay không.

Sau khi chạy, hai reviewer độc lập phải chấm tối thiểu C09, C10, C13, C17 và C19; ghi kết quả vào `reviewer-agreement.md` trước khi dùng số liệu trong CP3.
