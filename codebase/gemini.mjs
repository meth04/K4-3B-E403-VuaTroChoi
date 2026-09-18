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
  return `Bạn là bộ sinh câu hỏi trắc nghiệm cho giảng viên. Chỉ dùng các nguồn được cấp bên dưới.\n\nNhiệm vụ: ${task || 'Sinh một câu hỏi trắc nghiệm kiểm tra một ý quan trọng trong phạm vi bài học.'}\n\nNguồn được phép:\n${sources}\n\nQuy tắc bắt buộc:\n1. Không dùng kiến thức bên ngoài nguồn.\n2. Nếu nguồn không đủ, input mơ hồ, mâu thuẫn hoặc yêu cầu ngoài phạm vi, không sinh câu hỏi; trả về needs_clarification hoặc out_of_scope.\n3. Nếu sinh câu hỏi, có đúng 4 đáp án, đúng 1 đáp án đúng, giải thích ngắn và provenance chỉ dùng mã nguồn được cấp.\n4. Trả về duy nhất JSON hợp lệ, không markdown, đúng schema:\n{\"status\":\"generated|needs_clarification|out_of_scope\",\"question\":\"...\",\"answers\":[\"...\",\"...\",\"...\",\"...\"],\"correctIndex\":0,\"explanation\":\"...\",\"provenance\":[{\"ref\":\"SYN-...\",\"quote\":\"trích ngắn từ nguồn\"}],\"confidence\":\"high|low\",\"reason\":\"...\"}`;
}

export async function generateQuiz({ lessonKey, task, caseId = 'interactive' }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw appError('Thiếu GEMINI_API_KEY. Hãy đặt key trong biến môi trường trước khi chạy.', 'MISSING_API_KEY', 503);

  const lesson = getLesson(lessonKey);
  if (!lesson) throw appError('Bài học không hợp lệ.', 'UNKNOWN_LESSON', 400);

  const startedAt = new Date().toISOString();
  const started = performance.now();
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const prompt = buildPrompt(lesson, task);
  let response;
  try {
    response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      // Interactions API requires an array of user-input steps when store=false.
      // Keeping the request stateless prevents one eval case from affecting another.
      body: JSON.stringify({
        model,
        store: false,
        input: [{ type: 'user_input', content: prompt }]
      })
    });
  } catch {
    throw appError('Không kết nối được Gemini API.', 'NETWORK_ERROR', 502);
  }

  const rawPayload = await response.text();
  let payload = {};
  try {
    payload = rawPayload ? JSON.parse(rawPayload) : {};
  } catch {
    payload = {};
  }
  if (!response.ok && rawPayload.trim()) {
    const detail = payload?.error?.message || payload?.message || rawPayload.trim().slice(0, 500);
    throw appError(`Gemini API HTTP ${response.status}: ${detail}`, 'GEMINI_API_ERROR', response.status);
  }
  if (!response.ok) {
    const message = payload?.error?.message || `Gemini API trả về HTTP ${response.status}.`;
    throw appError(message, 'GEMINI_API_ERROR', response.status);
  }

  const result = validateResult(parseJson(readOutputText(payload)), lesson);
  return {
    result,
    trace: {
      caseId,
      provider: 'Gemini Interactions API',
      model: payload.model || model,
      interactionId: payload.id || null,
      startedAt,
      durationMs: Math.round(performance.now() - started),
      sourceRefs: result.provenance.map((item) => item.ref),
      status: result.status
    }
  };
}
