import { getLesson } from './lesson-fixtures.mjs';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const DEFAULT_MODEL = 'gemini-3.8-flash';

function appError(message, code, statusCode = 500) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function readOutputText(interaction) {
  if (typeof interaction.output_text === 'string') return interaction.output_text;
  if (typeof interaction.outputText === 'string') return interaction.outputText;

  return (interaction.steps ?? [])
    .filter((step) => step.type === 'model_output')
    .flatMap((step) => step.content ?? [])
    .filter((part) => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('\n');
}

function parseJson(text) {
  const withoutFence = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = withoutFence.indexOf('{');
  const end = withoutFence.lastIndexOf('}');
  if (start < 0 || end < start) throw appError('AI không trả về JSON hợp lệ.', 'INVALID_MODEL_OUTPUT', 502);
  try {
    return JSON.parse(withoutFence.slice(start, end + 1));
  } catch {
    throw appError('AI trả về JSON không đọc được.', 'INVALID_MODEL_OUTPUT', 502);
  }
}

function validateResult(candidate, lesson) {
  const status = candidate?.status;
  const validStatuses = new Set(['generated', 'needs_clarification', 'out_of_scope']);
  if (!validStatuses.has(status)) {
    throw appError('AI trả về trạng thái không hợp lệ.', 'INVALID_MODEL_OUTPUT', 502);
  }

  const allowedRefs = new Set(lesson.passages.map((passage) => passage.ref));
  const provenance = Array.isArray(candidate.provenance) ? candidate.provenance : [];
  const safeProvenance = provenance
    .filter((item) => item && allowedRefs.has(item.ref))
    .map((item) => ({ ref: item.ref, quote: String(item.quote ?? '').trim() }))
    .filter((item) => item.quote && lesson.passages.some((passage) => passage.ref === item.ref && passage.text.includes(item.quote)));

  if (status !== 'generated') {
    return {
      status,
      question: '',
      answers: [],
      correctIndex: null,
      explanation: '',
      provenance: safeProvenance,
      confidence: 'low',
      reason: String(candidate.reason ?? 'Nguồn hiện có chưa đủ để sinh câu hỏi an toàn.').trim()
    };
  }

  const answers = Array.isArray(candidate.answers) ? candidate.answers.map((answer) => String(answer).trim()).filter(Boolean) : [];
  const correctIndex = Number(candidate.correctIndex);
  const question = String(candidate.question ?? '').trim();
  const explanation = String(candidate.explanation ?? '').trim();
  const uniqueAnswers = new Set(answers.map((answer) => answer.toLocaleLowerCase('vi')));

  if (!question || !explanation || answers.length !== 4 || uniqueAnswers.size !== 4 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3 || !safeProvenance.length) {
    throw appError('AI trả về câu hỏi chưa đạt output contract.', 'INVALID_MODEL_OUTPUT', 502);
  }

  return {
    status,
    question,
    answers,
    correctIndex,
    explanation,
    provenance: safeProvenance,
    confidence: candidate.confidence === 'low' ? 'low' : 'high',
    reason: ''
  };
}

function buildPrompt(lesson, task) {
  const sources = lesson.passages.map((passage) => `- [${passage.ref}] ${passage.text}`).join('\n');
  return `Bạn là bộ sinh câu hỏi trắc nghiệm cho giảng viên. Chỉ dùng các nguồn được cấp bên dưới.

Nhiệm vụ: ${task || 'Sinh một câu hỏi trắc nghiệm kiểm tra một ý quan trọng trong phạm vi bài học.'}

Nguồn được phép:
${sources}

Quy tắc bắt buộc:
1. KHÔNG dùng kiến thức bên ngoài nguồn.
2. Xác định chính xác trạng thái (status):
   - "out_of_scope": Nếu yêu cầu tìm thông tin HOÀN TOÀN KHÔNG CÓ trong tài liệu (ví dụ: người phát minh, chính sách công ty, điểm số).
   - "needs_clarification": Nếu yêu cầu hỏi về chủ đề có nhắc đến nhưng tài liệu lại KHÔNG ĐỦ dữ kiện hoặc quá mơ hồ để kết luận 1 đáp án đúng nhất.
   - "generated": Nếu sinh câu hỏi thành công.
3. Trong provenance, trường "quote" phải được TRÍCH XUẤT CHÍNH XÁC 100% từng chữ (copy-paste) từ văn bản nguồn, không được viết lại, không thêm bớt dấu câu.
4. Nếu sinh MCQ, phải có đúng 4 đáp án (answers), 1 đáp án đúng (correctIndex).
5. Trả về DUY NHẤT một chuỗi JSON hợp lệ, không bọc markdown, theo đúng schema sau:
{"status":"generated|needs_clarification|out_of_scope","question":"...","answers":["...","...","...","..."],"correctIndex":0,"explanation":"...","provenance":[{"ref":"mã nguồn","quote":"chuỗi nguyên văn chính xác"}],"confidence":"high|low","reason":"..."}`;
}

const OPENAI_ENDPOINT = process.env.API_BASE_URL || 'http://localhost:20128/v1/chat/completions';

export async function generateQuiz({ lessonKey, task, caseId = 'interactive' }) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw appError('Thiếu API_KEY. Hãy đặt key trong biến môi trường trước khi chạy.', 'MISSING_API_KEY', 503);

  const lesson = getLesson(lessonKey);
  if (!lesson) throw appError('Bài học không hợp lệ.', 'UNKNOWN_LESSON', 400);

  const startedAt = new Date().toISOString();
  const started = performance.now();
  const model = process.env.API_MODEL || 'oc/deepseek-v4-flash-free';
  const prompt = buildPrompt(lesson, task);
  let response;
  try {
    response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }]
      })
    });
  } catch (err) {
    throw appError('Không kết nối được API: ' + err.message, 'NETWORK_ERROR', 502);
  }

  const rawPayload = await response.text();
  let outputText = '';

  if (!response.ok) {
    let payload = {};
    try { payload = JSON.parse(rawPayload); } catch {}
    const message = payload?.error?.message || payload?.message || rawPayload.trim().slice(0, 500) || `API trả về HTTP ${response.status}.`;
    throw appError(message, 'API_ERROR', response.status);
  }

  if (rawPayload.includes('data: ')) {
    const lines = rawPayload.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('data: ') && !line.includes('[DONE]')) {
        try {
          const chunk = JSON.parse(line.trim().slice(6));
          if (chunk.choices?.[0]?.delta?.content) {
            outputText += chunk.choices[0].delta.content;
          }
        } catch {}
      }
    }
  } else {
    try {
      const payload = JSON.parse(rawPayload);
      outputText = payload.choices?.[0]?.message?.content || '';
    } catch {}
  }
  const result = validateResult(parseJson(outputText), lesson);
  return {
    result,
    trace: {
      caseId,
      provider: 'Local API',
      model,
      interactionId: null,
      startedAt,
      durationMs: Math.round(performance.now() - started),
      sourceRefs: result.provenance.map((item) => item.ref),
      status: result.status
    }
  };
}
