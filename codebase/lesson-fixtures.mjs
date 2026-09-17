// Synthetic teaching material for the CP3 prototype. It is intentionally not
// copied from the protected hackathon data pack.
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
  }
};

export function getLesson(key) {
  return LESSONS[key] ?? null;
}
