// Public fixture material keeps only short, anonymized excerpts. Protected
// source files remain local under Data/chatlog and are referenced by Txx-NNN.
const DATA_PACK_PASSAGES = [
  { ref: 'T02-001', text: 'Giảng viên nhắc học viên chia sẻ bài làm lên Discord và trao đổi với các học viên khác.' },
  { ref: 'T02-002', text: 'Trong bài ma trận tác động – nỗ lực, giảng viên chỉ ra chỗ hai trục biểu đồ bị đặt nhầm.' },
  { ref: 'T03-002', text: 'Giảng viên nói mình đang là AI Research Engineer tại một startup của Mỹ; startup này là một AI design platform.' },
  { ref: 'T03-003', text: 'Giảng viên nói expertise của mình là computer vision và từng làm các dự án xe tự hành.' },
  { ref: 'T03-004', text: 'Lớp học có một khảo sát nhanh về nền tảng học viên: còn là sinh viên, đã tốt nghiệp, học thạc sĩ hay đã đi làm.' },
  { ref: 'T04-002', text: 'Lớp có khoảng 70% là sinh viên năm cuối và khoảng 30% là người đã đi làm.' },
  { ref: 'T04-003', text: 'Buổi đầu học về nền tảng của AI và các mô hình ngôn ngữ lớn, tức LLM.' },
  { ref: 'T04-004', text: 'Giảng viên kể từng làm trong blockchain nên có tên tiếng Anh là Blue.' },
  { ref: 'T05-002', text: 'Nội dung buổi chiều là xác định bài toán kinh doanh cho AI: chọn làm cái gì và không làm cái gì.' },
  { ref: 'T05-003', text: 'Ví dụ được nêu là một agent tạo kế hoạch marketing phù hợp cho từng ngân hàng, từng công ty.' },
  { ref: 'T06-003', text: 'Học viên quét lại mã, vào link và trả lời hai câu hỏi khảo sát; giảng viên hiển thị kết quả trực tiếp.' }
];
export const LESSONS = {
  graph: {
    title: 'Graph tri thức cơ bản',
    description: 'Quan hệ giữa concept, thực thể và cạnh trong một graph.',
    sourceLabel: '4 đoạn nguồn synthetic',
    passages: [
      { ref: 'SYN-GRAPH-01', text: 'Trong graph tri thức, node biểu diễn một thực thể hoặc concept; edge biểu diễn quan hệ giữa các node.' },
      { ref: 'SYN-GRAPH-02', text: 'Một edge có thể có hướng. Hướng giúp phân biệt quan hệ A phụ thuộc B với B phụ thuộc A.' },
      { ref: 'SYN-GRAPH-03', text: 'Provenance là dấu vết cho biết một claim hoặc một câu hỏi được rút ra từ đoạn nguồn nào.' },
      { ref: 'SYN-GRAPH-04', text: 'Nếu không có đoạn nguồn đủ rõ, hệ thống phải yêu cầu người dạy bổ sung phạm vi thay vì tự đoán.' }
    ]
  },
  evidence: {
    title: 'Provenance trong nội dung học tập',
    description: 'Cách truy ngược một nhận định về đúng đoạn tài liệu gốc.',
    sourceLabel: '4 đoạn nguồn synthetic',
    passages: [
      { ref: 'SYN-PROV-01', text: 'Một provenance tốt phải chỉ được đoạn nguồn cụ thể, không chỉ ghi tên chung của cả bài học.' },
      { ref: 'SYN-PROV-02', text: 'Người duyệt dùng provenance để đối chiếu claim, đáp án đúng và giải thích trước khi xuất bản câu hỏi.' },
      { ref: 'SYN-PROV-03', text: 'Confidence thấp không chứng minh một claim đúng; hệ thống cần hiển thị giới hạn và mời người dùng kiểm tra.' },
      { ref: 'SYN-PROV-04', text: 'Khi hai nguồn mâu thuẫn, không được chọn một nguồn ngẫu nhiên; cần báo mâu thuẫn cho người dạy.' }
    ]
  },
  quiz: {
    title: 'Thiết kế câu hỏi trắc nghiệm',
    description: 'Các thành phần của một câu hỏi có một đáp án đúng.',
    sourceLabel: '4 đoạn nguồn synthetic',
    passages: [
      { ref: 'SYN-QUIZ-01', text: 'Một câu hỏi trắc nghiệm tốt có một đáp án đúng duy nhất theo đúng phạm vi kiến thức đã chọn.' },
      { ref: 'SYN-QUIZ-02', text: 'Đáp án nhiễu cần hợp lý nhưng không được đúng theo cùng cách diễn giải với đáp án chính xác.' },
      { ref: 'SYN-QUIZ-03', text: 'Giải thích sau đáp án phải nêu được căn cứ nội dung, không chỉ lặp lại đáp án đúng.' },
      { ref: 'SYN-QUIZ-04', text: 'Nếu tài liệu không đủ để xác định một đáp án đúng duy nhất, hệ thống phải cảnh báo thay vì xuất bản câu hỏi.' }
    ]
  },
  dataPack: {
    title: 'Transcript VLearn — trích đoạn có mã nguồn',
    description: 'Các đoạn transcript ngắn đã ẩn danh; mỗi đoạn giữ mã Txx-NNN để kiểm tra provenance.',
    sourceLabel: '11 trích đoạn transcript · mã [Txx-NNN] · không dùng slide',
    passages: DATA_PACK_PASSAGES
  }
};

export function getLesson(key) {
  return LESSONS[key] ?? null;
}
