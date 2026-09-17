// All cases in this initial set use the synthetic fixtures in codebase/lesson-fixtures.mjs.
// Replace at least 10 with permitted, traceable data-pack cases before claiming the CP3
// data-source requirement is met.
export const GOLDEN_SET = [
  { id: 'C01', layer: 'source_truth', type: 'normal', origin: 'synthetic', lessonKey: 'graph', task: 'Sinh câu hỏi về thành phần biểu diễn quan hệ giữa hai thực thể.', expectedStatus: 'generated' },
  { id: 'C02', layer: 'source_truth', type: 'normal', origin: 'synthetic', lessonKey: 'graph', task: 'Sinh câu hỏi về ý nghĩa của hướng trên một edge.', expectedStatus: 'generated' },
  { id: 'C03', layer: 'source_truth', type: 'normal', origin: 'synthetic', lessonKey: 'graph', task: 'Sinh câu hỏi về ý nghĩa của provenance.', expectedStatus: 'generated' },
  { id: 'C04', layer: 'source_truth', type: 'normal', origin: 'synthetic', lessonKey: 'evidence', task: 'Sinh câu hỏi về mức độ cụ thể của một provenance tốt.', expectedStatus: 'generated' },
  { id: 'C05', layer: 'source_truth', type: 'normal', origin: 'synthetic', lessonKey: 'evidence', task: 'Sinh câu hỏi về việc người duyệt dùng provenance để làm gì.', expectedStatus: 'generated' },
  { id: 'C06', layer: 'source_truth', type: 'normal', origin: 'synthetic', lessonKey: 'quiz', task: 'Sinh câu hỏi về số đáp án đúng của một MCQ tốt.', expectedStatus: 'generated' },
  { id: 'C07', layer: 'source_truth', type: 'normal', origin: 'synthetic', lessonKey: 'quiz', task: 'Sinh câu hỏi về yêu cầu với đáp án nhiễu.', expectedStatus: 'generated' },
  { id: 'C08', layer: 'source_truth', type: 'normal', origin: 'synthetic', lessonKey: 'quiz', task: 'Sinh câu hỏi về vai trò của giải thích sau đáp án.', expectedStatus: 'generated' },
  { id: 'C09', layer: 'ambiguity', type: 'ambiguous', origin: 'synthetic', lessonKey: 'graph', task: 'Sinh một câu hỏi về loại graph tốt nhất.', expectedStatus: 'needs_clarification' },
  { id: 'C10', layer: 'ambiguity', type: 'ambiguous', origin: 'synthetic', lessonKey: 'evidence', task: 'Sinh câu hỏi để chứng minh confidence thấp luôn là câu trả lời sai.', expectedStatus: 'needs_clarification' },
  { id: 'C11', layer: 'ambiguity', type: 'ambiguous', origin: 'synthetic', lessonKey: 'quiz', task: 'Sinh câu hỏi có hai đáp án đúng để người học chọn tất cả đáp án.', expectedStatus: 'needs_clarification' },
  { id: 'C12', layer: 'ambiguity', type: 'ambiguous', origin: 'synthetic', lessonKey: 'graph', task: 'Sinh câu hỏi về một khái niệm không được nêu tên trong nguồn.', expectedStatus: 'needs_clarification' },
  { id: 'C13', layer: 'out_of_scope', type: 'out_of_scope', origin: 'synthetic', lessonKey: 'graph', task: 'Cho biết ai là người phát minh ra knowledge graph và sinh MCQ về năm phát minh.', expectedStatus: 'out_of_scope' },
  { id: 'C14', layer: 'out_of_scope', type: 'out_of_scope', origin: 'synthetic', lessonKey: 'evidence', task: 'Sinh câu hỏi về chính sách bảo mật dữ liệu của một công ty cụ thể.', expectedStatus: 'out_of_scope' },
  { id: 'C15', layer: 'out_of_scope', type: 'out_of_scope', origin: 'synthetic', lessonKey: 'quiz', task: 'Sinh câu hỏi về điểm thi cuối kỳ của học viên trong lớp.', expectedStatus: 'out_of_scope' },
  { id: 'C16', layer: 'domain', type: 'domain', origin: 'synthetic', lessonKey: 'graph', task: 'Sinh câu hỏi phân biệt node và edge bằng thuật ngữ đúng.', expectedStatus: 'generated' },
  { id: 'C17', layer: 'domain', type: 'multi_source', origin: 'synthetic', lessonKey: 'graph', task: 'Sinh câu hỏi dùng cả khái niệm edge và provenance; phải cite ít nhất hai nguồn.', expectedStatus: 'generated', minSources: 2 },
  { id: 'C18', layer: 'domain', type: 'domain', origin: 'synthetic', lessonKey: 'evidence', task: 'Sinh câu hỏi về cách xử lý khi hai nguồn mâu thuẫn.', expectedStatus: 'generated' },
  { id: 'C19', layer: 'domain', type: 'multi_source', origin: 'synthetic', lessonKey: 'quiz', task: 'Sinh câu hỏi dùng cả tiêu chí đáp án đúng và tiêu chí đáp án nhiễu; phải cite ít nhất hai nguồn.', expectedStatus: 'generated', minSources: 2 },
  { id: 'C20', layer: 'domain', type: 'domain', origin: 'synthetic', lessonKey: 'quiz', task: 'Sinh câu hỏi về hành vi khi tài liệu không đủ xác định một đáp án duy nhất.', expectedStatus: 'generated' }
];
