# Eval CP3

`golden-set.mjs` có 20 case synthetic để kiểm thử end-to-end mà không đưa data pack bảo mật vào repo.

Chạy sau khi đặt `GEMINI_API_KEY`:

```powershell
$env:GEMINI_API_KEY = 'key-cua-ban'
npm run eval
```

Script sẽ tạo `run-XXX-results.json` và `ai-call-log-run-XXX.json`. Chúng là kết quả của lời gọi AI thật; không thay bằng số liệu tự tạo.

Trước khi nộp CP3, thay ít nhất 10 case synthetic bằng case được phép lấy/phát triển từ data pack, chỉ ghi mã nguồn và trích ngắn theo quy định bảo mật.
