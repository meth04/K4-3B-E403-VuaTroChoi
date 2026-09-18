import { getLesson } from './codebase/lesson-fixtures.mjs';
const OPENAI_ENDPOINT = 'http://localhost:20128/v1/chat/completions';
const apiKey = 'sk-da6f5da3604d3663-jp8mwo-45708b37';

function buildPrompt(lesson, task) {
  const sources = lesson.passages.map((passage) => `- [${passage.ref}] ${passage.text}`).join('\n');
  return `Bạn là bộ sinh câu hỏi trắc nghiệm cho giảng viên...`; // Just a dummy prompt
}

async function main() {
  const lesson = getLesson('dataPack');
  const response = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${apiKey}` 
    },
    body: JSON.stringify({
      model: 'ag/gemini-3.7-flash-high',
      messages: [{ role: 'user', content: 'Sinh câu hỏi' }]
    })
  });
  console.log(response.status);
  console.log(response.headers);
  const text = await response.text();
  console.log(text);
}
main();
